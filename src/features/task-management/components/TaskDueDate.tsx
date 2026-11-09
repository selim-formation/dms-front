import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCalendarDate } from '@/features/document-management/utils/formatDate'

interface TaskDueDateProps {
    dueDate: string | null
    overdue: boolean
    className?: string
}

/** Due day in the user's locale; red with an icon (not colour alone) when the task is overdue. */
function TaskDueDate({ dueDate, overdue, className }: TaskDueDateProps) {
    const { t, i18n } = useTranslation('taskManagement')
    if (!dueDate) return <span className="text-muted-foreground">—</span>

    return (
        <span className={cn('inline-flex items-center gap-1 whitespace-nowrap', overdue ? 'font-medium text-destructive' : 'text-muted-foreground', className)}>
            {overdue && <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />}
            {formatCalendarDate(dueDate.slice(0, 10), i18n.language)}
            {overdue && <span className="sr-only">{t('overdue')}</span>}
        </span>
    )
}

export default memo(TaskDueDate)
