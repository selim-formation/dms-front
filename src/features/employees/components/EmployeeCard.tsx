import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import EmployeeAvatar from './EmployeeAvatar'
import EmployeeCardActions, { type EmployeeRowActions } from './EmployeeCardActions'
import type { Employee } from '../types/employee.types'
import type { EmployeePermissions } from '../hooks/useEmployeePermissions'

interface EmployeeCardProps extends EmployeeRowActions {
    employee: Employee
    permissions: EmployeePermissions
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting one card or typing in search doesn't re-render the others. */
function EmployeeCard({ employee, permissions, selectable, selected, onToggleSelect, ...actions }: EmployeeCardProps) {
    const { t, i18n } = useTranslation('employees')
    const trashed = !!employee.deleted_at
    const hasActions = !trashed
        ? permissions.canUpdate || permissions.canDelete
        : permissions.canRestore || permissions.canForceDelete

    return (
        <article
            className={cn(
                'flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md',
                selected ? 'border-primary ring-1 ring-primary' : 'border-border',
                trashed && 'bg-muted/40',
            )}
        >
            <div className="flex items-start gap-3">
                {selectable && (
                    <input
                        type="checkbox"
                        className="mt-3 h-4 w-4 shrink-0 accent-primary"
                        checked={selected}
                        onChange={() => onToggleSelect(employee.id)}
                        aria-label={t('card.select', { name: employee.name })}
                    />
                )}

                <EmployeeAvatar name={employee.name} email={employee.email} muted={trashed} />

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground" title={employee.name}>
                        {employee.name}
                    </h3>
                    <a
                        href={`mailto:${employee.email}`}
                        className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                        title={employee.email}
                        dir="ltr"
                    >
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{employee.email}</span>
                    </a>
                </div>

                {hasActions && <EmployeeCardActions employee={employee} permissions={permissions} {...actions} />}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{t('card.created', { time: relativeTime(employee.created_at, i18n.language) })}</span>
                {trashed && <Badge variant="destructive">{t('card.deleted')}</Badge>}
            </div>
        </article>
    )
}

export default memo(EmployeeCard)
