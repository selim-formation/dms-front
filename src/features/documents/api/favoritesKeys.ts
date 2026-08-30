/**
 * TanStack Query Key Factory for Favorites
 *
 * Defines all query keys for the favorites feature using best practices
 */

import type { FavoritesListParams } from '../types/favorites.types';

export const favoritesKeys = {
    all: ['favorites'] as const,
    lists: () => [...favoritesKeys.all, 'list'] as const,
    list: (params?: FavoritesListParams) => [...favoritesKeys.lists(), params ?? {}] as const,
    lasts: () => [...favoritesKeys.all, 'last'] as const,
    last: () => [...favoritesKeys.lasts()] as const,
    details: () => [...favoritesKeys.all, 'detail'] as const,
    detail: (favoriteId: number) => [...favoritesKeys.details(), favoriteId] as const,
};
