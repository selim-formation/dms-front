import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Loader2, X } from 'lucide-react'
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
import { useReviewDocument } from '../hooks/useReviewDocument'
import { NOTE_MAX } from '../utils/managementPayload'
import type { ManagedDocument, ReviewDecision } from '../types/management.types'

interface ReviewDialogProps {
    doc: ManagedDocument
    decision: ReviewDecision
    onOpenChange: (open: boolean) => void
    onDone: (decision: ReviewDecision) => void
    /** 403 / 404 / 409 close the dialog and surface as a notice; 422 stays inline. */
    onBlocked: (error: unknown) => void
}

/** Confirmation with an optional note. Mounted per target, so state is fresh each time. */
function ReviewDialog({ doc, decision, onOpenChange, onDone, onBlocked }: ReviewDialogProps) {
    const { t } = useTranslation(['management', 'common'])
    const [note, setNote] = useState('')
    const [error, setError] = useState<string | null>(null)
    const review = useReviewDocument()
    const reject = decision === 'reject'

    const submit = () => {
        setError(null)
        review.mutate(
            { id: doc.id, decision, note: note.trim() || undefined },
            {
                onSuccess: () => onDone(decision),
                onError: (err) => {
                    if (errorStatus(err) === 422) setError(errorMessage(err) ?? t('management:review.error'))
                    else onBlocked(err)
                },
            },
        )
    }

    return (
        <Dialog open onOpenChange={(next) => !review.isPending && onOpenChange(next)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {reject ? <X className="h-5 w-5 text-destructive" /> : <Check className="h-5 w-5 text-success" />}
                        {t(`management:review.${decision}.title`)}
                    </DialogTitle>
                    <DialogDescription dir="auto">{t(`management:review.${decision}.description`, { name: doc.title })}</DialogDescription>
                </DialogHeader>

                <div className="space-y-1.5">
                    <label htmlFor="review-note" className="text-sm font-medium text-foreground">
                        {t('management:review.note')}
                    </label>
                    <textarea
                        id="review-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={NOTE_MAX}
                        rows={3}
                        disabled={review.isPending}
                        placeholder={t('management:review.notePlaceholder')}
                        dir="auto"
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                    />
                    <p className="text-end text-xs text-muted-foreground">{note.length} / {NOTE_MAX}</p>
                    {reject && <p className="text-xs text-muted-foreground">{t('management:review.rejectHint')}</p>}
                </div>

                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={review.isPending}>
                        {t('common:actions.cancel')}
                    </Button>
                    <Button variant={reject ? 'destructive' : 'default'} onClick={submit} disabled={review.isPending}>
                        {review.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t(`management:review.${decision}.confirm`)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default memo(ReviewDialog)
