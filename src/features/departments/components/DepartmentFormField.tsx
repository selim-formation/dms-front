import { memo, type ReactNode } from 'react'

interface DepartmentFormFieldProps {
    label: string
    htmlFor?: string
    hint?: string
    error?: string
    children: ReactNode
}

/** Label + control + hint/error wrapper shared by every form field. */
function DepartmentFormField({ label, htmlFor, hint, error, children }: DepartmentFormFieldProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

export default memo(DepartmentFormField)
