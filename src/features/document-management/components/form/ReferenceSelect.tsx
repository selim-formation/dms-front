import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
    id: number
    name: string
}

interface ReferenceSelectProps {
    id?: string
    value: number | null
    options: SelectOption[]
    onChange: (value: number | null) => void
    placeholder: string
    invalid?: boolean
    disabled?: boolean
    isLoading?: boolean
}

/** Native single select over {id, name} options (accessible, mobile-friendly), styled like <Input>. */
function ReferenceSelect({ id, value, options, onChange, placeholder, invalid, disabled, isLoading }: ReferenceSelectProps) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value ?? ''}
                disabled={disabled || isLoading}
                aria-invalid={invalid}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                className={cn(
                    'h-10 w-full appearance-none truncate rounded-md border bg-background ps-3 pe-9 text-base text-foreground md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60',
                    invalid ? 'border-destructive' : 'border-input',
                )}
            >
                <option value="">{isLoading ? '…' : placeholder}</option>
                {options.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

export default memo(ReferenceSelect)
