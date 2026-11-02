import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/lib/utils'
import { useSections } from '@/core/reference-data/hooks/useSections'

export interface SectionOption {
    id: number
    name: string
}

interface DepartmentSectionsPickerProps {
    selectedIds: number[]
    onChange: (ids: number[]) => void
    /** Extra options not present in the tenant lookup (e.g. the department's own sections). */
    extraOptions?: SectionOption[]
    disabled?: boolean
    maxHeightClass?: string
}

/**
 * Searchable multi-select of tenant sections. Used inline in the form and
 * inside a popover in the filter bar. Options come from the cached lookup
 * list (30 min), so mounting it many times costs a single request.
 */
function DepartmentSectionsPicker({
    selectedIds,
    onChange,
    extraOptions,
    disabled,
    maxHeightClass = 'max-h-56',
}: DepartmentSectionsPickerProps) {
    const { t } = useTranslation('departments')
    const { sections, isLoading } = useSections()
    const [query, setQuery] = useState('')

    const options = useMemo<SectionOption[]>(() => {
        const map = new Map<number, SectionOption>()
        extraOptions?.forEach((s) => map.set(s.id, s))
        sections.forEach((s) => map.set(s.id, { id: s.id, name: s.name ?? s.title }))
        return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
    }, [sections, extraOptions])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options
    }, [options, query])

    const selected = useMemo(() => new Set(selectedIds), [selectedIds])

    const toggle = useCallback(
        (id: number) => {
            onChange(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
        },
        [onChange, selected, selectedIds],
    )

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('form.sectionsSearch')}
                    className="ps-9"
                    disabled={disabled}
                />
            </div>

            <ul className={cn('space-y-1 overflow-y-auto rounded-md border border-border p-1.5', maxHeightClass)}>
                {isLoading && <li className="px-2 py-3 text-center text-sm text-muted-foreground">…</li>}
                {!isLoading && filtered.length === 0 && (
                    <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                        {t('form.sectionsEmpty')}
                    </li>
                )}
                {filtered.map((o) => (
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
                            <span className="truncate">{o.name}</span>
                        </label>
                    </li>
                ))}
            </ul>

            <p className="text-xs text-muted-foreground">
                {t('form.sectionsSelected', { count: selectedIds.length })}
            </p>
        </div>
    )
}

export default memo(DepartmentSectionsPicker)
