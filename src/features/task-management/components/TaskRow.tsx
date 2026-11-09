import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { TaskPriorityBadge } from './TaskBadges'
import TaskDueDate from './TaskDueDate'
import TaskStatusMenu from './TaskStatusMenu'
import TaskRowActions, { type TaskRowHandlers } from './TaskRowActions'
import type { Task, TaskStatus } from '../types/task.types'

interface TaskRowProps extends TaskRowHandlers {
    task: Task
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
    onChangeStatus: (task: Task, status: TaskStatus) => void
}

/** Memoised: selecting a row or a counts refresh re-renders only the rows that changed. */
function TaskRow({ task, selectable, selected, onToggleSelect, onChangeStatus, ...handlers }: TaskRowProps) {
    const { t, i18n } = useTranslation('taskManagement')

    return (
        <tr className={cn('border-t border-border align-top transition-colors hover:bg-accent/40', selected && 'bg-primary/5', task.deleted_at && 'opacity-80')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(task.id)}
                    aria-label={t('table.select', { name: task.title })}
                />
            </td>
            <td className="max-w-72 px-4 py-3">
                <button
                    type="button"
                    onClick={() => handlers.onView(task)}
                    className="block max-w-full truncate text-start font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title={task.title}
                    dir="auto"
                >
                    {task.title}
                </button>
                {task.description && (
                    <p className="line-clamp-1 text-xs text-muted-foreground" title={task.description} dir="auto">
                        {task.description}
                    </p>
                )}
            </td>
            <td className="px-4 py-3">
                <TaskStatusMenu task={task} onChange={onChangeStatus} />
            </td>
            <td className="px-4 py-3">
                <TaskPriorityBadge priority={task.priority} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{t(`type.${task.task_type}`)}</td>
            <td className="max-w-40 px-4 py-3 text-sm">
                <p className="truncate text-foreground" title={task.assignee?.name}>{task.assignee?.name ?? '—'}</p>
            </td>
            <td className="max-w-40 px-4 py-3 text-sm">
                <p className="truncate text-muted-foreground" title={task.creator?.name}>{task.creator?.name ?? '—'}</p>
            </td>
            <td className="px-4 py-3 text-sm">
                <TaskDueDate dueDate={task.due_date} overdue={task.is_overdue} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {relativeTime(task.created_at, i18n.language)}
            </td>
            <td className="w-12 pe-3 py-2">
                <TaskRowActions task={task} {...handlers} />
            </td>
        </tr>
    )
}

export default memo(TaskRow)
