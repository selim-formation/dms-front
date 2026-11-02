import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import DepartmentFilterChip from '@/features/departments/components/DepartmentFilterChip'
import SectionDepartmentsFilter from './SectionDepartmentsFilter'
import type { SectionSort } from '../types/section.types'

const SORTS: SectionSort[] = ['-created_at', 'created_at', 'name', '-name', 'department', '-department']

interface SectionFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    sort: SectionSort
    onSortChange: (value: SectionSort) => void
    departmentIds: number[]
    onDepartmentIdsChange: (ids: number[]) => void
    hasImage: boolean
    onHasImageToggle: () => void
    createdThisMonth: boolean
    onCreatedThisMonthToggle: () => void
    hasActiveFilters: boolean
    onClear: () => void
}

function SectionFilterBar(props: SectionFilterBarProps) {
    const { t } = useTranslation('sections')

    const sortOptions = useMemo(
        () => SORTS.map((value) => ({ value, label: t(`filters.sortOptions.${value}`) })),
        [t],
    )

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={props.search}
                    onChange={(e) => props.onSearchChange(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    className="ps-10"
                    maxLength={255}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <SectionDepartmentsFilter selectedIds={props.departmentIds} onChange={props.onDepartmentIdsChange} />
                <DepartmentFilterChip
                    active={props.hasImage}
                    label={t('filters.hasImage')}
                    onToggle={props.onHasImageToggle}
                />
                <DepartmentFilterChip
                    active={props.createdThisMonth}
                    label={t('filters.createdThisMonth')}
                    onToggle={props.onCreatedThisMonthToggle}
                />
                <div className="ms-auto flex items-center gap-2">
                    {props.hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={props.onClear}>
                            <X className="h-4 w-4" />
                            {t('filters.clear')}
                        </Button>
                    )}
                    <DepartmentFilterSelect
                        label={t('filters.sort')}
                        value={props.sort}
                        options={sortOptions}
                        onChange={props.onSortChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(SectionFilterBar)
