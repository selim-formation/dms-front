/**
 * TaskCard Component
 * 
 * Individual task card displayed in the task list
 * Memoized to prevent unnecessary re-renders
 * Displays: title, status badge, priority, due date, assignee avatar, document count
 */

import React from 'react'
import type { Task } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'
import { formatDate } from '../utils/dateFormat'

/**
 * Color mapping for status badges using the color palette
 */
const STATUS_COLORS: Record<Task['status'], { bg: string; text: string; badge: string }> = {
    TODO: {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        badge: 'bg-slate-200 text-slate-800',
    },
    IN_PROGRESS: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        badge: 'bg-blue-200 text-blue-800',
    },
    COMPLETED: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        badge: 'bg-green-200 text-green-800',
    },
    BLOCKED: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        badge: 'bg-red-200 text-red-800',
    },
}

/**
 * Color mapping for priority badges
 */
const PRIORITY_COLORS: Record<Task['priority'], string> = {
    LOW: 'bg-slate-100 text-slate-700',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
}

interface TaskCardProps {
    task: Task
    isSelected?: boolean
    onClick?: (taskId: number) => void
}

function TaskCardComponent({ task, isSelected = false, onClick }: TaskCardProps) {
    const statusColors = STATUS_COLORS[task.status]
    const priorityColor = PRIORITY_COLORS[task.priority]

    return (
        <button
            onClick={() => onClick?.(task.id)}
            className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        ${isSelected ? `border-blue-500 ${statusColors.bg}` : 'border-gray-200 hover:border-gray-300'}
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
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}

            {/* Priority and Due Date Row */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor}`}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                </span>
                <span className="text-xs text-gray-500">
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
                                    className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs"
                                    title={task.assignee.name}
                                >
                                    {task.assignee.name.charAt(0)}
                                </div>
                            )}
                            <span className="text-gray-700">{task.assignee.name}</span>
                        </>
                    ) : (
                        <span className="text-gray-400">Unassigned</span>
                    )}
                </div>
                {task.relatedDocumentsCount > 0 && (
                    <span className="text-gray-600 font-medium">
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
