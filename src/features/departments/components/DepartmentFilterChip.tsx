import { memo } from 'react'
import { cn } from '@/lib/utils'

interface DepartmentFilterChipProps {
    active: boolean
    label: string
    onToggle: () => void
}

/** Pill toggle for boolean filters. */
function DepartmentFilterChip({ active, label, onToggle }: DepartmentFilterChipProps) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onToggle}
            className={cn(
                'h-10 rounded-full border px-4 text-sm font-medium transition-colors',
                active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
        >
            {label}
        </button>
    )
}

export default memo(DepartmentFilterChip)
