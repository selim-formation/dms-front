import { memo, type ReactNode } from 'react'

interface PickerFieldProps {
    hint?: string
    error?: string
    children: ReactNode
}

/**
 * Wrapper for checkbox pickers. They render their own legend (label + selected count),
 * so a second label here would repeat it: this adds only the hint and the error.
 */
function PickerField({ hint, error, children }: PickerFieldProps) {
    return (
        <div className="space-y-1.5">
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

export default memo(PickerField)
