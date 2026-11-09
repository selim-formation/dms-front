/**
 * TanStack Query Key Factory for galleries and their images (tenant-scoped).
 * Everything lives under one root so any write refreshes both resources at once.
 */

import type { GalleryFilters, ImageFilters } from '../types/gallery.types';

export const galleryKeys = {
    all: (tenant: string) => ['galleries', tenant] as const,
    lists: (tenant: string) => [...galleryKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: GalleryFilters) => [...galleryKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...galleryKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...galleryKeys.details(tenant), id] as const,
    imageLists: (tenant: string) => [...galleryKeys.all(tenant), 'images'] as const,
    imageList: (tenant: string, filters: ImageFilters) => [...galleryKeys.imageLists(tenant), filters] as const,
};
