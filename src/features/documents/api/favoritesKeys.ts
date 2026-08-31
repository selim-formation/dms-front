/**
 * TanStack Query Key Factory for Favorites
 *
 * Defines all query keys for the favorites feature using best practices.
 * Favorites are scoped per-tenant AND per-user (the backend derives the
 * user from the auth session) — keying by tenant here means switching
 * tenants can never serve a stale favorites list from another tenant's
 * cache entry while the real fetch for the new tenant is in flight.
 */

import type { FavoritesListParams } from '../types/favorites.types';

export const favoritesKeys = {
    all: (tenant: string) => ['favorites', tenant] as const,
    lists: (tenant: string) => [...favoritesKeys.all(tenant), 'list'] as const,
    list: (tenant: string, params?: FavoritesListParams) =>
        [...favoritesKeys.lists(tenant), params ?? {}] as const,
    lasts: (tenant: string) => [...favoritesKeys.all(tenant), 'last'] as const,
    last: (tenant: string) => [...favoritesKeys.lasts(tenant)] as const,
    details: (tenant: string) => [...favoritesKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, favoriteId: number) =>
        [...favoritesKeys.details(tenant), favoriteId] as const,
};
