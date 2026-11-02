import { memo } from 'react'
import { cn } from '@/lib/utils'
import { SECTION_DESCRIPTION_MAX } from '../utils/sectionPayload'

interface SectionDescriptionFieldProps {
    id?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    invalid?: boolean
    disabled?: boolean
}

/** 5-row textarea with a live character counter. */
function SectionDescriptionField({ id, value, onChange, placeholder, invalid, disabled }: SectionDescriptionFieldProps) {

    return (
        <div className="space-y-1">
            <textarea
                id={id}
                rows={5}
                value={value}
                maxLength={SECTION_DESCRIPTION_MAX}
                disabled={disabled}
                dir="auto"
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                    invalid ? 'border-destructive' : 'border-input',
                )}
            />
            <p className="text-end text-xs text-muted-foreground">
                {value.length} / {SECTION_DESCRIPTION_MAX}
            </p>
        </div>
    )
}

export default memo(SectionDescriptionField)
