import { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import ImportProgressBar from '@/features/document-imports/components/ImportProgressBar'
import { formatBytes, percent } from '@/features/document-imports/utils/importPayload'
import type { UploadState } from '@/features/document-imports/hooks/useImportUpload'
import { IMAGE_ACCEPT, IMAGE_MAX_BYTES } from '../../utils/galleryPayload'

interface ImageUploadFieldProps {
    id: string
    file: File | null
    previewUrl: string | null
    upload: UploadState
    onPick: (file: File | null) => void
    disabled?: boolean
    invalid?: boolean
    /** Optional existing picture (edit): shown until a new file is chosen. */
    currentUrl?: string | null
}

/** Picture picker with preview and upload progress. Presentational: the upload lives in `useImagePicker`. */
function ImageUploadField({ id, file, previewUrl, upload, onPick, disabled, invalid, currentUrl }: ImageUploadFieldProps) {
    const { t, i18n } = useTranslation('galleries')
    const inputRef = useRef<HTMLInputElement>(null)
    const busy = upload.phase === 'uploading' || upload.phase === 'assembling'
    const pct = percent(upload.sent, upload.total)
    const shown = previewUrl ?? currentUrl ?? null

    return (
        <div>
            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={IMAGE_ACCEPT}
                className="sr-only"
                disabled={disabled}
                onChange={(e) => {
                    onPick(e.target.files?.[0] ?? null)
                    e.target.value = '' // allow re-picking the same file
                }}
            />

            {!file ? (
                <div className={cn('flex items-center gap-3 rounded-xl border border-dashed p-3', invalid ? 'border-destructive' : 'border-border')}>
                    {shown && <img src={shown} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={disabled}
                        aria-invalid={invalid}
                        className="flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-3 text-center transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                    >
                        <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">{t(currentUrl ? 'upload.replace' : 'upload.pick')}</span>
                        <span className="text-xs text-muted-foreground">{t('upload.limit', { size: formatBytes(IMAGE_MAX_BYTES, i18n.language) })}</span>
                    </button>
                </div>
            ) : (
                <div className={cn('space-y-3 rounded-xl border bg-card p-3', invalid ? 'border-destructive' : 'border-border')}>
                    <div className="flex items-center gap-3">
                        {previewUrl && <img src={previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground" title={file.name} dir="auto">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatBytes(file.size, i18n.language)}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPick(null)}
                            disabled={disabled}
                            aria-label={t('upload.remove')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {upload.phase !== 'idle' && (
                        <div className="space-y-1.5">
                            <ImportProgressBar value={upload.phase === 'done' ? 100 : pct} label={t('upload.progress')} />
                            <p
                                className={cn('flex items-center gap-1.5 text-xs', upload.phase === 'error' ? 'text-destructive' : 'text-muted-foreground')}
                                role={upload.phase === 'error' ? 'alert' : 'status'}
                            >
                                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                                {upload.phase === 'uploading' && t('upload.uploading', { sent: formatBytes(upload.sent, i18n.language), total: formatBytes(upload.total, i18n.language) })}
                                {upload.phase === 'assembling' && t('upload.assembling')}
                                {upload.phase === 'done' && t('upload.done')}
                                {upload.phase === 'error' && (upload.error ?? t('upload.failed'))}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(ImageUploadField)
