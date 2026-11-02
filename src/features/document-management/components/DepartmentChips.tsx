import { memo } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import type { DepartmentRef } from '../types/management.types'

interface DepartmentChipsProps {
    departments: DepartmentRef[]
    max?: number
}

/** First `max` departments as chips, the rest collapsed into "+n" (full list in the title). */
function DepartmentChips({ departments, max = 2 }: DepartmentChipsProps) {
    if (departments.length === 0) return <span className="text-muted-foreground">—</span>
    const shown = departments.slice(0, max)
    const rest = departments.length - shown.length

    return (
        <div className="flex flex-wrap gap-1">
            {shown.map((d) => (
                <Badge key={d.id} variant="secondary" className="max-w-32 truncate font-medium" title={d.title}>
                    {d.title}
                </Badge>
            ))}
            {rest > 0 && (
                <Badge variant="outline" title={departments.slice(max).map((d) => d.title).join(', ')}>
                    +{rest}
                </Badge>
            )}
        </div>
    )
}

export default memo(DepartmentChips)
