import { memo } from 'react'
import EmployeeCard from './EmployeeCard'
import type { EmployeeRowActions } from './EmployeeCardActions'
import type { Employee } from '../types/employee.types'
import type { EmployeePermissions } from '../hooks/useEmployeePermissions'

interface EmployeeGridProps extends EmployeeRowActions {
    employees: Employee[]
    permissions: EmployeePermissions
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function EmployeeGrid({ employees, selectedIds, ...rest }: EmployeeGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} selected={selectedIds.has(employee.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(EmployeeGrid)
