import { memo } from 'react'
import GalleryImageCard, { type ImageHandlers } from './GalleryImageCard'
import { isSelectable } from '../../utils/galleryPayload'
import type { GalleryImage } from '../../types/gallery.types'

interface GalleryImageGridProps extends ImageHandlers {
    images: GalleryImage[]
    trashView: boolean
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onLinkError: () => void
}

function GalleryImageGrid({ images, trashView, bulkEnabled, selectedIds, onToggleSelect, onLinkError, ...handlers }: GalleryImageGridProps) {
    return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
                <GalleryImageCard
                    key={img.id}
                    image={img}
                    selectable={bulkEnabled && isSelectable(img, trashView)}
                    selected={selectedIds.has(img.id)}
                    onToggleSelect={onToggleSelect}
                    onLinkError={onLinkError}
                    {...handlers}
                />
            ))}
        </ul>
    )
}

export default memo(GalleryImageGrid)
