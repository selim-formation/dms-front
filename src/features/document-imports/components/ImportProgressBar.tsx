import { memo } from 'react'
import { Progress } from '@/shared/components/ui/progress'
import { cn } from '@/lib/utils'

interface ImportProgressBarProps {
    value: number
    label: string
    showValue?: boolean
    className?: string
}

/** Thin accessible progress bar with an optional % readout. */
function ImportProgressBar({ value, label, showValue = true, className }: ImportProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value))
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Progress value={clamped} className="h-2 min-w-16 flex-1" aria-label={label} />
            {showValue && <span className="w-9 text-end text-xs tabular-nums text-muted-foreground">{clamped}%</span>}
        </div>
    )
}

export default memo(ImportProgressBar)
