/**
 * Config-driven field definitions per provider: one renderer builds every form
 * (create, edit settings, replace credentials) from these.
 */

import type { StorageProvider } from '../types/storage.types';

export type FieldSection = 'configuration' | 'credentials';

export interface ProviderField {
    key: string;
    section: FieldSection;
    required: boolean;
    /** Rendered as a password input and never prefilled. */
    secret?: boolean;
    max?: number;
    /** Extra validation rule id (see storagePayload). */
    rule?: 'https' | 'directory';
}

export const PROVIDERS: StorageProvider[] = ['s3_compatible', 'sharepoint', 'local'];

export const PROVIDER_FIELDS: Record<StorageProvider, ProviderField[]> = {
    s3_compatible: [
        { key: 'bucket', section: 'configuration', required: true, max: 63 },
        { key: 'region', section: 'configuration', required: true, max: 40 },
        { key: 'endpoint', section: 'configuration', required: false, rule: 'https' },
        { key: 'root', section: 'configuration', required: false },
        { key: 'access_key', section: 'credentials', required: true, secret: true },
        { key: 'secret_key', section: 'credentials', required: true, secret: true },
    ],
    sharepoint: [
        { key: 'drive_id', section: 'configuration', required: true },
        { key: 'azure_tenant_id', section: 'credentials', required: true, secret: true },
        { key: 'client_id', section: 'credentials', required: true, secret: true },
        { key: 'client_secret', section: 'credentials', required: true, secret: true },
    ],
    local: [{ key: 'directory', section: 'configuration', required: true, max: 100, rule: 'directory' }],
};

export const fieldsOf = (provider: StorageProvider, section: FieldSection): ProviderField[] =>
    PROVIDER_FIELDS[provider].filter((f) => f.section === section);

export const hasCredentials = (provider: StorageProvider): boolean => provider !== 'local';
