import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { companyKeys } from '../api/companyKeys';
import type { CompaniesPaginatedData, Company } from '../types/company.types';

/**
 * One place that knows what a company change makes stale: this feature's queries and
 * `/api/me` (its `companies` list feeds the company switcher).
 */
export function useCompanyCache() {
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: companyKeys.all });
        queryClient.invalidateQueries({ queryKey: ['auth'] });
    }, [queryClient]);

    /** Swap one company in every cached list page and the detail cache (answers of save / restore calls). */
    const replaceCompany = useCallback(
        (company: Company) => {
            queryClient.setQueryData(companyKeys.detail(company.id), company);
            queryClient.setQueriesData<CompaniesPaginatedData>(
                { queryKey: companyKeys.lists() },
                (old) => old && { ...old, data: old.data.map((c) => (c.id === company.id ? { ...c, ...company } : c)) },
            );
        },
        [queryClient],
    );

    return { queryClient, invalidate, replaceCompany };
}
