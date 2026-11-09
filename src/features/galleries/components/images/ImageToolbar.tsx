import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import GalleryTabs from '../GalleryTabs'
import type { ImageTab } from '../../hooks/useImageFilterState'
import type { ImageSort } from '../../types/gallery.types'

const SORTS: ImageSort[] = ['-created_at', 'created_at', 'title', '-title']
const TABS: readonly ImageTab[] = ['live', 'trash']

interface ImageToolbarProps {
    tab: ImageTab
    onTabChange: (t: ImageTab) => void
    /** The trash tab needs a permission that can see trashed pictures; hide it otherwise. */
    showTrash: boolean
    search: string
    onSearchChange: (v: string) => void
    sort: ImageSort
    onSortChange: (v: ImageSort) => void
}

function ImageToolbar({ tab, onTabChange, showTrash, search, onSearchChange, sort, onSortChange }: ImageToolbarProps) {
    const { t } = useTranslation('galleries')
    const sortOptions = useMemo(() => SORTS.map((v) => ({ value: v, label: t(`imageFilters.sortOptions.${v}`) })), [t])

    return (
        <div className="flex flex-wrap items-center gap-3">
            {showTrash && <GalleryTabs value={tab} tabs={TABS} onChange={onTabChange} labelPrefix="imageTabs" ariaLabel={t('imageTabs.label')} />}
            <div className="relative min-w-52 flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={t('imageFilters.searchPlaceholder')} aria-label={t('imageFilters.searchPlaceholder')} className="ps-10" maxLength={255} />
            </div>
            <DepartmentFilterSelect label={t('filters.sort')} value={sort} options={sortOptions} onChange={onSortChange} />
        </div>
    )
}

export default memo(ImageToolbar)
