import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileArchive } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import ImportForm from './ImportForm'
import type { DocumentImport } from '../types/import.types'

interface ImportFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated: (created: DocumentImport) => void
}

/** Shell: blocks closing (backdrop / Esc) while a file is uploading; the form has its own Cancel. */
function ImportFormDialog({ open, onOpenChange, onCreated }: ImportFormDialogProps) {
    const { t } = useTranslation('imports')
    const [busy, setBusy] = useState(false)

    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!busy) onOpenChange(next)
        },
        [busy, onOpenChange],
    )
    const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileArchive className="h-5 w-5 text-primary" />
                        {t('form.title')}
                    </DialogTitle>
                    <DialogDescription>{t('form.description')}</DialogDescription>
                </DialogHeader>
                <ImportForm onCancel={handleCancel} onCreated={onCreated} onBusyChange={setBusy} />
            </DialogContent>
        </Dialog>
    )
}

export default memo(ImportFormDialog)
