import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { formatCalendarDate } from '@/features/document-management/utils/formatDate'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import GalleryCover from './GalleryCover'
import { GalleryTypeBadge, ImagesCountBadge } from './GalleryBadges'
import GalleryRowActions, { type GalleryRowHandlers } from './GalleryRowActions'
import type { Gallery } from '../types/gallery.types'

interface GalleryRowProps extends GalleryRowHandlers {
    gallery: Gallery
    selectable: boolean
    selected: boolean
    onToggleSelect: (id: number) => void
}

/** Memoised: selecting a row or a refresh re-renders only the rows that changed. */
function GalleryRow({ gallery: g, selectable, selected, onToggleSelect, ...handlers }: GalleryRowProps) {
    const { t, i18n } = useTranslation('galleries')
    const tenant = useTenantId() ?? ''

    return (
        <tr className={cn('border-t border-border align-middle transition-colors hover:bg-accent/40', selected && 'bg-primary/5', g.deleted_at && 'opacity-80')}>
            <td className="w-10 ps-4 py-3">
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary disabled:opacity-30"
                    checked={selected}
                    disabled={!selectable}
                    onChange={() => onToggleSelect(g.id)}
                    aria-label={t('table.select', { name: g.name })}
                />
            </td>
            <td className="max-w-80 px-4 py-3">
                <div className="flex items-center gap-3">
                    <GalleryCover src={g.cover_url} alt={g.name} className="h-12 w-12" />
                    <div className="min-w-0">
                        <Link
                            to="/$tenant/galleries/$galleryId"
                            params={{ tenant, galleryId: String(g.id) }}
                            className="block truncate font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title={g.name}
                            dir="auto"
                        >
                            {g.name}
                        </Link>
                        {g.description && (
                            <p className="line-clamp-1 text-xs text-muted-foreground" title={g.description} dir="auto">{g.description}</p>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3"><GalleryTypeBadge type={g.type} /></td>
            <td className="max-w-40 px-4 py-3 text-sm">
                <p className="truncate text-foreground" title={g.manager_name ?? undefined} dir="auto">{g.manager_name ?? '—'}</p>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {g.time_period ? formatCalendarDate(g.time_period, i18n.language) : '—'}
            </td>
            <td className="px-4 py-3"><ImagesCountBadge count={g.images_count} /></td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{relativeTime(g.created_at, i18n.language)}</td>
            <td className="w-12 pe-3 py-2"><GalleryRowActions gallery={g} {...handlers} /></td>
        </tr>
    )
}

export default memo(GalleryRow)
