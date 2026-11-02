import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2, Info, Loader2, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ImportProgressBar from './ImportProgressBar'
import { PROGRESS_STATUSES } from '../utils/importStatus'
import type { DocumentImport } from '../types/import.types'

type Variant = { icon: typeof Info; className: string }

const VARIANTS: Record<DocumentImport['status'], Variant> = {
    draft: { icon: Loader2, className: 'border-border bg-card text-foreground' },
    preparing: { icon: Loader2, className: 'border-border bg-card text-foreground' },
    validating: { icon: Loader2, className: 'border-border bg-card text-foreground' },
    committing: { icon: Loader2, className: 'border-border bg-card text-foreground' },
    rolling_back: { icon: Loader2, className: 'border-border bg-card text-foreground' },
    ready: { icon: Info, className: 'border-primary/30 bg-primary/5 text-foreground' },
    completed: { icon: CheckCircle2, className: 'border-success/30 bg-success/10 text-foreground' },
    completed_errors: { icon: AlertTriangle, className: 'border-amber-500/30 bg-amber-500/10 text-foreground' },
    failed: { icon: AlertTriangle, className: 'border-destructive/30 bg-destructive/10 text-foreground' },
    rolled_back: { icon: Undo2, className: 'border-amber-500/30 bg-amber-500/10 text-foreground' },
}

/** Says, in words, what the current status means and what (if anything) the user should do. */
function ImportStatusPanel({ item }: { item: DocumentImport }) {
    const { t } = useTranslation('imports')
    const { icon: Icon, className } = VARIANTS[item.status]

    return (
        <div role="status" className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', className)}>
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', item.is_in_progress && 'animate-spin')} aria-hidden="true" />
            <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-medium">{t(`statusPanel.${item.status}.title`)}</p>
                <p className="text-sm text-muted-foreground">{t(`statusPanel.${item.status}.description`)}</p>
                {PROGRESS_STATUSES.has(item.status) && (
                    <ImportProgressBar value={item.progress_percent} label={t('list.progress')} />
                )}
                {item.error && (
                    <p className="whitespace-pre-line text-sm text-destructive" dir="auto">
                        {item.error}
                    </p>
                )}
            </div>
        </div>
    )
}

export default memo(ImportStatusPanel)
