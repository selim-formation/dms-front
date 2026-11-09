import { useMutation } from '@tanstack/react-query';
import { companyApiService } from '../api/companyApi';
import { useCompanyCache } from './useCompanyCache';
import type { CompanyBulkAction } from '../types/company.types';

/**
 * All-or-nothing: 422 `errors.ids` names what blocked it; a permanent delete that finds
 * something new under the lock answers 409 and deletes nothing.
 */
export function useBulkCompanies() {
    const { invalidate } = useCompanyCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: CompanyBulkAction; ids: string[] }) => companyApiService.bulk(action, ids),
        onSettled: invalidate,
    });
}
