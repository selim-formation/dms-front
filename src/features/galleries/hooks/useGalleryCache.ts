import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { galleryKeys } from '../api/galleryKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Image changes move `images_count` and the cover, so galleries and images always refresh together. */
export function useGalleryCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: galleryKeys.all(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
