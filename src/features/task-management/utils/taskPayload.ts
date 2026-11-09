/**
 * Pure helpers: tabs, query params, tones and bulk-action rules.
 */

import type {
    StatusTone,
    Task,
    TaskBulkAction,
    TaskFilters,
    TaskPriority,
    TaskStatus,
    TaskTab,
    TaskType,
} from '../types/task.types';

export const TASKS_PER_PAGE = 15;

export const TABS: TaskTab[] = ['all', 'todo', 'in_progress', 'completed', 'blocked', 'cancelled', 'overdue', 'trash'];
export const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED'];
export const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const TASK_TYPES: TaskType[] = [
    'CREATE_DOCUMENT',
    'UPDATE_DOCUMENT',
    'REVIEW_DOCUMENT',
    'APPROVE_DOCUMENT',
    'UPLOAD_VERSION',
    'ARCHIVE_DOCUMENT',
    'DELETE_DOCUMENT',
    'RESTORE_DOCUMENT',
];

const TAB_STATUS: Partial<Record<TaskTab, TaskStatus>> = {
    todo: 'TODO',
    in_progress: 'IN_PROGRESS',
    completed: 'COMPLETED',
    blocked: 'BLOCKED',
    cancelled: 'CANCELLED',
};

export function tabFilters(tab: TaskTab): Pick<TaskFilters, 'status' | 'overdue' | 'trashed'> {
    const status = TAB_STATUS[tab];
    if (status) return { status: [status] };
    if (tab === 'overdue') return { overdue: true };
    if (tab === 'trash') return { trashed: 'only' };
    return {};
}

/** Lists are sent comma separated (`filter[status]=TODO,IN_PROGRESS`); arrays (`[]`) are a 422. */
export function buildTaskParams(f: TaskFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: f.page ?? 1,
        per_page: f.perPage ?? TASKS_PER_PAGE,
    };
    if (f.search) params.search = f.search;
    if (f.sort) params.sort = f.sort;
    if (f.status?.length) params['filter[status]'] = f.status.join(',');
    if (f.priority?.length) params['filter[priority]'] = f.priority.join(',');
    if (f.taskType) params['filter[task_type]'] = f.taskType;
    if (f.scope) params['filter[scope]'] = f.scope;
    if (f.overdue) params['filter[overdue]'] = 1;
    if (f.trashed) params['filter[trashed]'] = f.trashed;
    return params;
}

const STATUS_TONES: Record<TaskStatus, StatusTone> = {
    TODO: 'neutral',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    BLOCKED: 'warning',
    CANCELLED: 'danger',
};

const PRIORITY_TONES: Record<TaskPriority, StatusTone> = {
    LOW: 'neutral',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'danger',
};

export const statusTone = (s: TaskStatus): StatusTone => STATUS_TONES[s];
export const priorityTone = (p: TaskPriority): StatusTone => PRIORITY_TONES[p];

/** Bulk actions offered in a tab, already filtered by the user's permissions. */
export function bulkActionsFor(
    tab: TaskTab,
    can: { delete: boolean; restore: boolean; forceDelete: boolean },
): TaskBulkAction[] {
    if (tab === 'trash') {
        return [...(can.restore ? (['restore'] as const) : []), ...(can.forceDelete ? (['force_delete'] as const) : [])];
    }
    return can.delete ? ['delete'] : [];
}

/** All-or-nothing bulk: only rows the server will accept may be selected. */
export function isSelectable(task: Task, tab: TaskTab): boolean {
    return tab === 'trash' ? task.abilities.restore || task.abilities.force_delete : task.abilities.delete;
}

/** `2026-12-31T00:00:00.000000Z` → `2026-12-31` for `<input type="date">` and the payload. */
export const toDateInput = (iso: string | null): string => (iso ? iso.slice(0, 10) : '');
