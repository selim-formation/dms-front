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
import type { Department } from '../types/department.types'
import type { DepartmentPermissions } from '../hooks/useDepartmentPermissions'

export interface DepartmentRowActions {
    onView: (department: Department) => void
    onEdit: (department: Department) => void
    onDelete: (department: Department) => void
    onRestore: (department: Department) => void
    onForceDelete: (department: Department) => void
}

interface DepartmentCardActionsProps extends DepartmentRowActions {
    department: Department
    permissions: DepartmentPermissions
}

/** View/edit/delete for active rows; restore/permanent-delete only for trashed rows. */
function DepartmentCardActions({ department, permissions, ...actions }: DepartmentCardActionsProps) {
    const { t } = useTranslation('departments')
    const trashed = !!department.deleted_at

    const canEdit = !trashed && permissions.canUpdate
    const canDelete = !trashed && permissions.canDelete
    const canRestore = trashed && permissions.canRestore
    const canForce = trashed && permissions.canForceDelete
    const hasDanger = canDelete || canForce

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('actions.menu', { title: department.title })}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {!trashed && (
                    <DropdownMenuItem onClick={() => actions.onView(department)}>
                        <Eye className="me-2 h-4 w-4" />
                        {t('actions.view')}
                    </DropdownMenuItem>
                )}
                {canEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(department)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {canRestore && (
                    <DropdownMenuItem onClick={() => actions.onRestore(department)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {hasDanger && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onDelete(department)}
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {canForce && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onForceDelete(department)}
                    >
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(DepartmentCardActions)
