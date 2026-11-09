import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Pencil, Plus, RotateCcw, Trash2, User, XOctagon } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { formatCalendarDate } from '@/features/document-management/utils/formatDate'
import GalleryCover from './GalleryCover'
import { GalleryTypeBadge, ImagesCountBadge } from './GalleryBadges'
import type { Gallery } from '../types/gallery.types'

interface GalleryHeaderCardProps {
    gallery: Gallery
    onEdit: (g: Gallery) => void
    onAddImages: () => void
    onDelete: (g: Gallery) => void
    onRestore: (g: Gallery) => void
    onForceDelete: (g: Gallery) => void
}

/** Details of one gallery + its actions (all from `abilities`). */
function GalleryHeaderCard({ gallery: g, onEdit, onAddImages, onDelete, onRestore, onForceDelete }: GalleryHeaderCardProps) {
    const { t, i18n } = useTranslation('galleries')
    const a = g.abilities

    return (
        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-start">
            <GalleryCover src={g.cover_url} alt={g.name} className="h-32 w-full sm:w-44" />
            <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground" dir="auto">{g.name}</h1>
                    <GalleryTypeBadge type={g.type} />
                    <ImagesCountBadge count={g.images_count} />
                    {g.deleted_at && <Badge variant="outline">{t('details.inTrash')}</Badge>}
                </div>
                {g.description && <p className="whitespace-pre-line text-sm text-muted-foreground" dir="auto">{g.description}</p>}
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    {g.manager_name && (
                        <div className="flex items-center gap-1.5"><User className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">{t('details.manager')}</dt><dd dir="auto">{g.manager_name}</dd></div>
                    )}
                    {g.time_period && (
                        <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">{t('details.period')}</dt><dd>{formatCalendarDate(g.time_period, i18n.language)}</dd></div>
                    )}
                </dl>
                <div className="flex flex-wrap gap-2 pt-1">
                    {a.add_images && (
                        <Button size="sm" onClick={onAddImages}><Plus className="h-4 w-4" />{t('actions.addImages')}</Button>
                    )}
                    {a.update && (
                        <Button size="sm" variant="outline" onClick={() => onEdit(g)}><Pencil className="h-4 w-4" />{t('actions.edit')}</Button>
                    )}
                    {a.restore && (
                        <Button size="sm" variant="outline" onClick={() => onRestore(g)}><RotateCcw className="h-4 w-4" />{t('actions.restore')}</Button>
                    )}
                    {a.delete && (
                        <Button size="sm" variant="outline" onClick={() => onDelete(g)}><Trash2 className="h-4 w-4 text-destructive" />{t('actions.delete')}</Button>
                    )}
                    {a.force_delete && (
                        <Button size="sm" variant="destructive" onClick={() => onForceDelete(g)}><XOctagon className="h-4 w-4" />{t('actions.forceDelete')}</Button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default memo(GalleryHeaderCard)
