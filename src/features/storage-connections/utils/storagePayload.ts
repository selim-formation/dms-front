/**
 * Pure helpers: list params, validation, payload building, status tones, expiry.
 */

import { PROVIDER_FIELDS, fieldsOf, hasCredentials, type FieldSection } from './providerFields';
import { toApiError } from '@/features/departments/utils/departmentErrors';
import type { StatusTone } from '@/features/document-imports/types/import.types';
import type {
    CreateStorageConnection,
    StorageConnection,
    StorageFilters,
    StorageProvider,
    StorageStatus,
    UpdateStoragePayload,
} from '../types/storage.types';

export const STORAGE_PER_PAGE = 15;
export const NAME_MAX = 100;
export const SEARCH_MAX = 100;
export const STATUSES: StorageStatus[] = ['pending', 'active', 'disabled', 'error'];
/** The panel highlights credentials that stop working within this many days. */
export const EXPIRY_WARN_DAYS = 30;
/** The API allows 5 tests a minute per user. */
export const TEST_COOLDOWN_MS = 60_000;

export function buildStorageParams(f: StorageFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? STORAGE_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status) params['filter[status]'] = f.status;
    if (f.provider) params['filter[provider]'] = f.provider;
    return params;
}

const STATUS_TONES: Record<StorageStatus, StatusTone> = {
    active: 'success',
    pending: 'neutral',
    disabled: 'warning',
    error: 'danger',
};
export const statusTone = (s: StorageStatus): StatusTone => STATUS_TONES[s];

export type ExpiryState = 'expired' | 'soon' | 'ok';

export function expiryState(iso: string | null, now = Date.now()): ExpiryState | null {
    if (!iso) return null;
    const diff = new Date(iso).getTime() - now;
    if (Number.isNaN(diff)) return null;
    if (diff <= 0) return 'expired';
    return diff <= EXPIRY_WARN_DAYS * 86_400_000 ? 'soon' : 'ok';
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const DIRECTORY = /^[A-Za-z0-9._-]+$/;

export interface StorageFormValues {
    name: string;
    provider: StorageProvider;
    configuration: Record<string, string>;
    credentials: Record<string, string>;
    credentials_expires_at: string;
}

export const emptyValues = (provider: StorageProvider = 's3_compatible'): StorageFormValues => ({
    name: '',
    provider,
    configuration: {},
    credentials: {},
    credentials_expires_at: '',
});

/** Edit prefill: configuration only; secrets are never returned. */
export const valuesFromConnection = (c: StorageConnection): StorageFormValues => ({
    name: c.name,
    provider: c.provider,
    configuration: { ...c.configuration },
    credentials: {},
    credentials_expires_at: '',
});

export type FormErrors = Record<string, string>;

/** Value is an i18n code under `storage:form.errors`; server messages replace them. */
export function validateSection(
    provider: StorageProvider,
    section: FieldSection,
    values: Record<string, string>,
): FormErrors {
    const e: FormErrors = {};
    for (const f of fieldsOf(provider, section)) {
        const v = (values[f.key] ?? '').trim();
        const key = `${section}.${f.key}`;
        if (!v) {
            if (f.required) e[key] = 'required';
            continue;
        }
        if (f.max && v.length > f.max) e[key] = 'tooLong';
        else if (f.rule === 'https' && !/^https:\/\/\S+$/i.test(v)) e[key] = 'https';
        else if (f.rule === 'directory' && !DIRECTORY.test(v)) e[key] = 'directory';
    }
    return e;
}

export function validateExpiry(value: string): FormErrors {
    if (!value) return {};
    const date = new Date(`${value}T23:59:59`);
    return Number.isNaN(date.getTime()) || date.getTime() <= Date.now() ? { credentials_expires_at: 'expiryFuture' } : {};
}

export function validateName(name: string): FormErrors {
    const v = name.trim();
    if (!v) return { name: 'required' };
    if (v.length > NAME_MAX) return { name: 'tooLong' };
    if (CONTROL_CHARS.test(v)) return { name: 'controlChars' };
    return {};
}

export function validateCreate(v: StorageFormValues): FormErrors {
    return {
        ...validateName(v.name),
        ...validateSection(v.provider, 'configuration', v.configuration),
        ...(hasCredentials(v.provider)
            ? { ...validateSection(v.provider, 'credentials', v.credentials), ...validateExpiry(v.credentials_expires_at) }
            : {}),
    };
}

/** Only the provider's own keys, trimmed, empty optional ones left out. */
export function pickSection(provider: StorageProvider, section: FieldSection, values: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const f of PROVIDER_FIELDS[provider]) {
        if (f.section !== section) continue;
        const v = (values[f.key] ?? '').trim();
        if (v) out[f.key] = v;
    }
    return out;
}

export function buildCreatePayload(v: StorageFormValues): CreateStorageConnection {
    const base = { name: v.name.trim(), provider: v.provider, configuration: pickSection(v.provider, 'configuration', v.configuration) };
    if (v.provider === 'local') return base as CreateStorageConnection;
    const credentials = pickSection(v.provider, 'credentials', v.credentials);
    return {
        ...base,
        credentials,
        ...(v.credentials_expires_at ? { credentials_expires_at: v.credentials_expires_at } : {}),
    } as CreateStorageConnection;
}

export const sameConfiguration = (a: Record<string, string>, b: Record<string, string>): boolean => {
    const ak = Object.keys(a);
    return ak.length === Object.keys(b).length && ak.every((k) => a[k] === b[k]);
};

/** Edit sends only what changed; `null` = nothing to save. */
export function buildUpdatePayload(original: StorageConnection, v: StorageFormValues): UpdateStoragePayload | null {
    const payload: UpdateStoragePayload = {};
    const name = v.name.trim();
    if (name !== original.name) payload.name = name;
    const configuration = pickSection(original.provider, 'configuration', v.configuration);
    if (!sameConfiguration(configuration, original.configuration)) payload.configuration = configuration;
    return Object.keys(payload).length ? payload : null;
}

/** Laravel 422 → { 'configuration.region': msg, credentials: msg, name: msg }; keeps dotted keys. */
export function serverFieldErrors(error: unknown): FormErrors {
    const errors = toApiError(error)?.errors;
    const out: FormErrors = {};
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        if (!out[key] && messages?.[0]) out[key] = messages[0];
    }
    return out;
}

/** The deepest-first lookup: an `errors.credentials` string covers every secret field. */
export const isCode = (message?: string): boolean => !!message && /^[a-zA-Z]+$/.test(message);
