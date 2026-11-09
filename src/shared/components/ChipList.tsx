import { memo } from 'react'
import { cn } from '@/lib/utils'

export interface ChipItem {
    id: number | string
    label: string
}

interface ChipListProps {
    items: ChipItem[]
    /** Chips shown before collapsing the rest into "+n" (its tooltip lists them). */
    max?: number
    /** Rendered when `items` is empty. */
    emptyLabel?: string
    className?: string
}

/** Compact, language-neutral chip row (roles, departments, sections, domains …). */
function ChipList({ items, max = 2, emptyLabel = '—', className }: ChipListProps) {
    if (items.length === 0) return <span className="text-sm text-muted-foreground">{emptyLabel}</span>

    const shown = items.slice(0, max)
    const hidden = items.slice(max)

    return (
        <ul className={cn('flex flex-wrap items-center gap-1', className)}>
            {shown.map((item) => (
                <li
                    key={item.id}
                    className="max-w-32 truncate rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                    title={item.label}
                    dir="auto"
                >
                    {item.label}
                </li>
            ))}
            {hidden.length > 0 && (
                <li
                    className="rounded-md bg-muted/60 px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                    title={hidden.map((h) => h.label).join('، ')}
                >
                    +{hidden.length}
                </li>
            )}
        </ul>
    )
}

export default memo(ChipList)
