/**
 * TaskSort Component
 * 
 * Dropdown controls for sorting tasks by field and direction
 * Allows users to sort by dueDate, priority, createdAt, or title
 */

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
    const sortFields: { value: SortField; label: string }[] = [
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'createdAt', label: 'Created Date' },
        { value: 'title', label: 'Title' },
    ]

    return (
        <div className="flex items-center gap-2 p-4">
            {/* Sort Field Select */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort-field" className="text-sm font-semibold text-gray-900">
                    Sort by:
                </label>
                <select
                    id="sort-field"
                    value={sortField}
                    onChange={(e) => onSortFieldChange(e.target.value as SortField)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Sort by field"
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
                <label htmlFor="sort-direction" className="text-sm font-semibold text-gray-900">
                    Direction:
                </label>
                <button
                    id="sort-direction"
                    onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    aria-label={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                    aria-pressed={sortDirection === 'desc'}
                >
                    {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                </button>
            </div>
        </div>
    )
}

export default TaskSort
