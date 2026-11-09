/**
 * Storage connection contracts — /api/{tenant}/storage-connections
 * (where a company's document files are kept).
 */

import type {
    ApiEnvelope,
    DepartmentPaginationMeta,
} from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type StorageProvider = 's3_compatible' | 'sharepoint' | 'local';
export type StorageStatus = 'pending' | 'active' | 'disabled' | 'error';
export type StorageActionKind = 'default' | 'disable' | 'delete';

/** Which buttons to show right now for this user. Never re-implement these rules. */
export interface StorageAbilities {
    update: boolean;
    test: boolean;
    set_default: boolean;
    disable: boolean;
    rotate: boolean;
    delete: boolean;
}

export interface StorageConnection {
    id: number;
    name: string;
    provider: StorageProvider;
    status: StorageStatus;
    is_default: boolean;
    writable: boolean;
    /** Non-secret settings of the provider. */
    configuration: Record<string, string>;
    /** Secrets are write-only: only this flag is ever returned. */
    credentials_set: boolean;
    credentials_expires_at: string | null;
    last_tested_at: string | null;
    last_test_error: string | null;
    abilities: StorageAbilities;
    created_at: string;
    updated_at: string;
}

export type TestStep = 'write' | 'size' | 'read' | 'compare' | 'delete';

export interface TestResult {
    passed: boolean;
    steps: Record<TestStep, boolean>;
    failure: string | null;
}

export type StorageSort =
    | 'name' | '-name'
    | 'status' | '-status'
    | 'provider' | '-provider'
    | 'created_at' | '-created_at'
    | 'last_tested_at' | '-last_tested_at';

export interface StorageFilters {
    search?: string;
    status?: StorageStatus;
    provider?: StorageProvider;
    /** Absent = the default connection first, then by name. */
    sort?: StorageSort;
    page?: number;
    perPage?: number;
}

export interface StoragePaginatedData {
    data: StorageConnection[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export type CreateStorageConnection =
    | {
          name: string;
          provider: 's3_compatible';
          configuration: { bucket: string; region: string; endpoint?: string; root?: string };
          credentials: { access_key: string; secret_key: string };
          credentials_expires_at?: string;
      }
    | {
          name: string;
          provider: 'sharepoint';
          configuration: { drive_id: string };
          credentials: { azure_tenant_id: string; client_id: string; client_secret: string };
          credentials_expires_at?: string;
      }
    | { name: string; provider: 'local'; configuration: { directory: string } };

/** Name and / or the whole configuration object; provider and credentials are refused here. */
export interface UpdateStoragePayload {
    name?: string;
    configuration?: Record<string, string>;
}

export interface ReplaceCredentialsPayload {
    credentials: Record<string, string>;
    /** Replaced too: leaving it out clears it. */
    credentials_expires_at?: string;
}
