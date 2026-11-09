import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { useDepartmentOptions, useRoleOptions } from '../hooks/useUserOptions'
import type { UserSort } from '../types/user.types'

const SORTS: UserSort[] = [
    '-created_at', 'created_at', 'name', '-name', 'email', '-email', '-updated_at', 'updated_at', '-email_verified_at', 'email_verified_at',
]

interface UserFilterBarProps {
    search: string
    onSearchChange: (v: string) => void
    roleId: number | null
    onRoleChange: (v: number | null) => void
    departmentId: number | null
    onDepartmentChange: (v: number | null) => void
    sort: UserSort
    onSortChange: (v: UserSort) => void
    hasActiveFilters: boolean
    onClear: () => void
}

/** The selects speak strings; ids go in and out as numbers (`''` = "all"). */
const toId = (v: string): number | null => (v ? Number(v) : null)

function UserFilterBar(p: UserFilterBarProps) {
    const { t } = useTranslation('users')
    const { roles } = useRoleOptions()
    const { departments } = useDepartmentOptions()
    const { onRoleChange, onDepartmentChange } = p

    const roleOptions = useMemo(
        () => [{ value: '', label: t('filters.allRoles') }, ...roles.map((r) => ({ value: String(r.id), label: r.label }))],
        [roles, t],
    )
    const departmentOptions = useMemo(
        () => [{ value: '', label: t('filters.allDepartments') }, ...departments.map((d) => ({ value: String(d.id), label: d.label }))],
        [departments, t],
    )
    const sortOptions = useMemo(() => SORTS.map((v) => ({ value: v, label: t(`filters.sortOptions.${v}`) })), [t])

    const handleRole = useMemo(() => (v: string) => onRoleChange(toId(v)), [onRoleChange])
    const handleDepartment = useMemo(() => (v: string) => onDepartmentChange(toId(v)), [onDepartmentChange])

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
            <DepartmentFilterSelect label={t('filters.role')} value={p.roleId === null ? '' : String(p.roleId)} options={roleOptions} onChange={handleRole} />
            <DepartmentFilterSelect label={t('filters.department')} value={p.departmentId === null ? '' : String(p.departmentId)} options={departmentOptions} onChange={handleDepartment} />
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

export default memo(UserFilterBar)
