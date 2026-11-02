/**
 * Reference Data API — Types / Entities / Departments
 *
 * All three are flat, unpaginated `{ data: [...], message }` lists —
 * NOT the paginated-collection shape used by favorites/pinned-documents/
 * teams (`data.data` + `data.links` + `data.meta`). Don't reuse an
 * "unwrap paginator" helper here; these are already the final array.
 */

import { apiClient } from '@/core/api/client';
import { apiEndpoints, buildApiUrl } from '@/config/api.config';
import { logger } from '@/shared/utils/logger';
import type { PermissionItem, ReferenceItem, ReferenceListApiResponse } from '../types/referenceData.types';

const log = logger.createScoped('ReferenceDataApi');

async function fetchReferenceList(
    tenant: string,
    endpoint: string,
    label: string,
): Promise<ReferenceItem[]> {
    try {
        log.info(`Fetching ${label} for tenant: ${tenant}`);

        const url = buildApiUrl(endpoint, { tenant });
        const response = await apiClient.getInstance().get<ReferenceListApiResponse>(url);

        return response.data.data ?? [];
    } catch (error) {
        log.error(`Failed to fetch ${label}`, { error });
        throw error;
    }
}

export function getTypes(tenant: string): Promise<ReferenceItem[]> {
    return fetchReferenceList(tenant, apiEndpoints.types.list, 'types');
}

export function getEntities(tenant: string): Promise<ReferenceItem[]> {
    return fetchReferenceList(tenant, apiEndpoints.entities.list, 'entities');
}

export function getSections(tenant: string): Promise<ReferenceItem[]> {
    return fetchReferenceList(tenant, apiEndpoints.sections.list, 'sections');
}

export function getDepartments(tenant: string): Promise<ReferenceItem[]> {
    return fetchReferenceList(tenant, apiEndpoints.departments.list, 'departments');
}

/**
 * Tenant permission catalog (role form picker). Accepts both the flat array
 * and the paginated `{ data: [...] }` payload so a backend change can't break it.
 */
export async function getPermissions(tenant: string): Promise<PermissionItem[]> {
    const url = buildApiUrl(apiEndpoints.permissions.list, { tenant });
    const response = await apiClient
        .getInstance()
        .get<{ data: PermissionItem[] | { data: PermissionItem[] } }>(url);
    const payload = response.data.data;
    const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return items.map(({ id, name }) => ({ id, name }));
}
