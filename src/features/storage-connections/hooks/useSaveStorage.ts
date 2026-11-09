import { useMutation } from '@tanstack/react-query';
import { storageApiService } from '../api/storageApi';
import { useStorageCache } from './useStorageCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { CreateStorageConnection, ReplaceCredentialsPayload, UpdateStoragePayload } from '../types/storage.types';

export function useCreateStorage() {
    const { tenant, invalidate } = useStorageCache();

    return useMutation({
        mutationFn: (payload: CreateStorageConnection) => storageApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateStorage() {
    const { tenant, invalidate } = useStorageCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateStoragePayload }) =>
            storageApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}

export function useReplaceCredentials() {
    const { tenant, invalidate } = useStorageCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ReplaceCredentialsPayload }) =>
            storageApiService.replaceCredentials(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
