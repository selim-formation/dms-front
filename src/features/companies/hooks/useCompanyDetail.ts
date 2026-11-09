import { useQuery } from '@tanstack/react-query';
import { companyApiService } from '../api/companyApi';
import { companyKeys } from '../api/companyKeys';

/** Lazy single-company fetch (includes `permission_ids`; trashed companies can be opened). Pass `null` to stay idle. */
export function useCompanyDetail(id: string | null) {
    const query = useQuery({
        queryKey: id !== null ? companyKeys.detail(id) : ['company-management', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (id === null) throw new Error('Id is required');
            return companyApiService.fetchOne(id, signal);
        },
        enabled: id !== null,
        staleTime: 10 * 1000,
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        company: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
