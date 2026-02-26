/**
 * Task Filtering Utilities
 * 
 * Implements filtering logic for tasks by status, priority, search, assignee, and due date
 */

import type { Task, TaskFilters } from '../types/task.types'

/**
 * Get date for "today"
 */
function getToday(): Date {
    return new Date()
}

/**
 * Get start of this week (Monday)
 */
function getStartOfWeek(): Date {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(today.setDate(diff))
}

/**
 * Get end of this week (Sunday)
 */
function getEndOfWeek(): Date {
    const startOfWeek = getStartOfWeek()
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + 6)
    return date
}

/**
 * Get start of this month
 */
function getStartOfMonth(): Date {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
}

/**
 * Get end of this month
 */
function getEndOfMonth(): Date {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth() + 1, 0)
}

/**
 * Check if a date falls within a due date range
 */
function checkDueDateRange(dueDate: string | null, range: string, customFrom: string | null, customTo: string | null): boolean {
    if (!dueDate || !range) {
        return true // No date filter applied
    }

    const taskDate = new Date(dueDate)
    taskDate.setHours(0, 0, 0, 0)

    switch (range) {
        case 'today': {
            const today = getToday()
            today.setHours(0, 0, 0, 0)
            return taskDate.getTime() === today.getTime()
        }

        case 'thisWeek': {
            const startOfWeek = getStartOfWeek()
            const endOfWeek = getEndOfWeek()
            return taskDate >= startOfWeek && taskDate <= endOfWeek
        }

        case 'thisMonth': {
            const startOfMonth = getStartOfMonth()
            const endOfMonth = getEndOfMonth()
            return taskDate >= startOfMonth && taskDate <= endOfMonth
        }

        case 'custom': {
            if (customFrom) {
                const fromDate = new Date(customFrom)
                fromDate.setHours(0, 0, 0, 0)
                if (taskDate < fromDate) return false
            }
            if (customTo) {
                const toDate = new Date(customTo)
                toDate.setHours(23, 59, 59, 999)
                if (taskDate > toDate) return false
            }
            return true
        }

        default:
            return true
    }
}

/**
 * Filter tasks based on active filter criteria
 * 
 * Rules:
 * - Status/Priority/Assignee: OR logic (match ANY selected)
 * - Search: AND logic (match title OR description with case-insensitive substring)
 * - Empty arrays/values: no filtering on that dimension
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter((task) => {
        // Status filter: empty = all, otherwise match any selected status
        if (filters.status.length > 0 && !filters.status.includes(task.status)) {
            return false
        }

        // Priority filter: empty = all, otherwise match any selected priority
        if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
            return false
        }

        // Assignee filter: empty = all, otherwise match if task has one of the selected assignees
        if (filters.assigneeIds.length > 0) {
            if (!task.assignee || !filters.assigneeIds.includes(task.assignee.id)) {
                return false
            }
        }

        // Due date range filter
        if (filters.dueDateRange) {
            const dateRangeMatch = checkDueDateRange(
                task.dueDate,
                filters.dueDateRange,
                filters.customDateRange.from,
                filters.customDateRange.to
            )
            if (!dateRangeMatch) {
                return false
            }
        }

        // Search filter: empty = all, otherwise match title OR description (case-insensitive)
        if (filters.search.trim().length > 0) {
            const searchLower = filters.search.toLowerCase()
            const titleMatch = task.title.toLowerCase().includes(searchLower)
            const descriptionMatch = task.description?.toLowerCase().includes(searchLower) ?? false

            if (!titleMatch && !descriptionMatch) {
                return false
            }
        }

        return true
    })
}

/**
 * Check if any filters are actively applied
 */
export function hasActiveFilters(filters: TaskFilters): boolean {
    return (
        filters.status.length > 0 ||
        filters.priority.length > 0 ||
        filters.search.trim().length > 0 ||
        filters.assigneeIds.length > 0 ||
        filters.dueDateRange.length > 0
    )
}

/**
 * Get count of filtered results
 */
export function getFilteredCount(tasks: Task[], filters: TaskFilters): number {
    return filterTasks(tasks, filters).length
}

/**
 * Reset all filters to default state
 */
export function resetFilters(): TaskFilters {
    return {
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
}

