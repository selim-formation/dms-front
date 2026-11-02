import { useMutation } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { useProjectCache } from './useProjectCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ProjectPayload } from '../types/project.types';

export function useCreateProject() {
    const { tenant, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: (payload: ProjectPayload) => projectsApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateProject() {
    const { tenant, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ProjectPayload }) =>
            projectsApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
