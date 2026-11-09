import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { GALLERY_TYPES } from '../utils/galleryPayload'
import type { HasImages } from '../hooks/useGalleryFilterState'
import type { GallerySort, GalleryType } from '../types/gallery.types'

const SORTS: GallerySort[] = [
    '-created_at', 'created_at', 'name', '-name', '-time_period', 'time_period', '-images_count', 'images_count', 'type',
]

interface GalleryFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    type: GalleryType | ''
    onTypeChange: (v: GalleryType | '') => void
    hasImages: HasImages
    onHasImagesChange: (v: HasImages) => void
    sort: GallerySort
    onSortChange: (v: GallerySort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

function GalleryFilterBar(p: GalleryFilterBarProps) {
    const { t } = useTranslation('galleries')

    const typeOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allTypes') }, ...GALLERY_TYPES.map((v) => ({ value: v, label: t(`type.${v}`) }))],
        [t],
    )
    const hasImagesOptions = useMemo(
        () => [
            { value: '' as const, label: t('filters.anyImages') },
            { value: 'yes' as const, label: t('filters.withImages') },
            { value: 'no' as const, label: t('filters.empty') },
        ],
        [t],
    )
    const sortOptions = useMemo(() => SORTS.map((v) => ({ value: v, label: t(`filters.sortOptions.${v}`) })), [t])

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-60 flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={p.search}
                    onChange={(e) => p.onSearchChange(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    aria-label={t('filters.searchPlaceholder')}
                    className="ps-10"
                    maxLength={255}
                />
            </div>
            <DepartmentFilterSelect label={t('filters.type')} value={p.type} options={typeOptions} onChange={p.onTypeChange} />
            <DepartmentFilterSelect label={t('filters.hasImages')} value={p.hasImages} options={hasImagesOptions} onChange={p.onHasImagesChange} />
            {p.hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={p.onClear}>
                    <X className="h-4 w-4" />
                    {t('filters.clear')}
                </Button>
            )}
            <DepartmentFilterSelect label={t('filters.sort')} value={p.sort} options={sortOptions} onChange={p.onSortChange} />
        </div>
    )
}

export default memo(GalleryFilterBar)
