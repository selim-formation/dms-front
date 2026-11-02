import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { ROLE_NAME_MAX } from '../utils/rolePayload'
import type { RoleSort } from '../types/role.types'

const SORTS: RoleSort[] = ['-created_at', 'created_at', 'name', '-name']

interface RoleFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    sort: RoleSort
    onSortChange: (value: RoleSort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

function RoleFilterBar({ search, onSearchChange, sort, onSortChange, hasActiveFilters, onClear }: RoleFilterBarProps) {
    const { t } = useTranslation('roles')

    const sortOptions = useMemo(
        () => SORTS.map((value) => ({ value, label: t(`filters.sortOptions.${value}`) })),
        [t],
    )

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-60 flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    className="ps-10"
                    maxLength={ROLE_NAME_MAX}
                    aria-label={t('filters.searchPlaceholder')}
                />
            </div>
            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                    <X className="h-4 w-4" />
                    {t('filters.clear')}
                </Button>
            )}
            <DepartmentFilterSelect label={t('filters.sort')} value={sort} options={sortOptions} onChange={onSortChange} />
        </div>
    )
}

export default memo(RoleFilterBar)
