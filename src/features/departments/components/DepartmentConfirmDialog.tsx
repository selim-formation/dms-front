import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, TriangleAlert } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

interface DepartmentConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel: string
    destructive?: boolean
    isPending?: boolean
    error?: string | null
    onConfirm: () => void
}

/** One confirmation dialog for delete / restore / permanent delete / bulk. */
function DepartmentConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    destructive = false,
    isPending = false,
    error,
    onConfirm,
}: DepartmentConfirmDialogProps) {
    const { t } = useTranslation('common')

    return (
        <Dialog open={open} onOpenChange={(next: boolean) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle
                        className={destructive ? 'flex items-center gap-2 text-destructive' : undefined}
                    >
                        {destructive && <TriangleAlert className="h-5 w-5" />}
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('actions.cancel')}
                    </Button>
                    <Button
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default memo(DepartmentConfirmDialog)
