import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { MAX_DEFAULT_IDS } from '../utils/importPayload'

export interface PickerOption {
    id: number
    name: string
}

interface ImportReferencePickerProps {
    /** Echoed back in onChange so one stable handler serves every picker. */
    field: string
    label: string
    options: PickerOption[]
    selectedIds: number[]
    onChange: (field: string, ids: number[]) => void
    isLoading?: boolean
    disabled?: boolean
}

/** Searchable checkbox list for the "defaults" (departments, sections, types, entities). */
function ImportReferencePicker({ field, label, options, selectedIds, onChange, isLoading, disabled }: ImportReferencePickerProps) {
    const { t } = useTranslation('imports')
    const [query, setQuery] = useState('')
    const selected = useMemo(() => new Set(selectedIds), [selectedIds])
    const atLimit = selectedIds.length >= MAX_DEFAULT_IDS

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options
    }, [options, query])

    const toggle = useCallback(
        (id: number) => onChange(field, selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]),
        [field, onChange, selected, selectedIds],
    )

    return (
        <fieldset className="space-y-2" disabled={disabled}>
            <legend className="flex w-full items-center justify-between text-sm font-medium text-foreground">
                {label}
                <span className="text-xs font-normal text-muted-foreground">{t('form.selectedCount', { count: selectedIds.length })}</span>
            </legend>
            <div className="relative">
                <Search className="absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('form.search')}
                    aria-label={`${label} — ${t('form.search')}`}
                    className="h-9 ps-8 text-sm"
                />
            </div>
            <ul className="max-h-36 space-y-0.5 overflow-y-auto rounded-md border border-border p-1">
                {isLoading && <li className="px-2 py-2 text-center text-sm text-muted-foreground">…</li>}
                {!isLoading && filtered.length === 0 && (
                    <li className="px-2 py-2 text-center text-sm text-muted-foreground">{t('form.noOptions')}</li>
                )}
                {filtered.map((o) => {
                    const checked = selected.has(o.id)
                    return (
                        <li key={o.id}>
                            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-primary"
                                    checked={checked}
                                    disabled={!checked && atLimit}
                                    onChange={() => toggle(o.id)}
                                />
                                <span className="truncate">{o.name}</span>
                            </label>
                        </li>
                    )
                })}
            </ul>
        </fieldset>
    )
}

export default memo(ImportReferencePicker)
