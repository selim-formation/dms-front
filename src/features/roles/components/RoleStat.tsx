import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'

interface RoleStatProps {
    icon: LucideIcon
    value: number
    label: string
}

/** Inline "icon 3 Permissions" counter. */
function RoleStat({ icon: Icon, value, label }: RoleStatProps) {
    return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold text-foreground">{value}</span>
            <span>{label}</span>
        </div>
    )
}

export default memo(RoleStat)
