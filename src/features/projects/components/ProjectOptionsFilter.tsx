import { memo, useCallback, useMemo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'

export interface FilterOption<T extends string> {
    value: T
    label: string
}

interface ProjectOptionsFilterProps<T extends string> {
    icon: LucideIcon
    label: string
    /** Label when something is selected, e.g. "Status (2)". */
    activeLabel: string
    options: FilterOption<T>[]
    selected: T[]
    onChange: (next: T[]) => void
}

/** Generic multi-select popover for small fixed option lists (status, type…). */
function ProjectOptionsFilterBase<T extends string>({
    icon: Icon,
    label,
    activeLabel,
    options,
    selected,
    onChange,
}: ProjectOptionsFilterProps<T>) {
    const set = useMemo(() => new Set(selected), [selected])
    const toggle = useCallback(
        (value: T) => onChange(set.has(value) ? selected.filter((v) => v !== value) : [...selected, value]),
        [onChange, set, selected],
    )

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={selected.length ? 'default' : 'outline'} className="rounded-full">
                    <Icon className="h-4 w-4" />
                    {selected.length ? activeLabel : label}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60">
                <ul className="space-y-1">
                    {options.map((o) => (
                        <li key={o.value}>
                            <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-primary"
                                    checked={set.has(o.value)}
                                    onChange={() => toggle(o.value)}
                                />
                                <span>{o.label}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default memo(ProjectOptionsFilterBase) as typeof ProjectOptionsFilterBase
