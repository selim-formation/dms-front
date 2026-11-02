/**
 * Normalises API errors (Laravel 422 shape) for form display.
 */

import type { ApiError } from '@/core/api/types';

export function toApiError(error: unknown): Partial<ApiError> | null {
    return error && typeof error === 'object' ? (error as Partial<ApiError>) : null;
}

/** `{ title: 'msg', sections: 'msg' }` — `sections.0` collapses into `sections`. */
export function fieldErrors(error: unknown): Record<string, string> {
    const errors = toApiError(error)?.errors;
    const out: Record<string, string> = {};
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const field = key.split('.')[0];
        if (!out[field] && messages?.[0]) out[field] = messages[0];
    }
    return out;
}

export function errorStatus(error: unknown): number | undefined {
    return toApiError(error)?.status;
}

export function errorMessage(error: unknown): string | null {
    return toApiError(error)?.message ?? null;
}
