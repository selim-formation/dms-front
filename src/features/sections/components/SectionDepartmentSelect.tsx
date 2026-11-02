import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'

interface SectionDepartmentSelectProps {
    id?: string
    value: number | null
    onChange: (id: number | null) => void
    /** Keeps the current department selectable if it isn't in the lookup. */
    fallback?: { id: number; title: string } | null
    invalid?: boolean
    disabled?: boolean
}

/** Native select fed by the cached departments lookup (one request per tenant). */
function SectionDepartmentSelect({ id, value, onChange, fallback, invalid, disabled }: SectionDepartmentSelectProps) {
    const { t } = useTranslation('sections')
    const { departments, isLoading } = useDepartments()
    const hasFallback = fallback && !departments.some((d) => d.id === fallback.id)

    return (
        <div className="relative">
            <select
                id={id}
                value={value ?? ''}
                disabled={disabled || isLoading}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                className={cn(
                    'h-10 w-full appearance-none rounded-md border bg-background ps-3 pe-9 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                    invalid ? 'border-destructive' : 'border-input',
                )}
            >
                <option value="">{t('form.departmentPlaceholder')}</option>
                {hasFallback && <option value={fallback.id}>{fallback.title}</option>}
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.title}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

export default memo(SectionDepartmentSelect)
