import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { DocumentVersion } from '../../types/version.types'

export interface VersionRowHandlers {
    onPreview: (version: DocumentVersion) => void
    onEdit: (version: DocumentVersion) => void
    onDelete: (version: DocumentVersion) => void
}

interface VersionRowActionsProps extends VersionRowHandlers {
    version: DocumentVersion
    previewing: boolean
}

/** Only what the version's own `abilities` allows; preview needs a stored file. */
function VersionRowActions({ version, previewing, onPreview, onEdit, onDelete }: VersionRowActionsProps) {
    const { t } = useTranslation('management')
    const { update, delete: canDelete } = version.abilities
    const canPreview = version.upload_status === 'completed'

    if (!canPreview && !update && !canDelete) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('versions.actions.menu', { n: version.version })}>
                    {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {canPreview && (
                    <DropdownMenuItem onClick={() => onPreview(version)}>
                        <Eye className="me-2 h-4 w-4" />
                        {t('versions.actions.preview')}
                    </DropdownMenuItem>
                )}
                {update && (
                    <DropdownMenuItem onClick={() => onEdit(version)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('versions.actions.edit')}
                    </DropdownMenuItem>
                )}
                {canDelete && (canPreview || update) && <DropdownMenuSeparator />}
                {canDelete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(version)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('versions.actions.delete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(VersionRowActions)
