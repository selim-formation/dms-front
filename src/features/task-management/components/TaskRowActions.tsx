import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, MoreVertical, Pencil, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { Task } from '../types/task.types'

export interface TaskRowHandlers {
    onView: (task: Task) => void
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
    onRestore: (task: Task) => void
    onForceDelete: (task: Task) => void
}

/** Only what `abilities` allows. */
function TaskRowActions({ task, ...h }: { task: Task } & TaskRowHandlers) {
    const { t } = useTranslation('taskManagement')
    const a = task.abilities

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: task.title })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => h.onView(task)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {a.update && (
                    <DropdownMenuItem onClick={() => h.onEdit(task)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {a.restore && (
                    <DropdownMenuItem onClick={() => h.onRestore(task)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(a.delete || a.force_delete) && <DropdownMenuSeparator />}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(task)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {a.force_delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(task)}>
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(TaskRowActions)
