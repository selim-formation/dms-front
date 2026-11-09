import { memo } from 'react'
import { ChevronDown } from 'lucide-react'

interface Option<T extends string> {
    value: T
    label: string
}

interface DepartmentFilterSelectProps<T extends string> {
    label: string
    value: T
    options: Option<T>[]
    onChange: (value: T) => void
    /** Stretch to the parent width (form fields). */
    fullWidth?: boolean
    disabled?: boolean
}

/** Native select (accessible, mobile-friendly) styled to match <Input>. */
function DepartmentFilterSelectBase<T extends string>({
    label,
    value,
    options,
    onChange,
    fullWidth,
    disabled,
}: DepartmentFilterSelectProps<T>) {
    return (
        <label className={fullWidth ? 'relative flex w-full items-center' : 'relative inline-flex items-center'}>
            <span className="sr-only">{label}</span>
            <select
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value as T)}
                className={`h-10 appearance-none truncate rounded-md border border-input bg-background ps-3 pe-9 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 md:text-sm ${fullWidth ? 'w-full' : ''}`}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 h-4 w-4 text-muted-foreground" />
        </label>
    )
}

export default memo(DepartmentFilterSelectBase) as typeof DepartmentFilterSelectBase
