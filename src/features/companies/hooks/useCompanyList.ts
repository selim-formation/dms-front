import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { companyApiService } from '../api/companyApi';
import { companyKeys } from '../api/companyKeys';
import type { Company, CompanyFilters } from '../types/company.types';

const EMPTY: Company[] = [];

/** Always paginated; responses are never cached server-side, so keep staleTime short. */
export function useCompanyList(filters: CompanyFilters) {
    const query = useQuery({
        queryKey: companyKeys.list(filters),
        queryFn: ({ signal }) => companyApiService.fetchList(filters, signal),
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        companies: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
