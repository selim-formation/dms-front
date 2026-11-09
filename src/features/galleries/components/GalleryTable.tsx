import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import GalleryRow from './GalleryRow'
import type { GalleryRowHandlers } from './GalleryRowActions'
import type { Gallery } from '../types/gallery.types'
import { isSelectable } from '../utils/galleryPayload'

const COLUMNS = ['name', 'type', 'manager', 'period', 'images', 'created'] as const

interface GalleryTableProps extends GalleryRowHandlers {
    galleries: Gallery[]
    trashView: boolean
    /** Show the selection column (user holds a bulk permission). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function GalleryTable({ galleries, trashView, bulkEnabled, selectedIds, onToggleSelect, ...handlers }: GalleryTableProps) {
    const { t } = useTranslation('galleries')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-200 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('table.selectColumn')}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">{t(`table.columns.${c}`)}</th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {galleries.map((g) => (
                        <GalleryRow
                            key={g.id}
                            gallery={g}
                            selectable={bulkEnabled && isSelectable(g, trashView)}
                            selected={selectedIds.has(g.id)}
                            onToggleSelect={onToggleSelect}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(GalleryTable)
