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
}

/** Native select (accessible, mobile-friendly) styled to match <Input>. */
function DepartmentFilterSelectBase<T extends string>({
    label,
    value,
    options,
    onChange,
}: DepartmentFilterSelectProps<T>) {
    return (
        <label className="relative inline-flex items-center">
            <span className="sr-only">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="h-10 appearance-none rounded-md border border-input bg-background ps-3 pe-9 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
