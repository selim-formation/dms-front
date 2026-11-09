import { useMutation } from '@tanstack/react-query';
import { galleriesApi, galleryImagesApi } from '../api/galleryApi';
import { useGalleryCache } from './useGalleryCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { GalleryBulkAction } from '../types/gallery.types';
import type { GalleryResource } from './useRowAction';

/** All-or-nothing: one item that can't be used makes the server refuse the whole call (422 on `ids`). */
export function useBulkAction(resource: GalleryResource) {
    const { tenant, invalidate } = useGalleryCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: GalleryBulkAction; ids: number[] }) =>
            (resource === 'galleries' ? galleriesApi : galleryImagesApi).bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
