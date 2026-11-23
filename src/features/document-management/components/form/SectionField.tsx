import { memo, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionFieldProps {
    label: string
    htmlFor?: string
    required?: boolean
    /** Short helper shown on the label row, opposite the label, next to the icon. */
    hint?: string
    icon?: LucideIcon
    error?: string
    children: ReactNode
}

/** Label on one side, hint + icon on the other, control below (inside a FormSection). */
function SectionField({ label, htmlFor, required, hint, icon: Icon, error, children }: SectionFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-destructive" aria-hidden="true">*</span>}
                </label>
                {(hint || Icon) && (
                    <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                        {hint && <span className="truncate">{hint}</span>}
                        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    </span>
                )}
            </div>
            {children}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

export default memo(SectionField)
