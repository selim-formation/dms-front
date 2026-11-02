import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { IMPORT_STATUSES } from '../utils/importStatus'
import type { ImportMode, ImportStatus } from '../types/import.types'

const MODES: ImportMode[] = ['create_only', 'append_versions']

interface ImportFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    status: ImportStatus | ''
    onStatusChange: (value: ImportStatus | '') => void
    mode: ImportMode | ''
    onModeChange: (value: ImportMode | '') => void
    hasActiveFilters: boolean
    onClear: () => void
}

function ImportFilterBar(props: ImportFilterBarProps) {
    const { t } = useTranslation('imports')

    const statusOptions = useMemo(
        () => [
            { value: '' as const, label: t('filters.allStatuses') },
            ...IMPORT_STATUSES.map((value) => ({ value, label: t(`status.${value}`) })),
        ],
        [t],
    )
    const modeOptions = useMemo(
        () => [
            { value: '' as const, label: t('filters.allModes') },
            ...MODES.map((value) => ({ value, label: t(`mode.${value}`) })),
        ],
        [t],
    )

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-60 flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={props.search}
                    onChange={(e) => props.onSearchChange(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    aria-label={t('filters.searchPlaceholder')}
                    className="ps-10"
                    maxLength={150}
                />
            </div>
            <DepartmentFilterSelect label={t('filters.status')} value={props.status} options={statusOptions} onChange={props.onStatusChange} />
            <DepartmentFilterSelect label={t('filters.mode')} value={props.mode} options={modeOptions} onChange={props.onModeChange} />
            {props.hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={props.onClear}>
                    <X className="h-4 w-4" />
                    {t('filters.clear')}
                </Button>
            )}
        </div>
    )
}

export default memo(ImportFilterBar)
