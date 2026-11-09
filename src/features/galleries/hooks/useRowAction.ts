/**
 * delete / restore / force delete of one gallery or image, with optimistic removal
 * from every cached list page of that resource (each of these moves the row out of
 * the current view); rolled back on error. Everything is refreshed afterwards.
 */
import { useMutation } from '@tanstack/react-query';
import { galleriesApi, galleryImagesApi } from '../api/galleryApi';
import { galleryKeys } from '../api/galleryKeys';
import { useGalleryCache } from './useGalleryCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { GalleryBulkAction, Paginated } from '../types/gallery.types';

export type GalleryResource = 'galleries' | 'images';
export type RowAction = GalleryBulkAction;

const apiOf = (resource: GalleryResource) => (resource === 'galleries' ? galleriesApi : galleryImagesApi);

export function useRowAction(resource: GalleryResource, action: RowAction) {
    const { tenant, queryClient, invalidate } = useGalleryCache();
    const listsKey = (t: string) => (resource === 'galleries' ? galleryKeys.lists(t) : galleryKeys.imageLists(t));

    return useMutation({
        mutationFn: async (id: number) => {
            const t = requireTenant(tenant);
            const api = apiOf(resource);
            if (action === 'delete') await api.remove(t, id);
            else if (action === 'restore') await api.restore(t, id);
            else await api.forceDelete(t, id);
        },
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: listsKey(tenant) });
            const previous = queryClient.getQueriesData<Paginated<{ id: number }>>({ queryKey: listsKey(tenant) });
            queryClient.setQueriesData<Paginated<{ id: number }>>(
                { queryKey: listsKey(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((x) => x.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
