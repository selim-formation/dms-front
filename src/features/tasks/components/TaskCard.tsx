/**
 * TaskCard Component
 * 
 * Individual task card displayed in the task list
 * Memoized to prevent unnecessary re-renders
 * Displays: title, status badge, priority, due date, assignee avatar, document count
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Task } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'
import { formatDate } from '../utils/dateFormat'

/**
 * Color mapping for status badges using the color palette
 */
const STATUS_COLORS: Record<Task['status'], { bg: string; text: string; badge: string }> = {
    TODO: {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        badge: 'bg-secondary text-secondary-foreground',
    },
    IN_PROGRESS: {
        bg: 'bg-info/10',
        text: 'text-info',
        badge: 'bg-info/20 text-info',
    },
    COMPLETED: {
        bg: 'bg-success/10',
        text: 'text-success',
        badge: 'bg-success/20 text-success',
    },
    BLOCKED: {
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        badge: 'bg-destructive/20 text-destructive',
    },
}

/**
 * Color mapping for priority badges
 */
const PRIORITY_COLORS: Record<Task['priority'], string> = {
    LOW: 'bg-secondary text-secondary-foreground',
    MEDIUM: 'bg-warning/10 text-warning',
    HIGH: 'bg-warning/20 text-warning',
    URGENT: 'bg-destructive/10 text-destructive',
}

interface TaskCardProps {
    task: Task
    isSelected?: boolean
    onClick?: (taskId: number) => void
}

function TaskCardComponent({ task, isSelected = false, onClick }: TaskCardProps) {
    const { t } = useTranslation(['tasks', 'common'])
    const statusColors = STATUS_COLORS[task.status]
    const priorityColor = PRIORITY_COLORS[task.priority]

    return (
        <button
            onClick={() => onClick?.(task.id)}
            className={`
        w-full text-start p-4 rounded-lg border-2 transition-all
        ${isSelected ? `border-primary ${statusColors.bg}` : 'border-border hover:border-ring'}
        ${statusColors.bg} hover:shadow-md cursor-pointer
      `}
        >
            {/* Header: Title and Status Badge */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className={`text-sm font-semibold leading-snug flex-1 ${statusColors.text}`}>
                    {task.title}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors.badge}`}>
                    {TASK_STATUS_LABELS[task.status]}
                </span>
            </div>

            {/* Description preview - optional */}
            {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}

            {/* Priority and Due Date Row */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor}`}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                </span>
                <span className="text-xs text-muted-foreground">
                    {formatDate(task.dueDate)}
                </span>
            </div>

            {/* Assignee and Document Count Footer */}
            <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                    {task.assignee ? (
                        <>
                            {task.assignee.avatar ? (
                                <img
                                    src={task.assignee.avatar}
                                    alt={task.assignee.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                    title={task.assignee.name}
                                />
                            ) : (
                                <div
                                    className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs"
                                    title={task.assignee.name}
                                >
                                    {task.assignee.name.charAt(0)}
                                </div>
                            )}
                            <span className="text-muted-foreground">{task.assignee.name}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">{t('tasks:taskCard.unassigned')}</span>
                    )}
                </div>
                {task.relatedDocumentsCount > 0 && (
                    <span className="text-muted-foreground font-medium">
                        📄 {task.relatedDocumentsCount}
                    </span>
                )}
            </div>
        </button>
    )
}

/**
 * Memoized TaskCard with custom comparison
 * Only re-renders if task.id, task.updatedAt, or isSelected changes
 */
export const TaskCard = React.memo(TaskCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.task.id === nextProps.task.id &&
        prevProps.task.updatedAt === nextProps.task.updatedAt &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.onClick === nextProps.onClick
    )
})

TaskCard.displayName = 'TaskCard'
