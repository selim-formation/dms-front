/**
 * EmptyState Component
 *
 * Displays a friendly message when no tasks are available or match current filters
 */

<<<<<<< Updated upstream
import React from 'react'
=======
import { useTranslation } from 'react-i18next'
>>>>>>> Stashed changes

interface EmptyStateProps {
    hasFiltersApplied?: boolean
    hasSearchQuery?: boolean
}

export function EmptyState({ hasFiltersApplied = false, hasSearchQuery = false }: EmptyStateProps) {
    const { t } = useTranslation(['tasks', 'common'])

    let title = t('tasks:emptyState.noTasksTitle')
    let message = t('tasks:emptyState.noTasksMessage')
    let icon = '📝'

    if (hasFiltersApplied && hasSearchQuery) {
        title = t('tasks:emptyState.noMatchingTitle')
        message = t('tasks:emptyState.noMatchingMessage')
        icon = '🔍'
    } else if (hasFiltersApplied) {
        title = t('tasks:emptyState.noFilteredTitle')
        message = t('tasks:emptyState.noFilteredMessage')
        icon = '⏳'
    } else if (hasSearchQuery) {
        title = t('tasks:emptyState.noSearchTitle')
        message = t('tasks:emptyState.noSearchMessage')
        icon = '🔍'
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-64 py-12 px-4">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-center max-w-sm">{message}</p>
        </div>
    )
}
