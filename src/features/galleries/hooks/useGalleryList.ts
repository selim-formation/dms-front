import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { galleriesApi } from '../api/galleryApi';
import { galleryKeys } from '../api/galleryKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { Gallery, GalleryFilters } from '../types/gallery.types';

const EMPTY: Gallery[] = [];

/** Always paginated; never cached server-side, so keep staleTime short (cover links last 2 h). */
export function useGalleryList(filters: GalleryFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? galleryKeys.list(tenant, filters) : ['galleries', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch galleries');
            return galleriesApi.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        galleries: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
