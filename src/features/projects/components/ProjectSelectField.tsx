import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption<T extends string> {
    value: T
    label: string
}

interface ProjectSelectFieldProps<T extends string> {
    id?: string
    value: T | null
    options: SelectOption<T>[]
    onChange: (value: T | null) => void
    invalid?: boolean
    disabled?: boolean
}

/** Native select with a "none" entry (optional enum fields can be cleared). */
function ProjectSelectFieldBase<T extends string>({
    id,
    value,
    options,
    onChange,
    invalid,
    disabled,
}: ProjectSelectFieldProps<T>) {
    const { t } = useTranslation('projects')

    return (
        <div className="relative">
            <select
                id={id}
                value={value ?? ''}
                disabled={disabled}
                onChange={(e) => onChange((e.target.value || null) as T | null)}
                className={cn(
                    'h-10 w-full appearance-none rounded-md border bg-background ps-3 pe-9 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                    invalid ? 'border-destructive' : 'border-input',
                )}
            >
                <option value="">{t('form.none')}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

export default memo(ProjectSelectFieldBase) as typeof ProjectSelectFieldBase
