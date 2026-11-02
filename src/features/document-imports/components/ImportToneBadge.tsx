import { memo } from 'react'
import { cn } from '@/lib/utils'
import { TONE_CLASSES } from '../utils/importStatus'
import type { StatusTone } from '../types/import.types'

interface ImportToneBadgeProps {
    tone: StatusTone
    label: string
    /** Pulsing dot for "the server is working" states. */
    live?: boolean
    className?: string
}

/** The single coloured pill used for import and row statuses. */
function ImportToneBadge({ tone, label, live, className }: ImportToneBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold',
                TONE_CLASSES[tone],
                className,
            )}
        >
            {live && (
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                </span>
            )}
            {label}
        </span>
    )
}

export default memo(ImportToneBadge)
