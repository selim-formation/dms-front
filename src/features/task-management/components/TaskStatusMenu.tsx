import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { TaskStatusBadge } from './TaskBadges'
import { STATUSES } from '../utils/taskPayload'
import type { Task, TaskStatus } from '../types/task.types'

interface TaskStatusMenuProps {
    task: Task
    onChange: (task: Task, status: TaskStatus) => void
}

/** Badge that doubles as the status switcher when `abilities.status` allows (any status can follow any other). */
function TaskStatusMenu({ task, onChange }: TaskStatusMenuProps) {
    const { t } = useTranslation('taskManagement')
    const pick = useCallback((status: TaskStatus) => status !== task.status && onChange(task, status), [task, onChange])

    if (!task.abilities.status) return <TaskStatusBadge status={task.status} />

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="inline-flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t('actions.changeStatus', { name: task.title })}
            >
                <TaskStatusBadge status={task.status} />
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {STATUSES.map((s) => (
                    <DropdownMenuItem key={s} onClick={() => pick(s)} className="justify-between gap-4">
                        {t(`status.${s}`)}
                        {s === task.status && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(TaskStatusMenu)
