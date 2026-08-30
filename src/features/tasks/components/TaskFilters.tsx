/**
 * TaskFilters Component
 * 
 * Multi-select dropdown controls for filtering tasks by status and priority
 * Uses shadcn Select component from Radix UI
 */

<<<<<<< Updated upstream
import React from 'react'
=======
import { useTranslation } from 'react-i18next'
>>>>>>> Stashed changes
import type { TaskStatus, TaskPriority } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'

interface TaskFiltersProps {
    selectedStatuses: TaskStatus[]
    selectedPriorities: TaskPriority[]
    onStatusChange: (statuses: TaskStatus[]) => void
    onPriorityChange: (priorities: TaskPriority[]) => void
}

/**
 * TaskFilters Component
 * 
 * Provides multi-select controls for:
 * - Status: TODO, IN_PROGRESS, COMPLETED, BLOCKED
 * - Priority: LOW, MEDIUM, HIGH, URGENT
 */
export function TaskFilters({
    selectedStatuses,
    selectedPriorities,
    onStatusChange,
    onPriorityChange,
}: TaskFiltersProps) {
    const { t } = useTranslation(['tasks', 'common'])
    const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']
    const priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

    const handleStatusToggle = (status: TaskStatus) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter((s) => s !== status)
            : [...selectedStatuses, status]
        onStatusChange(newStatuses)
    }

    const handlePriorityToggle = (priority: TaskPriority) => {
        const newPriorities = selectedPriorities.includes(priority)
            ? selectedPriorities.filter((p) => p !== priority)
            : [...selectedPriorities, priority]
        onPriorityChange(newPriorities)
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-card border-b border-border">
            {/* Status Filter */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">{t('tasks:taskFilters.status')}</label>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusToggle(status)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedStatuses.includes(status)
<<<<<<< Updated upstream
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
=======
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
>>>>>>> Stashed changes
                                }`}
                            aria-pressed={selectedStatuses.includes(status)}
                            aria-label={t('tasks:taskFilters.filterByStatus', { status: TASK_STATUS_LABELS[status] })}
                        >
                            {TASK_STATUS_LABELS[status]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">{t('tasks:taskFilters.priority')}</label>
                <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((priority) => (
                        <button
                            key={priority}
                            onClick={() => handlePriorityToggle(priority)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedPriorities.includes(priority)
<<<<<<< Updated upstream
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
=======
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
>>>>>>> Stashed changes
                                }`}
                            aria-pressed={selectedPriorities.includes(priority)}
                            aria-label={t('tasks:taskFilters.filterByPriority', { priority: TASK_PRIORITY_LABELS[priority] })}
                        >
                            {TASK_PRIORITY_LABELS[priority]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedStatuses.length > 0 || selectedPriorities.length > 0) && (
                <button
                    onClick={() => {
                        onStatusChange([])
                        onPriorityChange([])
                    }}
                    className="px-3 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors self-start"
                    aria-label={t('tasks:taskFilters.clearAllFilters')}
                >
                    {t('tasks:taskFilters.clearFilters')}
                </button>
            )}
        </div>
    )
}

export default TaskFilters
