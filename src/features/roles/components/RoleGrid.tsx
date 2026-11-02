import { memo } from 'react'
import RoleCard from './RoleCard'
import type { RoleRowActions } from './RoleCardActions'
import type { Role } from '../types/role.types'
import type { RoleAccess } from '../hooks/useRoleAccess'

interface RoleGridProps extends RoleRowActions {
    roles: Role[]
    access: RoleAccess
    selectable: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
}

function RoleGrid({ roles, selectedIds, ...rest }: RoleGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => (
                <RoleCard key={role.id} role={role} selected={selectedIds.has(role.id)} {...rest} />
            ))}
        </div>
    )
}

export default memo(RoleGrid)
