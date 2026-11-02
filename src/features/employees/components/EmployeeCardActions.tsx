import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, Pencil, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { Employee } from '../types/employee.types'
import type { EmployeePermissions } from '../hooks/useEmployeePermissions'

export interface EmployeeRowActions {
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
    onRestore: (employee: Employee) => void
    onForceDelete: (employee: Employee) => void
}

interface EmployeeCardActionsProps extends EmployeeRowActions {
    employee: Employee
    permissions: EmployeePermissions
}

/** Edit/delete for active rows; restore/permanent-delete only for trashed rows. */
function EmployeeCardActions({ employee, permissions, ...actions }: EmployeeCardActionsProps) {
    const { t } = useTranslation('employees')
    const trashed = !!employee.deleted_at

    const canEdit = !trashed && permissions.canUpdate
    const canDelete = !trashed && permissions.canDelete
    const canRestore = trashed && permissions.canRestore
    const canForce = trashed && permissions.canForceDelete

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: employee.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {canEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(employee)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {canRestore && (
                    <DropdownMenuItem onClick={() => actions.onRestore(employee)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(canEdit || canRestore) && (canDelete || canForce) && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onDelete(employee)}
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {canForce && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onForceDelete(employee)}
                    >
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(EmployeeCardActions)
