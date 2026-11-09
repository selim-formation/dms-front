import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { FolderOpen, MoreVertical, Pencil, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import type { Gallery } from '../types/gallery.types'

export interface GalleryRowHandlers {
    onEdit: (g: Gallery) => void
    onDelete: (g: Gallery) => void
    onRestore: (g: Gallery) => void
    onForceDelete: (g: Gallery) => void
}

/** Only what `abilities` allows. The gallery page is both "view" and "manage images". */
function GalleryRowActions({ gallery: g, ...h }: { gallery: Gallery } & GalleryRowHandlers) {
    const { t } = useTranslation('galleries')
    const tenant = useTenantId() ?? ''
    const a = g.abilities

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: g.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to="/$tenant/galleries/$galleryId" params={{ tenant, galleryId: String(g.id) }}>
                        <FolderOpen className="me-2 h-4 w-4" />
                        {t('actions.open')}
                    </Link>
                </DropdownMenuItem>
                {a.update && (
                    <DropdownMenuItem onClick={() => h.onEdit(g)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {a.restore && (
                    <DropdownMenuItem onClick={() => h.onRestore(g)}>
                        <RotateCcw className="me-2 h-4 w-4" />
                        {t('actions.restore')}
                    </DropdownMenuItem>
                )}
                {(a.delete || a.force_delete) && <DropdownMenuSeparator />}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(g)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
                {a.force_delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(g)}>
                        <XOctagon className="me-2 h-4 w-4" />
                        {t('actions.forceDelete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(GalleryRowActions)
