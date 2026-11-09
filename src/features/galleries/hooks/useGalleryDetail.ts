import { useQuery } from '@tanstack/react-query';
import { galleriesApi } from '../api/galleryApi';
import { galleryKeys } from '../api/galleryKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Single gallery (trashed ones can be opened). */
export function useGalleryDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? galleryKeys.detail(tenant, id) : ['galleries', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return galleriesApi.fetchOne(tenant, id, signal);
        },
        enabled: !!tenant && id !== null,
        staleTime: 15 * 1000,
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        gallery: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
