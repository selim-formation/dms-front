import { useMutation } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { useSectionCache } from './useSectionCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { SectionPayload } from '../types/section.types';

export function useCreateSection() {
    const { tenant, invalidate } = useSectionCache();

    return useMutation({
        mutationFn: (payload: SectionPayload) => sectionsApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateSection() {
    const { tenant, invalidate } = useSectionCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: SectionPayload }) =>
            sectionsApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
