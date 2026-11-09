import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import type { StorageSortChoice } from '../hooks/useStorageFilterState'
import { SEARCH_MAX, STATUSES } from '../utils/storagePayload'
import { PROVIDERS } from '../utils/providerFields'
import type { StorageProvider, StorageStatus } from '../types/storage.types'

const SORTS: StorageSortChoice[] = ['default', 'name', '-name', '-last_tested_at', 'last_tested_at', 'status', 'provider', '-created_at']

interface StorageFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    status: StorageStatus | ''
    onStatusChange: (v: StorageStatus | '') => void
    provider: StorageProvider | ''
    onProviderChange: (v: StorageProvider | '') => void
    sort: StorageSortChoice
    onSortChange: (v: StorageSortChoice) => void
    hasActiveFilters: boolean
    onClear: () => void
}

function StorageFilterBar(p: StorageFilterBarProps) {
    const { t } = useTranslation('storage')

    const statusOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allStatuses') }, ...STATUSES.map((v) => ({ value: v, label: t(`status.${v}`) }))],
        [t],
    )
    const providerOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allProviders') }, ...PROVIDERS.map((v) => ({ value: v, label: t(`provider.${v}`) }))],
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
                    maxLength={SEARCH_MAX}
                />
            </div>
            <DepartmentFilterSelect label={t('filters.status')} value={p.status} options={statusOptions} onChange={p.onStatusChange} />
            <DepartmentFilterSelect label={t('filters.provider')} value={p.provider} options={providerOptions} onChange={p.onProviderChange} />
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

export default memo(StorageFilterBar)
