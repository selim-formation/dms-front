/**
 * One generic client for both resources (galleries and gallery images share
 * list / show / delete / restore / force delete / bulk); the two instances add
 * their own create / update calls.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { buildGalleryParams, buildImageParams } from '../utils/galleryPayload';
import type {
    AddImagesPayload,
    ApiEnvelope,
    BulkResult,
    Gallery,
    GalleryBulkAction,
    GalleryFilters,
    GalleryImage,
    GalleryPayload,
    ImageFilters,
    Paginated,
    UpdateImagePayload,
} from '../types/gallery.types';

interface Endpoints {
    list: string;
    detail: string;
    restore: string;
    forceDelete: string;
    bulk: string;
}

class ResourceApi<T, F> {
    protected readonly client = apiClient.getInstance();

    protected readonly endpoints: Endpoints;
    private readonly toParams: (filters: F) => Record<string, string | number>;

    constructor(endpoints: Endpoints, toParams: (filters: F) => Record<string, string | number>) {
        this.endpoints = endpoints;
        this.toParams = toParams;
    }

    protected url(endpoint: string, tenant: string, id?: number): string {
        return buildApiUrl(endpoint, id === undefined ? { tenant } : { tenant, id });
    }

    async fetchList(tenant: string, filters: F, signal?: AbortSignal): Promise<Paginated<T>> {
        const res = await this.client.get<ApiEnvelope<Paginated<T>>>(this.url(this.endpoints.list, tenant), {
            params: this.toParams(filters),
            signal,
        });
        return res.data.data;
    }

    async fetchOne(tenant: string, id: number, signal?: AbortSignal): Promise<T> {
        const res = await this.client.get<ApiEnvelope<T>>(this.url(this.endpoints.detail, tenant, id), { signal });
        return res.data.data;
    }

    async remove(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.detail, tenant, id));
    }

    async restore(tenant: string, id: number): Promise<T> {
        const res = await this.client.post<ApiEnvelope<T>>(this.url(this.endpoints.restore, tenant, id));
        return res.data.data;
    }

    async forceDelete(tenant: string, id: number): Promise<void> {
        await this.client.delete(this.url(this.endpoints.forceDelete, tenant, id));
    }

    async bulk(tenant: string, action: GalleryBulkAction, ids: number[]): Promise<BulkResult> {
        const res = await this.client.post<ApiEnvelope<BulkResult>>(this.url(this.endpoints.bulk, tenant), { action, ids });
        return res.data.data;
    }
}

class GalleriesApi extends ResourceApi<Gallery, GalleryFilters> {
    constructor() {
        super(apiEndpoints.galleries, buildGalleryParams);
    }

    async create(tenant: string, payload: GalleryPayload): Promise<Gallery> {
        const res = await this.client.post<ApiEnvelope<Gallery>>(this.url(this.endpoints.list, tenant), payload);
        return res.data.data;
    }

    async update(tenant: string, id: number, payload: GalleryPayload): Promise<Gallery> {
        const res = await this.client.put<ApiEnvelope<Gallery>>(this.url(this.endpoints.detail, tenant, id), payload);
        return res.data.data;
    }
}

class GalleryImagesApi extends ResourceApi<GalleryImage, ImageFilters> {
    constructor() {
        super(apiEndpoints.galleryImages, buildImageParams);
    }

    async add(tenant: string, payload: AddImagesPayload): Promise<GalleryImage[]> {
        const res = await this.client.post<ApiEnvelope<GalleryImage[]>>(this.url(this.endpoints.list, tenant), payload);
        return res.data.data;
    }

    async update(tenant: string, id: number, payload: UpdateImagePayload): Promise<GalleryImage> {
        const res = await this.client.put<ApiEnvelope<GalleryImage>>(this.url(this.endpoints.detail, tenant, id), payload);
        return res.data.data;
    }
}

export type { ResourceApi };
export const galleriesApi = new GalleriesApi();
export const galleryImagesApi = new GalleryImagesApi();
