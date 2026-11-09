import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { PRIORITIES } from '../utils/taskPayload'
import type { TaskPriority, TaskScope, TaskSort } from '../types/task.types'

const SORTS: TaskSort[] = [
    '-created_at', 'created_at', 'due_date', '-due_date', 'priority', '-priority', 'status', '-status', 'title', '-title',
]
const SCOPES: TaskScope[] = ['mine', 'created', 'assigned']

interface TaskFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    priority: TaskPriority | ''
    onPriorityChange: (v: TaskPriority | '') => void
    scope: TaskScope | ''
    onScopeChange: (v: TaskScope | '') => void
    sort: TaskSort
    onSortChange: (v: TaskSort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

function TaskFilterBar(p: TaskFilterBarProps) {
    const { t } = useTranslation('taskManagement')

    const priorityOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allPriorities') }, ...PRIORITIES.map((v) => ({ value: v, label: t(`priority.${v}`) }))],
        [t],
    )
    const scopeOptions = useMemo(
        () => [{ value: '' as const, label: t('filters.allScopes') }, ...SCOPES.map((v) => ({ value: v, label: t(`scope.${v}`) }))],
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
            <DepartmentFilterSelect label={t('filters.priority')} value={p.priority} options={priorityOptions} onChange={p.onPriorityChange} />
            <DepartmentFilterSelect label={t('filters.scope')} value={p.scope} options={scopeOptions} onChange={p.onScopeChange} />
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

export default memo(TaskFilterBar)
