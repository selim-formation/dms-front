import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, FlaskConical, Loader2, XCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import type { TestResult, TestStep } from '../types/storage.types'

const STEPS: TestStep[] = ['write', 'size', 'read', 'compare', 'delete']

interface StorageTestDialogProps {
    name: string
    isPending: boolean
    result: TestResult | undefined
    error: unknown
    /** The 5-per-minute limit was hit: the "run again" button stays off. */
    cooling: boolean
    onRunAgain: () => void
    onOpenChange: (open: boolean) => void
}

/** The probe file's five steps with ticks, and the safe failure text if any. */
function StorageTestDialog({ name, isPending, result, error, cooling, onRunAgain, onOpenChange }: StorageTestDialogProps) {
    const { t } = useTranslation('storage')
    const status = errorStatus(error)
    const errorText = error
        ? status === 429
            ? t('test.rateLimited')
            : (errorMessage(error) ?? t('test.failed'))
        : null

    return (
        <Dialog open onOpenChange={(open) => !open && !isPending && onOpenChange(false)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-primary" />
                        {t('test.title')}
                    </DialogTitle>
                    <DialogDescription>{t('test.description', { name })}</DialogDescription>
                </DialogHeader>

                {isPending && (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground" role="status">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('test.running')}
                    </div>
                )}

                {!isPending && result && (
                    <div className="space-y-4">
                        <p
                            role="status"
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                                result.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                            }`}
                        >
                            {result.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            {t(result.passed ? 'test.passed' : 'test.notPassed')}
                        </p>
                        <ul className="space-y-2">
                            {STEPS.map((step) => {
                                const ok = result.steps[step]
                                return (
                                    <li key={step} className="flex items-center gap-2 text-sm">
                                        {ok ? (
                                            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                                        )}
                                        <span className="text-foreground">{t(`test.steps.${step}`)}</span>
                                        <span className="sr-only">{t(ok ? 'test.ok' : 'test.fail')}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        {result.failure && (
                            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" dir="auto">
                                {result.failure}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">{t(result.passed ? 'test.nextPassed' : 'test.nextFailed')}</p>
                    </div>
                )}

                {!isPending && errorText && (
                    <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                        {errorText}
                    </p>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('actions.close', { ns: 'common' })}
                    </Button>
                    <Button onClick={onRunAgain} disabled={isPending || cooling}>
                        {t(cooling ? 'actions.testCooling' : 'test.runAgain')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default memo(StorageTestDialog)
