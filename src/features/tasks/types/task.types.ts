/**
 * Task API Type Definitions
 * 
 * Feature: 001-tasks-page-design
 * Date: 2026-02-26
 * 
 * This file defines TypeScript types and interfaces for the Tasks API.
 * These types serve as the contract between the API layer and component layer.
 */

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Represents a user (assignee or creator)
 */
export interface User {
    /** Unique user identifier */
    id: number
    /** User's display name */
    name: string
    /** Optional profile image URL — API doesn't currently return one */
    avatar: string | null
    /** Present on API responses, absent on older mock/local data */
    email?: string
}

/**
 * Task status enum
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'

/**
 * Task priority enum
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

/**
 * Main Task entity
 */
export interface Task {
    /** Unique task identifier */
    id: number
    /** Task title/summary (1-200 characters) */
    title: string
    /** Detailed description (supports Markdown, 0-5000 characters) */
    description: string | null
    /** Current task status */
    status: TaskStatus
    /** Task priority level */
    priority: TaskPriority
    /** Target completion date (ISO8601 date format: YYYY-MM-DD) */
    dueDate: string | null
    /** User responsible for the task */
    assignee: User | null
    /** User who created the task */
    creator: User
    /** Task creation timestamp (ISO8601: YYYY-MM-DDTHH:mm:ssZ) */
    createdAt: string
    /** Last update timestamp (ISO8601: YYYY-MM-DDTHH:mm:ssZ) */
    updatedAt: string
    /** Categorization tags (0-10 items, each 1-30 characters) */
    tags: string[]
    /** Associated department/team (1-100 characters) */
    department: string | null
    /** Count of related documents (non-negative integer) */
    relatedDocumentsCount: number
    /** What kind of action this task represents (API-only, no dedicated UI yet) */
    taskType?: string
    /** When the task was marked complete, if it has been */
    completedAt?: string | null
    /** The single document this task is attached to, if any */
    document?: { id: number | null; title: string | null } | null
}

// ============================================================================
// Raw API Shapes (GET /{tenant}/tasks)
// ============================================================================

/** Task shape exactly as the backend returns it — snake_case, nullable relations. */
export interface RawTask {
    id: number
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    task_type: string | null
    assignee: { id: number; name: string; email?: string } | null
    creator: { id: number; name: string; email?: string }
    document: { id: number | null; title: string | null } | null
    department: { id: number; name: string | null } | null
    tags: string[] | null
    due_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
}

export interface TasksApiResponse {
    data: RawTask[]
    message: string
}

// ============================================================================
// Filter & Sort Models
// ============================================================================

/**
 * Due date range filter options
 */
export type DueDateRange = 'today' | 'thisWeek' | 'thisMonth' | 'custom' | ''

/**
 * Custom due date range
 */
export interface CustomDateRange {
    from: string | null
    to: string | null
}

/**
 * Task filter criteria
 */
export interface TaskFilters {
    /** Filter by one or more statuses (empty array = no filter) */
    status: TaskStatus[]
    /** Filter by one or more priorities (empty array = no filter) */
    priority: TaskPriority[]
    /** Search query for title/description (case-insensitive, empty string = no filter) */
    search: string
    /** Filter by assignee user IDs (empty array = no filter) */
    assigneeIds: number[]
    /** Filter by due date range */
    dueDateRange: DueDateRange
    /** Custom date range for due date filtering */
    customDateRange: CustomDateRange
}

/**
 * Sort field options
 */
export type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title'

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Task sort configuration
 */
export interface SortConfig {
    /** Field to sort by */
    field: SortField
    /** Sort direction (ascending or descending) */
    direction: SortDirection
}

// ============================================================================
// API Request/Response Models
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    /** Response data payload */
    data: T
    /** Success indicator */
    success: boolean
    /** Error message (present if success = false) */
    error?: string
    /** Optional metadata (pagination, counts, etc.) */
    meta?: {
        /** Total number of records */
        total?: number
        /** Current page number (1-indexed) */
        page?: number
        /** Number of items per page */
        pageSize?: number
    }
}

/**
 * Query parameters for fetching tasks
 */
export interface GetTasksParams {
    /** Tenant identifier */
    tenant: string
    /** Filter criteria */
    filters: TaskFilters
}

/**
 * Response type for GET /tasks
 */
export type GetTasksResponse = ApiResponse<Task[]>

/**
 * Query parameters for fetching a single task
 */
export interface GetTaskParams {
    /** Tenant identifier */
    tenant: string
    /** Task ID */
    taskId: number
}

/**
 * Response type for GET /tasks/:id
 */
export type GetTaskResponse = ApiResponse<Task>

// ============================================================================
// Constants
// ============================================================================

/**
 * Display labels for task statuses
 */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    BLOCKED: 'Blocked',
}

/**
 * Display labels for task priorities
 */
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
}

/**
 * Numeric weights for priority sorting
 */
export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4,
}

/**
 * Default filter state (no filters applied)
 */
export const DEFAULT_FILTERS: TaskFilters = {
    status: [],
    priority: [],
    search: '',
    assigneeIds: [],
    dueDateRange: '',
    customDateRange: {
        from: null,
        to: null,
    },
}

/**
 * Default sort configuration (earliest due date first)
 */
export const DEFAULT_SORT: SortConfig = {
    field: 'dueDate',
    direction: 'asc',
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid TaskStatus
 */
export function isTaskStatus(value: unknown): value is TaskStatus {
    return (
        typeof value === 'string' &&
        ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].includes(value)
    )
}

/**
 * Type guard to check if a value is a valid TaskPriority
 */
export function isTaskPriority(value: unknown): value is TaskPriority {
    return (
        typeof value === 'string' &&
        ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(value)
    )
}

/**
 * Type guard to check if a value is a valid SortField
 */
export function isSortField(value: unknown): value is SortField {
    return (
        typeof value === 'string' &&
        ['dueDate', 'priority', 'createdAt', 'title'].includes(value)
    )
}

/**
 * Type guard to check if a value is a valid SortDirection
 */
export function isSortDirection(value: unknown): value is SortDirection {
    return typeof value === 'string' && ['asc', 'desc'].includes(value)
}
