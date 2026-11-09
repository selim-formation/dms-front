import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import CompanyLogo from '../CompanyLogo'
import { LOGO_TYPES, validateLogo } from '../../utils/companyPayload'

interface CompanyLogoFieldProps {
    name: string
    /** Current stored logo (signed URL) — hidden once removed or replaced. */
    currentSrc: string | null
    file: File | null
    removed: boolean
    onFileChange: (file: File | null) => void
    onRemoveChange: (removed: boolean) => void
    /** 0–100 while the chosen file is being uploaded, else `null`. */
    progress: number | null
    error?: string
    disabled?: boolean
}

/** Logo picker with live preview, type / 5 MB validation (SVG refused), remove and upload progress. */
function CompanyLogoField({ name, currentSrc, file, removed, onFileChange, onRemoveChange, progress, error, disabled }: CompanyLogoFieldProps) {
    const { t } = useTranslation('companies')
    const inputRef = useRef<HTMLInputElement>(null)
    const [localError, setLocalError] = useState<string | null>(null)

    const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
    useEffect(() => {
        if (!preview) return
        return () => URL.revokeObjectURL(preview)
    }, [preview])

    const shown = preview ?? (removed ? null : currentSrc)

    const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0]
        e.target.value = ''
        if (!picked) return
        const problem = validateLogo(picked)
        if (problem) {
            setLocalError(t(problem === 'type' ? 'form.logoBadType' : 'form.logoTooBig'))
            return
        }
        setLocalError(null)
        onRemoveChange(false)
        onFileChange(picked)
    }

    const handleRemove = () => {
        setLocalError(null)
        onFileChange(null)
        if (currentSrc) onRemoveChange(true)
    }

    const message = localError ?? error

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                <CompanyLogo name={name || '?'} src={shown} className="h-20 w-20 text-xl" />
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>
                            <ImagePlus className="h-4 w-4" />
                            {t(shown ? 'form.logoReplace' : 'form.logoChoose')}
                        </Button>
                        {shown && (
                            <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={handleRemove}>
                                {t('form.logoRemove')}
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{t('form.logoHint')}</p>
                </div>
            </div>

            {progress !== null && (
                <div className="space-y-1" role="status">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{t('form.logoUploading', { percent: progress })}</p>
                </div>
            )}

            <input ref={inputRef} type="file" accept={LOGO_TYPES.join(',')} className="hidden" onChange={handlePick} />
            {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
    )
}

export default memo(CompanyLogoField)
