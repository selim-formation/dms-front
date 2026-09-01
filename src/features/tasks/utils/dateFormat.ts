/**
 * Date Formatting Utilities
 * 
 * Provides date formatting functions for task display
 */

/**
 * Format ISO date string to readable format
 * 
 * @param isoDate - ISO 8601 date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
 * @returns Formatted date string (e.g., "Mar 15, 2026")
 */
export function formatDate(isoDate: string | null): string {
    if (!isoDate) return 'No due date'

    try {
        const date = new Date(isoDate)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    } catch {
        return 'Invalid date'
    }
}

/**
 * Format ISO datetime string with time
 * 
 * @param isoDateTime - ISO 8601 datetime string
 * @returns Formatted datetime string (e.g., "Feb 26, 2026 at 3:45 PM")
 */
export function formatDateTime(isoDateTime: string): string {
    try {
        const date = new Date(isoDateTime)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    } catch {
        return 'Invalid date'
    }
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * 
 * @param isoDate - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(isoDate: string | null): string {
    if (!isoDate) return 'No due date'

    try {
        const date = new Date(isoDate)
        const now = new Date()
        const diffMs = date.getTime() - now.getTime()
        const diffSec = Math.round(diffMs / 1000)
        const diffMin = Math.round(diffSec / 60)
        const diffHours = Math.round(diffMin / 60)
        const diffDays = Math.round(diffHours / 24)

        if (Math.abs(diffSec) < 60) {
            return diffSec === 0 ? 'now' : `${diffSec}s ${diffSec < 0 ? 'ago' : 'from now'}`
        }
        if (Math.abs(diffMin) < 60) {
            return `${Math.abs(diffMin)}m ${diffMin < 0 ? 'ago' : 'from now'}`
        }
        if (Math.abs(diffHours) < 24) {
            return `${Math.abs(diffHours)}h ${diffHours < 0 ? 'ago' : 'from now'}`
        }
        if (Math.abs(diffDays) < 30) {
            return `${Math.abs(diffDays)}d ${diffDays < 0 ? 'ago' : 'from now'}`
        }

        return formatDate(isoDate)
    } catch {
        return 'Invalid date'
    }
}

/**
 * Check if task is overdue
 */
export function isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false

    try {
        const date = new Date(dueDate)
        const now = new Date()
        // Set time to start of day for date comparison
        now.setHours(0, 0, 0, 0)
        date.setHours(0, 0, 0, 0)
        return date < now
    } catch {
        return false
    }
}

/**
 * Check if task is due soon (within 3 days)
 */
export function isDueSoon(dueDate: string | null): boolean {
    if (!dueDate) return false

    try {
        const date = new Date(dueDate)
        const now = new Date()
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays > 0 && diffDays <= 3
    } catch {
        return false
    }
}
