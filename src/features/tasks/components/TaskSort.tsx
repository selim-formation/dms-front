/**
 * TaskSort Component
 * 
 * Dropdown controls for sorting tasks by field and direction
 * Allows users to sort by dueDate, priority, createdAt, or title
 */

<<<<<<< Updated upstream
import React from 'react'
=======
import { useTranslation } from 'react-i18next'
>>>>>>> Stashed changes
import type { SortField, SortDirection } from '../types/task.types'

interface TaskSortProps {
    sortField: SortField
    sortDirection: SortDirection
    onSortFieldChange: (field: SortField) => void
    onSortDirectionChange: (direction: SortDirection) => void
}

/**
 * TaskSort Component
 * 
 * Provides controls for:
 * - Sort Field: Due Date, Priority, Created Date, Title
 * - Sort Direction: Ascending or Descending
 */
export function TaskSort({
    sortField,
    sortDirection,
    onSortFieldChange,
    onSortDirectionChange,
}: TaskSortProps) {
    const { t } = useTranslation(['tasks', 'common'])
    const sortFields: { value: SortField; label: string }[] = [
        { value: 'dueDate', label: t('tasks:taskSort.dueDate') },
        { value: 'priority', label: t('tasks:taskSort.priority') },
        { value: 'createdAt', label: t('tasks:taskSort.createdDate') },
        { value: 'title', label: t('tasks:taskSort.title') },
    ]

    return (
        <div className="flex items-center gap-2 p-4">
            {/* Sort Field Select */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort-field" className="text-sm font-semibold text-foreground">
                    {t('tasks:taskSort.sortBy')}
                </label>
                <select
                    id="sort-field"
                    value={sortField}
                    onChange={(e) => onSortFieldChange(e.target.value as SortField)}
                    className="px-3 py-2 border border-input rounded-md bg-card text-sm font-medium text-foreground hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    aria-label={t('tasks:taskSort.sortByField')}
                >
                    {sortFields.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort Direction Toggle */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort-direction" className="text-sm font-semibold text-foreground">
                    {t('tasks:taskSort.direction')}
                </label>
                <button
                    id="sort-direction"
                    onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                    aria-label={t('tasks:taskSort.sortDirection', { direction: sortDirection === 'asc' ? t('tasks:taskSort.ascending') : t('tasks:taskSort.descending') })}
                    aria-pressed={sortDirection === 'desc'}
                >
                    {sortDirection === 'asc' ? t('tasks:taskSort.asc') : t('tasks:taskSort.desc')}
                </button>
            </div>
        </div>
    )
}

export default TaskSort
