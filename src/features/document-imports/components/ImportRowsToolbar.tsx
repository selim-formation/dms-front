import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { ROW_STATUSES } from '../utils/importStatus'
import type { RowStatus } from '../types/import.types'

interface ImportRowsToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    status: RowStatus | ''
    onStatusChange: (value: RowStatus | '') => void
}

function ImportRowsToolbar({ search, onSearchChange, status, onStatusChange }: ImportRowsToolbarProps) {
    const { t } = useTranslation('imports')
    const options = useMemo(
        () => [{ value: '' as const, label: t('filters.allRows') }, ...ROW_STATUSES.map((value) => ({ value, label: t(`rowStatus.${value}`) }))],
        [t],
    )

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-52 flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('rows.searchPlaceholder')}
                    aria-label={t('rows.searchPlaceholder')}
                    className="ps-10"
                />
            </div>
            <DepartmentFilterSelect label={t('filters.rowStatus')} value={status} options={options} onChange={onStatusChange} />
        </div>
    )
}

export default memo(ImportRowsToolbar)
