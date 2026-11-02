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
import type { Project } from '../types/project.types'
import type { ProjectPermissions } from '../hooks/useProjectPermissions'

export interface ProjectRowActions {
    onEdit: (project: Project) => void
    onDelete: (project: Project) => void
    onRestore: (project: Project) => void
    onForceDelete: (project: Project) => void
}

interface ProjectCardActionsProps extends ProjectRowActions {
    project: Project
    permissions: ProjectPermissions
}

/** Edit/delete for active rows; restore/permanent-delete only for trashed rows. */
function ProjectCardActions({ project, permissions, ...actions }: ProjectCardActionsProps) {
    const { t } = useTranslation('projects')
    const trashed = !!project.deleted_at

    const canEdit = !trashed && permissions.canUpdate
    const canDelete = !trashed && permissions.canDelete
    const canRestore = trashed && permissions.canRestore
    const canForce = trashed && permissions.canForceDelete

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: project.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {canEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(project)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {canRestore && (
                    <DropdownMenuItem onClick={() => actions.onRestore(project)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(canEdit || canRestore) && (canDelete || canForce) && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onDelete(project)}
                    >
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {canForce && (
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => actions.onForceDelete(project)}
                    >
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(ProjectCardActions)
