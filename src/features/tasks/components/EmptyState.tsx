/**
 * EmptyState Component
 * 
 * Displays a friendly message when no tasks are available or match current filters
 */

import React from 'react'

interface EmptyStateProps {
    hasFiltersApplied?: boolean
    hasSearchQuery?: boolean
}

export function EmptyState({ hasFiltersApplied = false, hasSearchQuery = false }: EmptyStateProps) {
    let title = 'No tasks yet'
    let message = 'Get started by creating your first task'
    let icon = '📝'

    if (hasFiltersApplied && hasSearchQuery) {
        title = 'No matching tasks'
        message = 'Try adjusting your filters or search query'
        icon = '🔍'
    } else if (hasFiltersApplied) {
        title = 'No tasks with these filters'
        message = 'Try selecting different filter options'
        icon = '⏳'
    } else if (hasSearchQuery) {
        title = 'No tasks match your search'
        message = 'Try searching with different keywords'
        icon = '🔍'
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-64 py-12 px-4">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-center max-w-sm">{message}</p>
        </div>
    )
}
