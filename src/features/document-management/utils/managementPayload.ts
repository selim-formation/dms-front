/**
 * Pure helpers: tabs, params, tones and bulk-action rules.
 */

import type {
    BulkAction,
    DocumentCategory,
    DocumentStatus,
    Importance,
    ManagedDocument,
    ManagementFilters,
    ManagementTab,
    StatusToneAlias,
} from '../types/management.types';

export const DOCUMENTS_PER_PAGE = 15;
export const NOTE_MAX = 1000;

export const TABS: ManagementTab[] = ['all', 'approved', 'rejected', 'pending', 'trash'];
export const IMPORTANCES: Importance[] = ['critical', 'high', 'medium', 'low', 'informational', 'archival'];
export const CATEGORIES: DocumentCategory[] = ['establishment', 'operational'];

/** A tab is just a preset of the status / trashed filters. */
export function tabFilters(tab: ManagementTab): Pick<ManagementFilters, 'status' | 'trashed'> {
    switch (tab) {
        case 'approved':
        case 'rejected':
        case 'pending':
            return { status: tab };
        case 'trash':
            return { trashed: 'only' };
        default:
            return {};
    }
}

export function buildManagementParams(f: ManagementFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? DOCUMENTS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status) params['filter[status]'] = f.status;
    if (f.importance) params['filter[importance]'] = f.importance;
    if (f.category) params['filter[category]'] = f.category;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

const STATUS_TONES: Record<DocumentStatus, StatusToneAlias> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
};

const IMPORTANCE_TONES: Record<Importance, StatusToneAlias> = {
    critical: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'neutral',
    informational: 'neutral',
    archival: 'neutral',
};

export const statusTone = (s: DocumentStatus): StatusToneAlias => STATUS_TONES[s];
export const importanceTone = (i: Importance): StatusToneAlias => IMPORTANCE_TONES[i];

/** Bulk actions offered in a tab, already filtered by the user's permissions. */
export function bulkActionsFor(
    tab: ManagementTab,
    can: { delete: boolean; restore: boolean; forceDelete: boolean },
): BulkAction[] {
    if (tab === 'trash') {
        return [...(can.restore ? (['restore'] as const) : []), ...(can.forceDelete ? (['force_delete'] as const) : [])];
    }
    return can.delete ? ['delete'] : [];
}

/** All-or-nothing bulk: only rows the server will accept may be selected. */
export function isSelectable(doc: ManagedDocument, tab: ManagementTab): boolean {
    return tab === 'trash' ? doc.abilities.restore || doc.abilities.force_delete : doc.abilities.delete;
}
