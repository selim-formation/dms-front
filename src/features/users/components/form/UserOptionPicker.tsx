import { memo, useCallback, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/lib/utils'
import type { UserOption } from '../../types/user.types'

/** Search box appears only when the list is long enough to need it. */
const SEARCH_THRESHOLD = 8

interface UserOptionPickerProps {
    options: UserOption[]
    selectedIds: number[]
    onChange: (ids: number[]) => void
    isLoading?: boolean
    disabled?: boolean
    invalid?: boolean
    searchPlaceholder: string
    emptyLabel: string
    /** e.g. "3 selected". */
    selectedLabel: string
    /** Shown instead of the list while `disabled` has a reason (e.g. "Pick a department first"). */
    disabledHint?: string
    maxHeightClass?: string
}

/**
 * Searchable checkbox multi-select. Language- and domain-neutral: roles,
 * departments and sections all use it. Selected ids that are not among the
 * options (e.g. a role the current user may not give) stay in the value.
 */
function UserOptionPicker({
    options,
    selectedIds,
    onChange,
    isLoading,
    disabled,
    invalid,
    searchPlaceholder,
    emptyLabel,
    selectedLabel,
    disabledHint,
    maxHeightClass = 'max-h-44',
}: UserOptionPickerProps) {
    const [query, setQuery] = useState('')
    const selected = useMemo<ReadonlySet<number>>(() => new Set(selectedIds), [selectedIds])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options
    }, [options, query])

    const toggle = useCallback(
        (id: number) => onChange(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]),
        [onChange, selected, selectedIds],
    )

    return (
        <div className={cn('space-y-2', invalid && 'rounded-md ring-1 ring-destructive/60')}>
            {options.length > SEARCH_THRESHOLD && (
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="ps-9"
                        disabled={disabled}
                    />
                </div>
            )}

            <ul className={cn('space-y-0.5 overflow-y-auto rounded-md border border-border p-1.5', maxHeightClass)}>
                {isLoading && <li className="px-2 py-3 text-center text-sm text-muted-foreground">…</li>}
                {!isLoading && disabledHint && (
                    <li className="px-2 py-3 text-center text-sm text-muted-foreground">{disabledHint}</li>
                )}
                {!isLoading && !disabledHint && filtered.length === 0 && (
                    <li className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyLabel}</li>
                )}
                {!disabledHint &&
                    filtered.map((o) => (
                        <li key={o.id}>
                            <label
                                className={cn(
                                    'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50',
                                    disabled && 'pointer-events-none opacity-60',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-primary"
                                    checked={selected.has(o.id)}
                                    onChange={() => toggle(o.id)}
                                    disabled={disabled}
                                />
                                <span className="truncate" dir="auto">{o.label}</span>
                            </label>
                        </li>
                    ))}
            </ul>

            <p className="text-xs text-muted-foreground">{selectedLabel}</p>
        </div>
    )
}

export default memo(UserOptionPicker)
