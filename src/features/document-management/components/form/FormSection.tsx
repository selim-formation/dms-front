import { memo, useId, useState, type ReactNode } from 'react'
import { ChevronUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormSectionProps {
    icon: LucideIcon
    title: string
    subtitle: string
    children: ReactNode
}

/** Bordered card with an icon header, divider and collapsible body (create / edit wizard sections). */
function FormSection({ icon: Icon, title, subtitle, children }: FormSectionProps) {
    const [open, setOpen] = useState(true)
    const bodyId = useId()

    return (
        <section className="rounded-2xl border border-border bg-card">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={bodyId}
                className={cn(
                    'flex w-full items-start gap-3 rounded-2xl px-5 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    open && 'rounded-b-none border-b border-border',
                )}
            >
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold text-foreground">{title}</span>
                    <span className="block text-sm text-muted-foreground">{subtitle}</span>
                </span>
                <ChevronUp className={cn('mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform', !open && 'rotate-180')} aria-hidden="true" />
            </button>
            <div id={bodyId} hidden={!open} className="p-5">
                {children}
            </div>
        </section>
    )
}

export default memo(FormSection)
