import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import DepartmentFilterChip from '@/features/departments/components/DepartmentFilterChip'
import { usePermissionCatalog } from '@/core/reference-data/hooks/usePermissionCatalog'
import { humanizePermission } from '../utils/companyPayload'
import type { CompanySort } from '../types/company.types'

const SORTS: CompanySort[] = ['-created_at', 'created_at', 'name', '-name', 'id', '-id', '-updated_at', 'updated_at']

interface CompanyFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    hasLogo: boolean
    onHasLogoToggle: () => void
    createdThisMonth: boolean
    onCreatedThisMonthToggle: () => void
    permissionId: number | null
    onPermissionChange: (v: number | null) => void
    sort: CompanySort
    onSortChange: (v: CompanySort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

/** The select speaks strings; the feature id goes in and out as a number (`''` = any). */
function CompanyFilterBar(p: CompanyFilterBarProps) {
    const { t } = useTranslation('companies')
    const { permissions } = usePermissionCatalog()
    const { onPermissionChange } = p

    const featureOptions = useMemo(
        () => [
            { value: '', label: t('filters.anyFeature') },
            ...permissions
                .map((x) => ({ value: String(x.id), label: humanizePermission(x.name) }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        ],
        [permissions, t],
    )
    const sortOptions = useMemo(() => SORTS.map((v) => ({ value: v, label: t(`filters.sortOptions.${v}`) })), [t])
    const handleFeature = useMemo(() => (v: string) => onPermissionChange(v ? Number(v) : null), [onPermissionChange])

    return (
        <div className="space-y-3">
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
                <DepartmentFilterSelect label={t('filters.feature')} value={p.permissionId === null ? '' : String(p.permissionId)} options={featureOptions} onChange={handleFeature} />
                <DepartmentFilterSelect label={t('filters.sort')} value={p.sort} options={sortOptions} onChange={p.onSortChange} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <DepartmentFilterChip active={p.hasLogo} label={t('filters.hasLogo')} onToggle={p.onHasLogoToggle} />
                <DepartmentFilterChip active={p.createdThisMonth} label={t('filters.createdThisMonth')} onToggle={p.onCreatedThisMonthToggle} />
                {p.hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={p.onClear}>
                        <X className="h-4 w-4" />
                        {t('filters.clear')}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default memo(CompanyFilterBar)
