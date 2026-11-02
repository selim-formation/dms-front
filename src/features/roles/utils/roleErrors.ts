/**
 * Role-specific error reading on top of the shared Laravel-422 helpers.
 */

import { toApiError } from '@/features/departments/utils/departmentErrors';

/** All messages of one error key (e.g. the per-role refusals under `errors.ids`). */
export function errorList(error: unknown, key: string): string[] {
    const list = toApiError(error)?.errors?.[key];
    return Array.isArray(list) ? list.filter(Boolean) : [];
}
