import { memo } from 'react'
import DepartmentCard from './DepartmentCard'
import type { DepartmentRowActions } from './DepartmentCardActions'
import type { Department } from '../types/department.types'
import type { DepartmentPermissions } from '../hooks/useDepartmentPermissions'

interface DepartmentGridProps extends DepartmentRowActions {
    departments: Department[]
    permissions: DepartmentPermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onImageError: () => void
}

function DepartmentGrid({ departments, selectedIds, ...rest }: DepartmentGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {departments.map((department) => (
                <DepartmentCard
                    key={department.id}
                    department={department}
                    selected={selectedIds.has(department.id)}
                    {...rest}
                />
            ))}
        </div>
    )
}

export default memo(DepartmentGrid)
