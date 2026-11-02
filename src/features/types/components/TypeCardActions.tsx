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
import type { DocumentType } from '../types/type.types'
import type { TypePermissions } from '../hooks/useTypePermissions'

export interface TypeRowActions {
    onView: (type: DocumentType) => void
    onEdit: (type: DocumentType) => void
    onDelete: (type: DocumentType) => void
    onRestore: (type: DocumentType) => void
    onForceDelete: (type: DocumentType) => void
}

interface TypeCardActionsProps extends TypeRowActions {
    type: DocumentType
    title: string
    permissions: TypePermissions
}

/** Edit/delete for active rows; restore/permanent-delete only for trashed rows. */
function TypeCardActions({ type, title, permissions, ...actions }: TypeCardActionsProps) {
    const { t } = useTranslation('types')
    const trashed = !!type.deleted_at

    const canEdit = !trashed && permissions.canUpdate
    const canDelete = !trashed && permissions.canDelete
    const canRestore = trashed && permissions.canRestore
    const canForce = trashed && permissions.canForceDelete

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { title })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {!trashed && (
                    <DropdownMenuItem onClick={() => actions.onView(type)}>
                        <Eye className="me-2 h-4 w-4" />
                        {t('actions.view')}
                    </DropdownMenuItem>
                )}
                {canEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(type)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {canRestore && (
                    <DropdownMenuItem onClick={() => actions.onRestore(type)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(canDelete || canForce) && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onDelete(type)}
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {canForce && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onForceDelete(type)}
                    >
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(TypeCardActions)
