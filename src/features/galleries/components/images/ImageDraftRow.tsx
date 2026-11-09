import { memo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import ImageUploadField from './ImageUploadField'
import { formErrorText } from '../form/formErrorText'
import { useImagePicker, type PickerStatus } from '../../hooks/useImagePicker'
import { TITLE_MAX, titleFromFileName, type ImageDraft } from '../../utils/galleryForm'

interface ImageDraftRowProps {
    draft: ImageDraft
    index: number
    /** Only this row's errors: `{ upload_id?, title? }`. */
    errors: Record<string, string>
    disabled?: boolean
    onPatch: (key: string, patch: Partial<ImageDraft>) => void
    onRemove: (key: string) => void
}

/**
 * One picture: it uploads as soon as it is chosen (own progress state) and only the
 * finished upload id goes up to the form. Memoised: typing in one row, or a progress
 * tick, never re-renders the others.
 */
function ImageDraftRow({ draft, index, errors, disabled, onPatch, onRemove }: ImageDraftRowProps) {
    const { t } = useTranslation('galleries')
    const { key } = draft
    const titleRef = useRef(draft.title)
    useEffect(() => {
        titleRef.current = draft.title
    }, [draft.title])

    const handleStatus = useCallback(
        (s: PickerStatus) => {
            // A freshly picked picture suggests its file name as the title, unless one was typed.
            const suggest = s.fileName && !titleRef.current ? { title: titleFromFileName(s.fileName) } : {}
            onPatch(key, { ...s, ...suggest })
        },
        [onPatch, key],
    )
    const { file, problem, state, previewUrl, pick, cancel } = useImagePicker(handleStatus)

    const handleRemove = useCallback(() => {
        cancel()
        onRemove(key)
    }, [cancel, onRemove, key])

    return (
        <fieldset className="space-y-4 rounded-xl border border-border p-4" disabled={disabled}>
            <legend className="px-1 text-sm font-semibold text-foreground">{t('form.imageN', { n: index + 1 })}</legend>

            <DepartmentFormField
                label={t('form.file')}
                htmlFor={`img-file-${key}`}
                error={problem ? t(`upload.problem.${problem}`) : formErrorText(t, errors.upload_id)}
            >
                <ImageUploadField
                    id={`img-file-${key}`}
                    file={file}
                    previewUrl={previewUrl}
                    upload={state}
                    onPick={pick}
                    disabled={disabled}
                    invalid={!!errors.upload_id || !!problem}
                />
            </DepartmentFormField>

            <DepartmentFormField label={t('form.imageTitle')} htmlFor={`img-title-${key}`} error={formErrorText(t, errors.title)}>
                <Input
                    id={`img-title-${key}`}
                    value={draft.title}
                    onChange={(e) => onPatch(key, { title: e.target.value })}
                    placeholder={t('form.imageTitlePlaceholder')}
                    maxLength={TITLE_MAX}
                    dir="auto"
                />
            </DepartmentFormField>

            <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {t('form.removeImage')}
                </Button>
            </div>
        </fieldset>
    )
}

export default memo(ImageDraftRow)
