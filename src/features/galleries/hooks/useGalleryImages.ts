import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { galleryImagesApi } from '../api/galleryApi';
import { galleryKeys } from '../api/galleryKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { GalleryImage, ImageFilters } from '../types/gallery.types';

const EMPTY: GalleryImage[] = [];
/** Picture links last 2 hours: reuse the page for up to one. */
const LINK_STALE_MS = 60 * 60 * 1000;

export function useGalleryImages(filters: ImageFilters, enabled = true) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? galleryKeys.imageList(tenant, filters) : ['galleries', 'images', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch images');
            return galleryImagesApi.fetchList(tenant, filters, signal);
        },
        enabled: enabled && !!tenant,
        placeholderData: keepPreviousData,
        staleTime: LINK_STALE_MS,
        gcTime: LINK_STALE_MS,
    });

    return {
        images: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
