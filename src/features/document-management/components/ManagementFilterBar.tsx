import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { CATEGORIES, IMPORTANCES } from '../utils/managementPayload'
import type { DocumentCategory, Importance, ManagementSort } from '../types/management.types'

const SORTS: ManagementSort[] = [
    '-created_at', 'created_at', 'title', '-title', 'importance', '-importance', 'status', '-status',
]

interface ManagementFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    importance: Importance | ''
    onImportanceChange: (v: Importance | '') => void
    category: DocumentCategory | ''
    onCategoryChange: (v: DocumentCategory | '') => void
    sort: ManagementSort
    onSortChange: (v: ManagementSort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

function ManagementFilterBar(p: ManagementFilterBarProps) {
    const { t } = useTranslation('management')

    const importanceOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allImportance') }, ...IMPORTANCES.map((v) => ({ value: v, label: t(`importance.${v}`) }))],
        [t],
    )
    const categoryOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allCategories') }, ...CATEGORIES.map((v) => ({ value: v, label: t(`category.${v}`) }))],
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
            <DepartmentFilterSelect label={t('filters.importance')} value={p.importance} options={importanceOptions} onChange={p.onImportanceChange} />
            <DepartmentFilterSelect label={t('filters.category')} value={p.category} options={categoryOptions} onChange={p.onCategoryChange} />
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

export default memo(ManagementFilterBar)
