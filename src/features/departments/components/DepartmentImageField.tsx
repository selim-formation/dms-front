import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import DepartmentImage from './DepartmentImage'
import { DEPARTMENT_IMAGE_MAX_BYTES, DEPARTMENT_IMAGE_TYPES } from '../utils/departmentPayload'

interface DepartmentImageFieldProps {
    /** Current stored image (signed URL) — hidden once removed or replaced. */
    currentSrc: string | null
    file: File | null
    removed: boolean
    onFileChange: (file: File | null) => void
    onRemoveChange: (removed: boolean) => void
    error?: string
    disabled?: boolean
}

/** Image picker with live preview, 2 MB / type validation and remove support. */
function DepartmentImageField({
    currentSrc,
    file,
    removed,
    onFileChange,
    onRemoveChange,
    error,
    disabled,
}: DepartmentImageFieldProps) {
    const { t } = useTranslation('departments')
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
        if (!DEPARTMENT_IMAGE_TYPES.includes(picked.type)) {
            setLocalError(t('form.imageBadType'))
            return
        }
        if (picked.size > DEPARTMENT_IMAGE_MAX_BYTES) {
            setLocalError(t('form.imageTooBig'))
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
                <DepartmentImage src={shown} alt="" className="h-20 w-20" iconClassName="h-8 w-8" />
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                            onClick={() => inputRef.current?.click()}
                        >
                            <ImagePlus className="h-4 w-4" />
                            {shown ? t('form.imageReplace') : t('form.imageChoose')}
                        </Button>
                        {shown && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={disabled}
                                onClick={handleRemove}
                            >
                                {t('form.imageRemove')}
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{t('form.imageHint')}</p>
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={DEPARTMENT_IMAGE_TYPES.join(',')}
                className="hidden"
                onChange={handlePick}
            />
            {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
    )
}

export default memo(DepartmentImageField)
