/**
 * delete / restore / force delete of one company. Each moves the row out of the
 * current tab, so it is removed optimistically from every cached list page and
 * rolled back on error. Details and the company switcher are refreshed afterwards.
 */
import { useMutation } from '@tanstack/react-query';
import { companyApiService } from '../api/companyApi';
import { companyKeys } from '../api/companyKeys';
import { useCompanyCache } from './useCompanyCache';
import type { CompaniesPaginatedData, CompanyRowAction } from '../types/company.types';

export function useCompanyRowAction(action: CompanyRowAction) {
    const { queryClient, invalidate } = useCompanyCache();

    return useMutation({
        mutationFn: async (id: string) => {
            if (action === 'delete') await companyApiService.remove(id);
            else if (action === 'restore') await companyApiService.restore(id);
            else await companyApiService.forceDelete(id);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: companyKeys.lists() });
            const previous = queryClient.getQueriesData<CompaniesPaginatedData>({ queryKey: companyKeys.lists() });
            queryClient.setQueriesData<CompaniesPaginatedData>(
                { queryKey: companyKeys.lists() },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((c) => c.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
