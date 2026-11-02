import { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, FileText, Upload } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { checkProjectFile, PROJECT_FILE_ACCEPT } from '../utils/projectPayload'

interface ProjectFileFieldProps {
    file: File | null
    onFileChange: (file: File | null) => void
    /** Existing signed URL when editing (shown as a link, the file can only be replaced). */
    currentUrl?: string | null
    error?: string
    disabled?: boolean
}

function formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** File picker with browser-side type/size checks (the server re-checks the real content). */
function ProjectFileField({ file, onFileChange, currentUrl, error, disabled }: ProjectFileFieldProps) {
    const { t } = useTranslation('projects')
    const inputRef = useRef<HTMLInputElement>(null)
    const [localError, setLocalError] = useState<string | null>(null)

    const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0]
        e.target.value = ''
        if (!picked) return
        const problem = checkProjectFile(picked)
        if (problem) {
            setLocalError(t(problem === 'type' ? 'form.fileBadType' : 'form.fileTooBig'))
            return
        }
        setLocalError(null)
        onFileChange(picked)
    }

    const message = localError ?? error

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed border-border p-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1 text-sm">
                    {file ? (
                        <p className="truncate font-medium text-foreground" title={file.name}>
                            {file.name} <span className="font-normal text-muted-foreground">· {formatSize(file.size)}</span>
                        </p>
                    ) : currentUrl ? (
                        <a
                            href={currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                            {t('form.fileCurrent')}
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                    ) : (
                        <span className="text-muted-foreground">{t('form.fileHintCreate')}</span>
                    )}
                </div>
                <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    {file || currentUrl ? t('form.fileReplace') : t('form.fileChoose')}
                </Button>
            </div>
            {currentUrl && !file && <p className="text-xs text-muted-foreground">{t('form.fileHintEdit')}</p>}
            <input ref={inputRef} type="file" accept={PROJECT_FILE_ACCEPT} className="hidden" onChange={handlePick} />
            {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
    )
}

export default memo(ProjectFileField)
