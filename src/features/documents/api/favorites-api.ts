/**
 * Favorites API Functions
 *
 * Handles API calls for favorites with real API integration
 * Thin functional wrapper around FavoritesApiService
 */

import { favoritesApiService } from './favoritesApi';
import { logger } from '@/shared/utils/logger';
import type {
    FavoriteData,
    FavoritesListParams,
    FavoritesPaginatedData,
} from '../types/favorites.types';

const log = logger.createScoped('favoritesApi');

export async function getFavorites(
    tenant: string,
    params: FavoritesListParams = {}
): Promise<FavoritesPaginatedData> {
    try {
        log.info('Fetching favorites from API', { tenant, params });
        const favorites = await favoritesApiService.fetchFavorites(tenant, params);
        log.info(`Successfully fetched ${favorites.data.length} favorites`);
        return favorites;
    } catch (error) {
        log.error('Failed to fetch favorites', { error });
        throw error;
    }
}

export async function getLastFavorites(tenant: string): Promise<FavoriteData[]> {
    try {
        log.info('Fetching last favorites from API', { tenant });
        const favorites = await favoritesApiService.fetchLastFavorites(tenant);
        log.info(`Successfully fetched ${favorites.length} last favorites`);
        return favorites;
    } catch (error) {
        log.error('Failed to fetch last favorites', { error });
        throw error;
    }
}

export async function getFavorite(tenant: string, favoriteId: number): Promise<FavoriteData> {
    try {
        log.info('Fetching favorite from API', { tenant, favoriteId });
        return await favoritesApiService.fetchFavorite(tenant, favoriteId);
    } catch (error) {
        log.error('Failed to fetch favorite', { error });
        throw error;
    }
}

export async function createFavorite(
    tenant: string,
    documentId: number,
    note?: string
): Promise<FavoriteData> {
    try {
        log.info('Adding favorite from API', { tenant, documentId });
        const favorite = await favoritesApiService.createFavorite(tenant, documentId, note);
        log.info('Successfully added favorite', { documentId });
        return favorite;
    } catch (error) {
        log.error('Failed to add favorite', { error });
        throw error;
    }
}

export async function updateFavorite(
    tenant: string,
    favoriteId: number,
    note: string
): Promise<FavoriteData> {
    try {
        log.info('Updating favorite from API', { tenant, favoriteId });
        const favorite = await favoritesApiService.updateFavorite(tenant, favoriteId, note);
        log.info('Successfully updated favorite', { favoriteId });
        return favorite;
    } catch (error) {
        log.error('Failed to update favorite', { error });
        throw error;
    }
}

export async function deleteFavorite(tenant: string, favoriteId: number): Promise<void> {
    try {
        log.info('Removing favorite from API', { tenant, favoriteId });
        await favoritesApiService.deleteFavorite(tenant, favoriteId);
        log.info('Successfully removed favorite', { favoriteId });
    } catch (error) {
        log.error('Failed to remove favorite', { error });
        throw error;
    }
}
