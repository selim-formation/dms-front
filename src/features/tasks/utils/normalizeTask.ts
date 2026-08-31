/**
 * Maps the backend's raw snake_case task shape onto the camelCase Task
 * type the rest of the feature (cards, filters, sort, drawer) consumes.
 * The API doesn't return a related-documents count — only a single
 * nullable `document` relation — so relatedDocumentsCount is derived
 * from whether that relation is present.
 */
import type { RawTask, Task } from '../types/task.types'

export function normalizeTask(raw: RawTask): Task {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        status: raw.status,
        priority: raw.priority,
        dueDate: raw.due_date,
        assignee: raw.assignee
            ? { id: raw.assignee.id, name: raw.assignee.name, avatar: null, email: raw.assignee.email }
            : null,
        creator: { id: raw.creator.id, name: raw.creator.name, avatar: null, email: raw.creator.email },
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        tags: raw.tags ?? [],
        department: raw.department?.name ?? null,
        relatedDocumentsCount: raw.document?.id ? 1 : 0,
        taskType: raw.task_type ?? undefined,
        completedAt: raw.completed_at,
        document: raw.document,
    }
}

export function normalizeTasks(raw: RawTask[]): Task[] {
    return raw.map(normalizeTask)
}
