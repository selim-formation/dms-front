import { memo, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, FileText, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import ImportProgressBar from '@/features/document-imports/components/ImportProgressBar'
import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload'
import { percent } from '@/features/document-imports/utils/importPayload'
import { PROCESS_FILE_ACCEPT, validateProcessFile } from '../../utils/versionFields'
import type { ProcessKind } from '../../types/version.types'

interface ProcessFileCardProps {
    kind: ProcessKind
    exists: boolean
    /** Attached, waiting for the background job to store it. */
    storing: boolean
    /** Edit rule (creator, pending, not in the trash) — from the document's `abilities.update`. */
    canEdit: boolean
    previewing: boolean
    /** Resolves once the upload is finished AND attached; rejects with the server error. */
    onAttach: (kind: ProcessKind, uploadId: string) => Promise<void>
    onPreview: (kind: ProcessKind) => void
    onRemove: (kind: ProcessKind) => void
}

/** One procedure file (creation or renewal): upload / replace, preview, remove. */
function ProcessFileCard({ kind, exists, storing, canEdit, previewing, onAttach, onPreview, onRemove }: ProcessFileCardProps) {
    const { t } = useTranslation('management')
    const inputRef = useRef<HTMLInputElement>(null)
    const { state, upload, reset, forget } = useImportUpload('document_file')
    const [problem, setProblem] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    const handlePick = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            const invalid = validateProcessFile(file)
            setProblem(invalid)
            if (invalid) return
            reset()
            setBusy(true)
            try {
                const done = await upload(file)
                await onAttach(kind, done.id)
                forget()
            } catch {
                // upload errors show in `state`; attach errors are reported by the page
            } finally {
                reset()
                setBusy(false)
            }
        },
        [reset, upload, onAttach, forget, kind],
    )

    const uploading = state.phase === 'uploading' || state.phase === 'assembling'
    const working = busy || uploading
    const tone = storing ? 'info' : exists ? 'success' : 'neutral'
    const label = storing ? t('process.storing') : exists ? t('process.attached') : t('process.missing')

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{t(`process.${kind}.title`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`process.${kind}.description`)}</p>
                </div>
                <ImportToneBadge tone={tone} label={label} live={storing} />
            </div>

            {(uploading || state.phase === 'error') && (
                <div className="space-y-1.5">
                    {uploading && <ImportProgressBar value={percent(state.sent, state.total)} label={t('process.uploading')} />}
                    {state.phase === 'error' && (
                        <p role="alert" className="text-xs text-destructive">{state.error ?? t('process.uploadFailed')}</p>
                    )}
                </div>
            )}
            {problem && <p role="alert" className="text-xs text-destructive">{t(`process.problem.${problem}`)}</p>}
            {storing && <p className="text-xs text-muted-foreground">{t('process.storingHint')}</p>}

            <div className="flex flex-wrap items-center gap-2">
                {/* Always visible so the slot is discoverable; the server rule (creator + pending) decides if it is enabled. */}
                <input ref={inputRef} type="file" accept={PROCESS_FILE_ACCEPT} className="sr-only" onChange={handlePick} disabled={!canEdit} aria-label={t(`process.${kind}.title`)} />
                <Button type="button" size="sm" variant="outline" disabled={!canEdit || working || storing} onClick={() => inputRef.current?.click()}>
                    {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                    {exists ? t('process.replace') : t('process.upload')}
                </Button>
                {exists && (
                    <Button type="button" size="sm" variant="ghost" disabled={previewing} onClick={() => onPreview(kind)}>
                        {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                        {t('process.preview')}
                    </Button>
                )}
                {canEdit && exists && (
                    <Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={working || storing} onClick={() => onRemove(kind)}>
                        <Trash2 className="h-4 w-4" />
                        {t('process.remove')}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default memo(ProcessFileCard)
