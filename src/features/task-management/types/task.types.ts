/**
 * Task management contracts — /api/{tenant}/task-management.
 * Separate from features/tasks, which keeps the old read-only dashboard routes.
 */

import type { ApiEnvelope, DepartmentPaginationMeta } from '@/features/departments/types/department.types';

export type { ApiEnvelope };

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskType =
    | 'CREATE_DOCUMENT'
    | 'UPDATE_DOCUMENT'
    | 'REVIEW_DOCUMENT'
    | 'APPROVE_DOCUMENT'
    | 'UPLOAD_VERSION'
    | 'ARCHIVE_DOCUMENT'
    | 'DELETE_DOCUMENT'
    | 'RESTORE_DOCUMENT';

export type TaskScope = 'mine' | 'created' | 'assigned';
export type TrashedFilter = 'with' | 'only';
export type TaskBulkAction = 'delete' | 'restore' | 'force_delete';
export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export interface PersonRef {
    id: number;
    name: string;
}

/** Which buttons to show right now. Never re-implement these rules. */
export interface TaskAbilities {
    update: boolean;
    status: boolean;
    delete: boolean;
    restore: boolean;
    force_delete: boolean;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    task_type: TaskType;
    assignee: PersonRef | null;
    creator: PersonRef | null;
    department: { id: number; title: string } | null;
    /** Always carry the link, even when `document` is null (not visible): send back unchanged on edit. */
    document_id: number | null;
    document_version_id: number | null;
    document: { id: number; title: string } | null;
    document_version: { id: number; version: number } | null;
    tags: string[];
    due_date: string | null;
    completed_at: string | null;
    is_overdue: boolean;
    deleted_at: string | null;
    abilities: TaskAbilities;
    created_at: string;
    updated_at: string;
}

export interface TaskCounts {
    all: number;
    todo: number;
    in_progress: number;
    completed: number;
    blocked: number;
    cancelled: number;
    overdue: number;
    trashed: number;
}

/** A tab is a preset of the status / overdue / trashed filters. */
export type TaskTab = 'all' | 'todo' | 'in_progress' | 'completed' | 'blocked' | 'cancelled' | 'overdue' | 'trash';

export type TaskSort =
    | 'title' | '-title'
    | 'status' | '-status'
    | 'priority' | '-priority'
    | 'task_type' | '-task_type'
    | 'due_date' | '-due_date'
    | 'completed_at' | '-completed_at'
    | 'created_at' | '-created_at';

export interface TaskFilters {
    search?: string;
    status?: TaskStatus[];
    priority?: TaskPriority[];
    taskType?: TaskType;
    scope?: TaskScope;
    overdue?: boolean;
    trashed?: TrashedFilter;
    sort?: TaskSort;
    page?: number;
    perPage?: number;
}

export interface TaskPaginatedData {
    data: Task[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null };
    meta: DepartmentPaginationMeta;
}

export interface TaskBulkResult {
    affected: number;
}

/** Create / edit body. Edit REPLACES every field: what is not sent becomes empty (except `status`). */
export interface TaskPayload {
    title: string;
    task_type: TaskType;
    description?: string;
    priority?: TaskPriority;
    /** YYYY-MM-DD */
    due_date?: string;
    assignee_id?: number;
    department_id?: number;
    document_id?: number;
    document_version_id?: number;
    tags?: string[];
    /** Edit only. */
    status?: TaskStatus;
}
