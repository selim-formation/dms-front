import { useMutation } from '@tanstack/react-query';
import { companyApiService } from '../api/companyApi';
import { useCompanyCache } from './useCompanyCache';
import type { CompanyCreatePayload, CompanyEditPayload } from '../types/company.types';

/** The answer is the full company: seed the caches, then refresh lists and the company switcher. */
export function useCreateCompany() {
    const { replaceCompany, invalidate } = useCompanyCache();

    return useMutation({
        mutationFn: (payload: CompanyCreatePayload) => companyApiService.create(payload),
        onSuccess: (created) => {
            replaceCompany(created);
            invalidate();
        },
    });
}

export function useUpdateCompany() {
    const { replaceCompany, invalidate } = useCompanyCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CompanyEditPayload }) => companyApiService.update(id, payload),
        onSuccess: (updated) => {
            replaceCompany(updated);
            invalidate();
        },
    });
}
