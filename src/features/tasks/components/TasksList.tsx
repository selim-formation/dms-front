/**
 * TasksList Component
 * 
 * Container component for displaying tasks in a responsive grid
 * Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
 */

import type { Task } from '../types/task.types'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

interface TasksListProps {
    tasks: Task[]
    isLoading?: boolean
    selectedTaskId?: number | null
    onTaskClick?: (taskId: number) => void
    hasFiltersApplied?: boolean
    hasSearchQuery?: boolean
}

export function TasksList({
    tasks,
    isLoading = false,
    selectedTaskId = null,
    onTaskClick,
    hasFiltersApplied = false,
    hasSearchQuery = false,
}: TasksListProps) {
    // Show empty state if no tasks match criteria
    if (!isLoading && tasks.length === 0) {
        return <EmptyState hasFiltersApplied={hasFiltersApplied} hasSearchQuery={hasSearchQuery} />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTaskId === task.id}
                    onClick={onTaskClick}
                />
            ))}
        </div>
    )
}
