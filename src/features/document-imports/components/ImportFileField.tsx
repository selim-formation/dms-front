import { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FileArchive, FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import ImportProgressBar from './ImportProgressBar'
import { FILE_RULES, formatBytes, percent } from '../utils/importPayload'
import type { UploadKind } from '../types/import.types'
import type { UploadState } from '../hooks/useImportUpload'

interface ImportFileFieldProps {
    id: string
    kind: UploadKind
    file: File | null
    onFileChange: (file: File | null) => void
    upload: UploadState
    disabled?: boolean
    invalid?: boolean
}

/** File picker + per-file upload progress. Reused for the ZIP and the manifest. */
function ImportFileField({ id, kind, file, onFileChange, upload, disabled, invalid }: ImportFileFieldProps) {
    const { t, i18n } = useTranslation('imports')
    const inputRef = useRef<HTMLInputElement>(null)
    const Icon = kind === 'archive' ? FileArchive : FileSpreadsheet
    const busy = upload.phase === 'uploading' || upload.phase === 'assembling'
    const pct = percent(upload.sent, upload.total)

    const open = () => inputRef.current?.click()
    const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e.target.files?.[0] ?? null)
        e.target.value = '' // allow re-picking the same file
    }

    return (
        <div>
            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={FILE_RULES[kind].accept}
                className="sr-only"
                onChange={handlePick}
                disabled={disabled}
            />

            {!file ? (
                <button
                    type="button"
                    onClick={open}
                    disabled={disabled}
                    aria-invalid={invalid}
                    className={cn(
                        'flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center transition-colors',
                        'hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60',
                        invalid ? 'border-destructive' : 'border-border',
                    )}
                >
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t(`form.${kind}Pick`)}</span>
                    <span className="text-xs text-muted-foreground">
                        {t('form.fileLimit', { ext: FILE_RULES[kind].ext, size: formatBytes(FILE_RULES[kind].maxBytes, i18n.language) })}
                    </span>
                </button>
            ) : (
                <div className={cn('space-y-3 rounded-xl border bg-card p-3', invalid ? 'border-destructive' : 'border-border')}>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground" title={file.name} dir="auto">
                                {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatBytes(file.size, i18n.language)}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onFileChange(null)}
                            disabled={disabled || busy}
                            aria-label={t('form.removeFile')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {upload.phase !== 'idle' && (
                        <div className="space-y-1.5">
                            <ImportProgressBar value={upload.phase === 'done' ? 100 : pct} label={t('form.uploadProgress')} />
                            <p
                                className={cn(
                                    'flex items-center gap-1.5 text-xs',
                                    upload.phase === 'error' ? 'text-destructive' : 'text-muted-foreground',
                                )}
                                role={upload.phase === 'error' ? 'alert' : 'status'}
                            >
                                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                                {upload.phase === 'uploading' && t('form.uploading', { sent: formatBytes(upload.sent, i18n.language), total: formatBytes(upload.total, i18n.language) })}
                                {upload.phase === 'assembling' && t('form.assembling')}
                                {upload.phase === 'done' && t('form.uploaded')}
                                {upload.phase === 'error' && (upload.error ?? t('form.uploadFailed'))}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(ImportFileField)
