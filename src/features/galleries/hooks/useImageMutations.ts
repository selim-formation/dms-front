import { useMutation } from '@tanstack/react-query';
import { galleryImagesApi } from '../api/galleryApi';
import { useGalleryCache } from './useGalleryCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { AddImagesPayload, UpdateImagePayload } from '../types/gallery.types';

/** All or nothing: one refused picture creates none (422 on `images.N.upload_id`). */
export function useAddImages() {
    const { tenant, invalidate } = useGalleryCache();

    return useMutation({
        mutationFn: (payload: AddImagesPayload) => galleryImagesApi.add(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateImage() {
    const { tenant, invalidate } = useGalleryCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateImagePayload }) =>
            galleryImagesApi.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
