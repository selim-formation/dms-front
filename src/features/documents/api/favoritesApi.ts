/**
 * FavoritesApiService - API Service for Favorites
 * Handles all HTTP requests related to document favorites
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type {
    CreateFavoriteApiResponse,
    DeleteFavoriteApiResponse,
    FavoriteData,
    FavoritesListParams,
    FavoritesPaginatedData,
    GetFavoriteApiResponse,
    GetFavoritesApiResponse,
    GetLastFavoritesApiResponse,
    UpdateFavoriteApiResponse,
} from '../types/favorites.types';

const log = logger.createScoped('FavoritesApiService');

/**
 * FavoritesApiService class - Singleton pattern
 * Encapsulates all favorites related API operations
 */
export class FavoritesApiService {
    private static instance: FavoritesApiService;
    private readonly client = apiClient.getInstance();
    private readonly endpoints = apiEndpoints;

    private constructor() {
        log.info('FavoritesApiService initialized');
    }

    public static getInstance(): FavoritesApiService {
        if (!FavoritesApiService.instance) {
            FavoritesApiService.instance = new FavoritesApiService();
        }
        return FavoritesApiService.instance;
    }

    /**
     * Fetch paginated favorites for a tenant
     */
    public async fetchFavorites(
        tenant: string,
        params: FavoritesListParams = {}
    ): Promise<FavoritesPaginatedData> {
        try {
            log.info(`Fetching favorites for tenant: ${tenant}`, { params });

            const url = buildApiUrl(this.endpoints.favorites.list, { tenant });

            const response = await this.client.get<GetFavoritesApiResponse>(url, {
                params,
            });

            if (!response.data || !response.data.data) {
                log.warn('Empty response received from favorites API');
                return { data: [], links: { first: null, last: null, prev: null, next: null }, meta: { current_page: 1, last_page: 1, per_page: params.per_page ?? 10, total: 0 } };
            }

            log.info(`Successfully fetched ${response.data.data.data.length} favorites`);
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch favorites', { error });
            throw error;
        }
    }

    /**
     * Fetch last favorites for a tenant (max 5, no pagination)
     */
    public async fetchLastFavorites(tenant: string): Promise<FavoriteData[]> {
        try {
            log.info(`Fetching last favorites for tenant: ${tenant}`);

            const url = buildApiUrl(this.endpoints.favorites.last, { tenant });

            const response = await this.client.get<GetLastFavoritesApiResponse>(url);

            if (!response.data || !response.data.data) {
                log.warn('Empty response received from last favorites API');
                return [];
            }

            // Backend may wrap the array as { data: [...] } directly, or double-nest
            // it as { data: { data: [...] } } (same inconsistency as pinned-documents/last)
            const payload = response.data.data as unknown;
            const favorites: FavoriteData[] = Array.isArray(payload)
                ? payload
                : ((payload as { data?: FavoriteData[] })?.data ?? []);

            log.info(`Successfully fetched ${favorites.length} last favorites`);
            return favorites;
        } catch (error) {
            log.error('Failed to fetch last favorites', { error });
            throw error;
        }
    }

    /**
     * Fetch a single favorite by id
     */
    public async fetchFavorite(tenant: string, favoriteId: number): Promise<FavoriteData> {
        try {
            log.info(`Fetching favorite for tenant: ${tenant}`, { favoriteId });

            const url = buildApiUrl(this.endpoints.favorites.view, { tenant, id: favoriteId });

            const response = await this.client.get<GetFavoriteApiResponse>(url);

            log.info('Successfully fetched favorite', { favoriteId });
            return response.data.data;
        } catch (error) {
            log.error('Failed to fetch favorite', { error });
            throw error;
        }
    }

    /**
     * Add a document to favorites
     */
    public async createFavorite(
        tenant: string,
        documentId: number,
        note?: string
    ): Promise<FavoriteData> {
        try {
            log.info(`Adding favorite for tenant: ${tenant}`, { documentId });

            const url = buildApiUrl(this.endpoints.favorites.create, { tenant });

            const response = await this.client.post<CreateFavoriteApiResponse>(url, {
                document_id: documentId,
                ...(note ? { note } : {}),
            });

            log.info('Successfully added favorite', { documentId, data: response.data.data });
            return response.data.data;
        } catch (error) {
            log.error('Failed to add favorite', { error });
            throw error;
        }
    }

    /**
     * Update a favorite's note
     */
    public async updateFavorite(
        tenant: string,
        favoriteId: number,
        note: string
    ): Promise<FavoriteData> {
        try {
            log.info(`Updating favorite for tenant: ${tenant}`, { favoriteId });

            const url = buildApiUrl(this.endpoints.favorites.update, { tenant, id: favoriteId });

            const response = await this.client.put<UpdateFavoriteApiResponse>(url, { note });

            log.info('Successfully updated favorite', { favoriteId });
            return response.data.data;
        } catch (error) {
            log.error('Failed to update favorite', { error });
            throw error;
        }
    }

    /**
     * Remove a document from favorites
     */
    public async deleteFavorite(tenant: string, favoriteId: number): Promise<void> {
        try {
            log.info(`Removing favorite for tenant: ${tenant}`, { favoriteId });

            const url = buildApiUrl(this.endpoints.favorites.delete, { tenant, id: favoriteId });

            await this.client.delete<DeleteFavoriteApiResponse>(url);

            log.info('Successfully removed favorite', { favoriteId });
        } catch (error) {
            log.error('Failed to remove favorite', { error });
            throw error;
        }
    }
}

/**
 * Export singleton instance
 */
export const favoritesApiService = FavoritesApiService.getInstance();
