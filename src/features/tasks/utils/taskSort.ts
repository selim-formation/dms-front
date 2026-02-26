/**
 * Task Sorting Utilities
 * 
 * Implements sorting logic for tasks by various criteria
 */

import type { Task, SortField, SortConfig } from '../types/task.types'
import { PRIORITY_WEIGHT } from '../types/task.types'

/**
 * Compare two dates for sorting, handling null values
 */
function compareDates(a: string | null, b: string | null, direction: 'asc' | 'desc'): number {
    // Null values go last
    if (a === null && b === null) return 0
    if (a === null) return direction === 'asc' ? 1 : -1
    if (b === null) return direction === 'asc' ? -1 : 1

    const dateA = new Date(a).getTime()
    const dateB = new Date(b).getTime()

    return direction === 'asc' ? dateA - dateB : dateB - dateA
}

/**
 * Compare two strings for sorting
 */
function compareStrings(a: string, b: string, direction: 'asc' | 'desc'): number {
    const comparison = a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    return direction === 'asc' ? comparison : -comparison
}

/**
 * Sort tasks based on sort configuration
 */
export function sortTasks(tasks: Task[], config: SortConfig): Task[] {
    const { field, direction } = config

    return [...tasks].sort((a, b) => {
        switch (field) {
            case 'dueDate':
                return compareDates(a.dueDate, b.dueDate, direction)

            case 'priority': {
                const weightA = PRIORITY_WEIGHT[a.priority]
                const weightB = PRIORITY_WEIGHT[b.priority]
                return direction === 'asc' ? weightA - weightB : weightB - weightA
            }

            case 'createdAt':
                return compareDates(a.createdAt, b.createdAt, direction)

            case 'title':
                return compareStrings(a.title, b.title, direction)

            default:
                return 0
        }
    })
}

/**
 * Get sort label for display
 */
export function getSortLabel(field: SortField, direction: 'asc' | 'desc'): string {
    const fieldLabels: Record<SortField, string> = {
        dueDate: 'Due Date',
        priority: 'Priority',
        createdAt: 'Created Date',
        title: 'Title',
    }

    const directionLabel = direction === 'asc' ? 'Ascending' : 'Descending'
    return `${fieldLabels[field]} (${directionLabel})`
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(direction: 'asc' | 'desc'): 'asc' | 'desc' {
    return direction === 'asc' ? 'desc' : 'asc'
}
