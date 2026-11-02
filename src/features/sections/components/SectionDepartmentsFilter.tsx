import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'

interface SectionDepartmentsFilterProps {
    selectedIds: number[]
    onChange: (ids: number[]) => void
}

/** Popover multi-select of departments (options come from the cached lookup). */
function SectionDepartmentsFilter({ selectedIds, onChange }: SectionDepartmentsFilterProps) {
    const { t } = useTranslation('sections')
    const { departments, isLoading } = useDepartments()
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? departments.filter((d) => d.title.toLowerCase().includes(q)) : departments
    }, [departments, query])

    const selected = useMemo(() => new Set(selectedIds), [selectedIds])

    const toggle = useCallback(
        (id: number) => onChange(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]),
        [onChange, selected, selectedIds],
    )

    const count = selectedIds.length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={count ? 'default' : 'outline'} className="rounded-full">
                    <Building2 className="h-4 w-4" />
                    {count ? t('filters.departmentsCount', { count }) : t('filters.departments')}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 space-y-2">
                <div className="relative">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('filters.departmentsSearch')}
                        className="ps-9"
                    />
                </div>
                <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-1.5">
                    {isLoading && <li className="px-2 py-3 text-center text-sm text-muted-foreground">…</li>}
                    {!isLoading && filtered.length === 0 && (
                        <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                            {t('filters.departmentsEmpty')}
                        </li>
                    )}
                    {filtered.map((d) => (
                        <li key={d.id}>
                            <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-primary"
                                    checked={selected.has(d.id)}
                                    onChange={() => toggle(d.id)}
                                />
                                <span className="truncate">{d.title}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default memo(SectionDepartmentsFilter)
