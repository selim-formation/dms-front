import { memo } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperItem {
    key: string
    label: string
}

interface FormStepperProps {
    steps: StepperItem[]
    current: number
    /** Only steps up to `current` are reachable by click (later ones need validation). */
    onSelect: (index: number) => void
    label: string
}

/** Horizontal stepper; collapses to numbers + the current label on small screens. */
function FormStepper({ steps, current, onSelect, label }: FormStepperProps) {
    return (
        <nav aria-label={label}>
            <ol className="flex items-center gap-2">
                {steps.map((step, i) => {
                    const done = i < current
                    const active = i === current
                    return (
                        <li key={step.key} className="flex flex-1 items-center gap-2 last:flex-none">
                            <button
                                type="button"
                                onClick={() => onSelect(i)}
                                disabled={i > current}
                                aria-current={active ? 'step' : undefined}
                                className={cn(
                                    'flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                                        done && 'border-primary bg-primary text-primary-foreground',
                                        active && 'border-primary bg-primary/10 text-primary',
                                        !done && !active && 'border-border bg-card text-muted-foreground',
                                    )}
                                >
                                    {done ? <Check className="h-4 w-4" /> : i + 1}
                                </span>
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        active ? 'text-foreground' : 'hidden text-muted-foreground sm:inline',
                                    )}
                                >
                                    {step.label}
                                </span>
                            </button>
                            {i < steps.length - 1 && (
                                <span className={cn('h-px flex-1', done ? 'bg-primary' : 'bg-border')} aria-hidden="true" />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default memo(FormStepper)
