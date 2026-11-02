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
import type { DocumentEntity } from '../types/entity.types'
import type { EntityPermissions } from '../hooks/useEntityPermissions'

export interface EntityRowActions {
    onView: (entity: DocumentEntity) => void
    onEdit: (entity: DocumentEntity) => void
    onDelete: (entity: DocumentEntity) => void
    onRestore: (entity: DocumentEntity) => void
    onForceDelete: (entity: DocumentEntity) => void
}

interface EntityCardActionsProps extends EntityRowActions {
    entity: DocumentEntity
    title: string
    permissions: EntityPermissions
}

/** Edit/delete for active rows; restore/permanent-delete only for trashed rows. */
function EntityCardActions({ entity, title, permissions, ...actions }: EntityCardActionsProps) {
    const { t } = useTranslation('entities')
    const trashed = !!entity.deleted_at

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
                    <DropdownMenuItem onClick={() => actions.onView(entity)}>
                        <Eye className="me-2 h-4 w-4" />
                        {t('actions.view')}
                    </DropdownMenuItem>
                )}
                {canEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(entity)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {canRestore && (
                    <DropdownMenuItem onClick={() => actions.onRestore(entity)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(canDelete || canForce) && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onDelete(entity)}
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {canForce && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onForceDelete(entity)}
                    >
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(EntityCardActions)
