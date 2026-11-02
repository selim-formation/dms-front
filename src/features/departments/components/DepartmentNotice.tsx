import { memo, useEffect } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DepartmentNoticeData {
    id: number
    tone: 'success' | 'error'
    message: string
}

interface DepartmentNoticeProps {
    notice: DepartmentNoticeData | null
    onDismiss: () => void
}

const AUTO_DISMISS_MS = 5000

/** Inline, auto-dismissing feedback banner (the app has no toast system). */
function DepartmentNotice({ notice, onDismiss }: DepartmentNoticeProps) {
    useEffect(() => {
        if (!notice) return
        const timer = setTimeout(onDismiss, AUTO_DISMISS_MS)
        return () => clearTimeout(timer)
    }, [notice, onDismiss])

    if (!notice) return null
    const Icon = notice.tone === 'success' ? CheckCircle2 : AlertTriangle

    return (
        <div
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium',
                notice.tone === 'success'
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-destructive/30 bg-destructive/10 text-destructive',
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{notice.message}</span>
            <button type="button" onClick={onDismiss} className="opacity-70 hover:opacity-100" aria-label="Dismiss">
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default memo(DepartmentNotice)
