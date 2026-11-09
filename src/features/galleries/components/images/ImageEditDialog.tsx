import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import ImageUploadField from './ImageUploadField'
import { formErrorText } from '../form/formErrorText'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { useImagePicker, type PickerStatus } from '../../hooks/useImagePicker'
import { useUpdateImage } from '../../hooks/useImageMutations'
import { TITLE_MAX, serverFieldErrors, type FormErrors } from '../../utils/galleryForm'
import type { GalleryImage } from '../../types/gallery.types'

interface ImageEditDialogProps {
    image: GalleryImage
    onOpenChange: (open: boolean) => void
    onSaved: () => void
    /** 403 / 404 / 409 (image or gallery in the trash): the page explains and refreshes. */
    onBlocked: (err: unknown) => void
}

/** Change the title and, optionally, replace the picture (a refused file changes nothing). */
function ImageEditDialog({ image, onOpenChange, onSaved, onBlocked }: ImageEditDialogProps) {
    const { t } = useTranslation('galleries')
    const [title, setTitle] = useState(image.title)
    const [status, setStatus] = useState<PickerStatus>({ uploadId: null, fileName: null, uploading: false })
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const mutation = useUpdateImage()
    const { file, problem, state, previewUrl, pick } = useImagePicker(setStatus)

    const handlePick = useCallback((f: File | null) => { setErrors({}); pick(f) }, [pick])

    const submit = () => {
        setSubmitError(null)
        const trimmed = title.trim()
        if (!trimmed) return setErrors({ title: 'imageTitleRequired' })
        if (file && !status.uploadId) return setErrors({ upload_id: status.uploading ? 'uploadPending' : 'fileRequired' })
        setErrors({})

        mutation.mutate(
            { id: image.id, payload: { title: trimmed, ...(status.uploadId ? { upload_id: status.uploadId } : {}) } },
            {
                onSuccess: onSaved,
                onError: (err) => {
                    const code = errorStatus(err)
                    const fields = serverFieldErrors(err)
                    if (code === 422 && Object.keys(fields).length) return setErrors(fields)
                    if (code === 403 || code === 404 || code === 409) return onBlocked(err)
                    setSubmitError(errorMessage(err) ?? t('form.errors.generic'))
                },
            },
        )
    }

    return (
        <Dialog open onOpenChange={(open) => !mutation.isPending && onOpenChange(open)}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('editImage.title')}</DialogTitle>
                    <DialogDescription>{t('editImage.description')}</DialogDescription>
                </DialogHeader>

                <DepartmentFormField label={t('form.imageTitle')} htmlFor="edit-img-title" error={formErrorText(t, errors.title)}>
                    <Input id="edit-img-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={TITLE_MAX} disabled={mutation.isPending} autoFocus dir="auto" />
                </DepartmentFormField>

                <DepartmentFormField label={t('form.file')} htmlFor="edit-img-file" hint={t('editImage.fileHint')} error={problem ? t(`upload.problem.${problem}`) : formErrorText(t, errors.upload_id)}>
                    <ImageUploadField
                        id="edit-img-file"
                        file={file}
                        previewUrl={previewUrl}
                        currentUrl={image.url}
                        upload={state}
                        onPick={handlePick}
                        disabled={mutation.isPending}
                        invalid={!!errors.upload_id || !!problem}
                    />
                </DepartmentFormField>

                {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>{t('form.cancel')}</Button>
                    <Button onClick={submit} disabled={mutation.isPending || status.uploading}>
                        {(mutation.isPending || status.uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t('form.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default memo(ImageEditDialog)
