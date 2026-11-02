import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleDot, Search, Shapes, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import type { TrashedFilter } from '@/features/departments/components/DepartmentFilterBar'
import ProjectOptionsFilter from './ProjectOptionsFilter'
import {
    PROJECT_STATUSES,
    PROJECT_TYPES,
    type ProjectSort,
    type ProjectStatus,
    type ProjectType,
} from '../types/project.types'

const SORTS: ProjectSort[] = [
    '-created_at', 'created_at', 'name', '-name', 'status', '-status',
    'start_date', '-start_date', 'end_date', '-end_date', '-updated_at', 'updated_at',
]

interface ProjectFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    trashed: TrashedFilter
    onTrashedChange: (value: TrashedFilter) => void
    sort: ProjectSort
    onSortChange: (value: ProjectSort) => void
    status: ProjectStatus[]
    onStatusChange: (value: ProjectStatus[]) => void
    type: ProjectType[]
    onTypeChange: (value: ProjectType[]) => void
    showTrashedFilter: boolean
    hasActiveFilters: boolean
    onClear: () => void
}

function ProjectFilterBar(props: ProjectFilterBarProps) {
    const { t } = useTranslation('projects')
    const { t: tDept } = useTranslation('departments')

    const trashedOptions = useMemo(
        () => [
            { value: 'active' as const, label: tDept('filters.hideDeleted') },
            { value: 'with' as const, label: tDept('filters.includeDeleted') },
            { value: 'only' as const, label: tDept('filters.onlyDeleted') },
        ],
        [tDept],
    )
    const sortOptions = useMemo(
        () => SORTS.map((value) => ({ value, label: t(`filters.sortOptions.${value}`) })),
        [t],
    )
    const statusOptions = useMemo(
        () => PROJECT_STATUSES.map((value) => ({ value, label: t(`status.${value}`) })),
        [t],
    )
    const typeOptions = useMemo(
        () => PROJECT_TYPES.map((value) => ({ value, label: t(`type.${value}`) })),
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
                {props.showTrashedFilter && (
                    <DepartmentFilterSelect
                        label={t('filters.deleted')}
                        value={props.trashed}
                        options={trashedOptions}
                        onChange={props.onTrashedChange}
                    />
                )}
                <ProjectOptionsFilter
                    icon={CircleDot}
                    label={t('filters.status')}
                    activeLabel={t('filters.statusCount', { count: props.status.length })}
                    options={statusOptions}
                    selected={props.status}
                    onChange={props.onStatusChange}
                />
                <ProjectOptionsFilter
                    icon={Shapes}
                    label={t('filters.type')}
                    activeLabel={t('filters.typeCount', { count: props.type.length })}
                    options={typeOptions}
                    selected={props.type}
                    onChange={props.onTypeChange}
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

export default memo(ProjectFilterBar)
