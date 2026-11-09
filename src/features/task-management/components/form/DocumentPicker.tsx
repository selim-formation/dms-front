import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { useDocumentOptions } from '../../hooks/useDocumentOptions'

interface DocumentPickerProps {
    id?: string
    /** Current link (may be held even when its title is not visible to the user). */
    value: number | null
    label: string | null
    onChange: (id: number | null, title: string | null) => void
    invalid?: boolean
    disabled?: boolean
}

/** Searchable single document picker (server-side search); the list loads only while the search box is open. */
function DocumentPicker({ id, value, label, onChange, invalid, disabled }: DocumentPickerProps) {
    const { t } = useTranslation('taskManagement')
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const { options, isLoading, isError } = useDocumentOptions(query, open)

    if (value !== null && !open) {
        return (
            <div className={cn('flex h-10 items-center gap-2 rounded-md border bg-background ps-3 pe-1 text-sm', invalid ? 'border-destructive' : 'border-input')}>
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="flex-1 truncate" dir="auto">{label ?? t('form.documentHidden', { id: value })}</span>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(null, null)}
                    aria-label={t('form.clearDocument')}
                    className="rounded p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id={id}
                    value={query}
                    disabled={disabled}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                    placeholder={t('form.documentSearch')}
                    aria-invalid={invalid}
                    className={cn('ps-10', invalid && 'border-destructive')}
                    dir="auto"
                />
            </div>
            {open && (
                <ul className="max-h-40 space-y-0.5 overflow-y-auto rounded-md border border-border p-1" role="listbox" aria-label={t('form.document')}>
                    {isLoading && <li className="px-2 py-2 text-center text-sm text-muted-foreground">…</li>}
                    {isError && <li className="px-2 py-2 text-center text-sm text-destructive">{t('form.documentsError')}</li>}
                    {!isLoading && !isError && options.length === 0 && (
                        <li className="px-2 py-2 text-center text-sm text-muted-foreground">{t('form.noDocuments')}</li>
                    )}
                    {options.map((o) => (
                        <li key={o.id} role="option" aria-selected={o.id === value}>
                            <button
                                type="button"
                                onClick={() => { onChange(o.id, o.title); setOpen(false); setQuery('') }}
                                className="w-full truncate rounded px-2 py-1.5 text-start text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                dir="auto"
                            >
                                {o.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default memo(DocumentPicker)
