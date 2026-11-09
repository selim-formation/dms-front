import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import type { GalleryType } from '../types/gallery.types'

export const GalleryTypeBadge = memo(function GalleryTypeBadge({ type }: { type: GalleryType | null }) {
    const { t } = useTranslation('galleries')
    if (!type) return <span className="text-muted-foreground">—</span>
    return <Badge variant="secondary" className="font-medium">{t(`type.${type}`)}</Badge>
})

/** Green when the gallery has pictures, grey when empty. */
export const ImagesCountBadge = memo(function ImagesCountBadge({ count }: { count: number }) {
    const { t } = useTranslation('galleries')
    return <ImportToneBadge tone={count > 0 ? 'success' : 'neutral'} label={t('imagesCount', { count })} />
})
