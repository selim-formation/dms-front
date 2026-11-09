/**
 * Pure form logic: state shape, per-step validation, payload building and
 * server-error mapping for the create / edit task form.
 */

import { toDateInput } from './taskPayload';
import type { Task, TaskPayload, TaskPriority, TaskStatus, TaskType } from '../types/task.types';

export const TITLE_MAX = 255;
export const DESCRIPTION_MAX = 2000;
export const TAGS_MAX = 20;
export const TAG_MAX = 50;
/** The database's range. */
export const DUE_DATE_MIN = '1970-01-02';
export const DUE_DATE_MAX = '2038-01-18';

export type FormStep = 'basics' | 'planning' | 'links' | 'tags';
export const FORM_STEPS: FormStep[] = ['basics', 'planning', 'links', 'tags'];

export interface TaskFormValues {
    title: string;
    description: string;
    priority: TaskPriority;
    task_type: TaskType | '';
    due_date: string;
    assignee_id: number | null;
    department_id: number | null;
    document_id: number | null;
    document_version_id: number | null;
    /** Title of the linked document, kept only for display (the picker holds just ids). */
    document_label: string | null;
    tags: string[];
    /** Kept as-is on edit so a PUT never changes the status by accident. */
    status: TaskStatus | null;
}

export const EMPTY_VALUES: TaskFormValues = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    task_type: '',
    due_date: '',
    assignee_id: null,
    department_id: null,
    document_id: null,
    document_version_id: null,
    document_label: null,
    tags: [],
    status: null,
};

/** Edit replaces every field, so the document link is carried back even when the document is not visible. */
export function valuesFromTask(task: Task): TaskFormValues {
    return {
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        task_type: task.task_type,
        due_date: toDateInput(task.due_date),
        assignee_id: task.assignee?.id ?? null,
        department_id: task.department?.id ?? null,
        document_id: task.document_id,
        document_version_id: task.document_version_id,
        document_label: task.document?.title ?? null,
        tags: task.tags,
        status: task.status,
    };
}

/** Error key → i18n code (under `taskManagement:form.errors`). Server messages replace these when present. */
export type FormErrors = Record<string, string>;

export function validateStep(step: FormStep, v: TaskFormValues): FormErrors {
    const e: FormErrors = {};
    if (step === 'basics') {
        if (!v.title.trim()) e.title = 'titleRequired';
        else if (v.title.trim().length > TITLE_MAX) e.title = 'titleTooLong';
        if (v.description.length > DESCRIPTION_MAX) e.description = 'descriptionTooLong';
    }
    if (step === 'planning') {
        if (!v.task_type) e.task_type = 'typeRequired';
        if (v.due_date && (v.due_date < DUE_DATE_MIN || v.due_date > DUE_DATE_MAX)) e.due_date = 'dueDateRange';
    }
    if (step === 'links') {
        if (v.document_version_id !== null && v.document_id === null) e.document_version_id = 'documentRequired';
    }
    if (step === 'tags') {
        if (v.tags.length > TAGS_MAX) e.tags = 'tagsTooMany';
    }
    return e;
}

export const STEP_FIELDS: Record<FormStep, string[]> = {
    basics: ['title', 'description'],
    planning: ['priority', 'task_type', 'due_date', 'status'],
    links: ['assignee_id', 'department_id', 'document_id', 'document_version_id'],
    tags: ['tags'],
};

/** First step that owns one of the errored fields (to jump to it after a 422). */
export function stepOfErrors(errors: FormErrors): FormStep | null {
    for (const step of FORM_STEPS) {
        if (Object.keys(errors).some((k) => STEP_FIELDS[step].some((f) => k === f || k.startsWith(`${f}.`)))) return step;
    }
    return null;
}

/** Empty fields are omitted: on edit that clears them (the server replaces the task). Ids are plain numbers. */
export function buildTaskPayload(v: TaskFormValues, isEdit: boolean): TaskPayload {
    const payload: TaskPayload = {
        title: v.title.trim(),
        task_type: v.task_type as TaskType,
        priority: v.priority,
        tags: v.tags,
    };
    if (v.description.trim()) payload.description = v.description.trim();
    if (v.due_date) payload.due_date = v.due_date;
    if (v.assignee_id !== null) payload.assignee_id = v.assignee_id;
    if (v.department_id !== null) payload.department_id = v.department_id;
    if (v.document_id !== null) payload.document_id = v.document_id;
    if (v.document_version_id !== null) payload.document_version_id = v.document_version_id;
    if (isEdit && v.status) payload.status = v.status;
    return payload;
}

/** Laravel 422 → { field: firstMessage }. `tags.0` collapses into `tags`. */
export function serverFieldErrors(error: unknown): FormErrors {
    const errors = (error as { errors?: Record<string, string[]> } | null)?.errors;
    const out: FormErrors = {};
    if (!errors) return out;
    for (const [key, messages] of Object.entries(errors)) {
        const field = key.split('.')[0];
        if (!out[field] && messages?.[0]) out[field] = messages[0];
    }
    return out;
}
