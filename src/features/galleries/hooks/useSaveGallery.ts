import { useMutation } from '@tanstack/react-query';
import { galleriesApi } from '../api/galleryApi';
import { galleryKeys } from '../api/galleryKeys';
import { useGalleryCache } from './useGalleryCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { GalleryPayload } from '../types/gallery.types';

export function useCreateGallery() {
    const { tenant, queryClient, invalidate } = useGalleryCache();

    return useMutation({
        mutationFn: (payload: GalleryPayload) => galleriesApi.create(requireTenant(tenant), payload),
        onSuccess: (created) => {
            if (tenant) queryClient.setQueryData(galleryKeys.detail(tenant, created.id), created);
            invalidate();
        },
    });
}

export function useUpdateGallery() {
    const { tenant, queryClient, invalidate } = useGalleryCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: GalleryPayload }) =>
            galleriesApi.update(requireTenant(tenant), id, payload),
        onSuccess: (updated) => {
            if (tenant) queryClient.setQueryData(galleryKeys.detail(tenant, updated.id), updated);
            invalidate();
        },
    });
}
