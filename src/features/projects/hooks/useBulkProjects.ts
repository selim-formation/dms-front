import { useMutation } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { useProjectCache } from './useProjectCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ProjectBulkAction } from '../types/project.types';

export function useBulkProjects() {
    const { tenant, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: ProjectBulkAction; ids: number[] }) =>
            projectsApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
