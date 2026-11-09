import { memo } from 'react'
import { cn } from '@/lib/utils'
import { humanizePermission } from '../../utils/companyPayload'

interface FeatureOptionProps {
    id: number
    name: string
    checked: boolean
    disabled?: boolean
    onToggle: (id: number) => void
}

/** One checkbox row. Primitive props only, so toggling one row re-renders only that row. */
function FeatureOption({ id, name, checked, disabled, onToggle }: FeatureOptionProps) {
    return (
        <label
            title={name}
            className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50',
                disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
            )}
        >
            <input
                type="checkbox"
                className="h-4 w-4 shrink-0 accent-primary"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(id)}
            />
            <span className="truncate capitalize" dir="ltr">{humanizePermission(name)}</span>
        </label>
    )
}

export default memo(FeatureOption)
