/**
 * Task Filtering Utilities
 * 
 * Implements filtering logic for tasks by status, priority, search, assignee, and due date
 */

import type { Task, TaskFilters } from '../types/task.types'

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

        // Assignee filter: null = all, otherwise match if task has the selected assignee
        if (filters.assignee_id !== null) {
            if (!task.assignee || task.assignee.id !== filters.assignee_id) {
                return false
            }
        }

        // Due date range filter
        if (filters.due_date_from !== null || filters.due_date_to !== null) {
            const taskDueDate = task.dueDate ? new Date(task.dueDate) : null

            if (taskDueDate) {
                if (filters.due_date_from) {
                    const fromDate = new Date(filters.due_date_from)
                    if (taskDueDate < fromDate) {
                        return false
                    }
                }

                if (filters.due_date_to) {
                    const toDate = new Date(filters.due_date_to)
                    if (taskDueDate > toDate) {
                        return false
                    }
                }
            } else {
                // If dates are filtered but task has no due date, exclude it
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
        filters.assignee_id !== null ||
        filters.task_type !== null ||
        filters.department_id !== null ||
        filters.due_date_from !== null ||
        filters.due_date_to !== null
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
        assignee_id: null,
        task_type: null,
        department_id: null,
        due_date_from: null,
        due_date_to: null,
        sort_by: 'created_at',
        sort_order: 'desc',
    }
}

