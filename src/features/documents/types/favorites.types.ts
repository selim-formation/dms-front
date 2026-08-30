/**
 * Favorites Types
 * Matches backend API contract for favorites
 */

/**
 * Document information in favorite
 */
export interface FavoriteDocumentInfo {
    id: number;
    title: string;
    description: string | null;
}

/**
 * User information in favorite
 */
export interface FavoriteUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Favorite record from API
 */
export interface FavoriteData {
    id: number;
    document: FavoriteDocumentInfo;
    user: FavoriteUser;
    note: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Pagination links for favorites list
 */
export interface FavoritesLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

/**
 * Pagination meta for favorites list
 */
export interface FavoritesMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

/**
 * Params for listing favorites
 */
export interface FavoritesListParams {
    per_page?: number;
    page?: number;
}

/**
 * Paginated favorites payload
 */
export interface FavoritesPaginatedData {
    data: FavoriteData[];
    links: FavoritesLinks;
    meta: FavoritesMeta;
}

/**
 * API Response for paginated favorites list
 */
export interface GetFavoritesApiResponse {
    data: FavoritesPaginatedData;
    message: string;
}

/**
 * API Response for last favorites (plain array, no pagination)
 */
export interface GetLastFavoritesApiResponse {
    data: FavoriteData[];
    message: string;
}

/**
 * API Response for a single favorite
 */
export interface GetFavoriteApiResponse {
    data: FavoriteData;
    message: string;
}

/**
 * API Response for creating a favorite
 */
export interface CreateFavoriteApiResponse {
    data: FavoriteData;
    message: string;
}

/**
 * API Response for updating a favorite
 */
export interface UpdateFavoriteApiResponse {
    data: FavoriteData;
    message: string;
}

/**
 * API Response for removing a favorite
 */
export interface DeleteFavoriteApiResponse {
    data: null;
    message: string;
}
