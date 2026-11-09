import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, Pencil, RotateCcw, Trash2, XOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import GalleryCover from '../GalleryCover'
import type { GalleryImage } from '../../types/gallery.types'

export interface ImageHandlers {
    onEdit: (img: GalleryImage) => void
    onDelete: (img: GalleryImage) => void
    onRestore: (img: GalleryImage) => void
    onForceDelete: (img: GalleryImage) => void
}

interface GalleryImageCardProps extends ImageHandlers {
    image: GalleryImage
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
    /** A picture link failed (they last 2 hours): the page refreshes the list once. */
    onLinkError: () => void
}

/** Memoised card: selecting one picture or a refresh re-renders only the cards that changed. */
function GalleryImageCard({ image, selectable, selected, onToggleSelect, onLinkError, ...h }: GalleryImageCardProps) {
    const { t } = useTranslation('galleries')
    const a = image.abilities
    const hasMenu = a.update || a.delete || a.restore || a.force_delete

    return (
        <li className={cn('group relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md', selected ? 'border-primary ring-2 ring-primary/30' : 'border-border', image.deleted_at && 'opacity-80')}>
            <GalleryCover src={image.url} alt={image.title} className="aspect-square w-full rounded-none" onError={onLinkError} />

            {selectable && (
                <label className="absolute start-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-card/90 shadow-sm">
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={selected}
                        onChange={() => onToggleSelect(image.id)}
                        aria-label={t('imageTable.select', { name: image.title })}
                    />
                </label>
            )}

            <div className="flex items-center gap-1 p-2.5 ps-3">
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground" title={image.title} dir="auto">{image.title}</p>
                {hasMenu && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={t('actions.imageMenu', { name: image.title })}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {a.update && (
                                <DropdownMenuItem onClick={() => h.onEdit(image)}>
                                    <Pencil className="me-2 h-4 w-4" />
                                    {t('actions.editImage')}
                                </DropdownMenuItem>
                            )}
                            {a.restore && (
                                <DropdownMenuItem onClick={() => h.onRestore(image)}>
                                    <RotateCcw className="me-2 h-4 w-4" />
                                    {t('actions.restore')}
                                </DropdownMenuItem>
                            )}
                            {(a.delete || a.force_delete) && (a.update || a.restore) && <DropdownMenuSeparator />}
                            {a.delete && (
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(image)}>
                                    <Trash2 className="me-2 h-4 w-4" />
                                    {t('actions.delete')}
                                </DropdownMenuItem>
                            )}
                            {a.force_delete && (
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onForceDelete(image)}>
                                    <XOctagon className="me-2 h-4 w-4" />
                                    {t('actions.forceDelete')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </li>
    )
}

export default memo(GalleryImageCard)
