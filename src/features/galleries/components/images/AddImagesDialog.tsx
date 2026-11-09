import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import ImageDraftList from './ImageDraftList'
import { useImageDrafts } from '../../hooks/useImageDrafts'
import { useAddImages } from '../../hooks/useImageMutations'
import { serverFieldErrors, toImageInputs, validateImages, type FormErrors } from '../../utils/galleryForm'

interface AddImagesDialogProps {
    galleryId: number
    onOpenChange: (open: boolean) => void
    onSaved: (count: number) => void
    /** 403 / 404 / 409: the dialog can't help; the page explains and refreshes. */
    onBlocked: (err: unknown) => void
}

/** 1–20 pictures, all or nothing; a refused one is highlighted by its `images.N.upload_id` error. */
function AddImagesDialog({ galleryId, onOpenChange, onSaved, onBlocked }: AddImagesDialogProps) {
    const { t } = useTranslation('galleries')
    const { drafts, add, remove, patch } = useImageDrafts([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const mutation = useAddImages()
    const uploading = drafts.some((d) => d.uploading)

    const handlePatch = useCallback(
        (key: string, p: Parameters<typeof patch>[1]) => {
            patch(key, p)
            setErrors((prev) => (Object.keys(prev).length ? {} : prev))
        },
        [patch],
    )

    const submit = () => {
        setSubmitError(null)
        const errs = drafts.length ? validateImages(drafts) : { images: 'imagesRequired' }
        setErrors(errs)
        if (Object.keys(errs).length) return

        mutation.mutate(
            { gallery_id: galleryId, images: toImageInputs(drafts) },
            {
                onSuccess: (created) => onSaved(created.length),
                onError: (err) => {
                    const status = errorStatus(err)
                    const fields = serverFieldErrors(err)
                    if (status === 422 && Object.keys(fields).length) return setErrors(fields)
                    if (status === 403 || status === 404 || status === 409) return onBlocked(err)
                    setSubmitError(errorMessage(err) ?? t('form.errors.generic'))
                },
            },
        )
    }

    return (
        <Dialog open onOpenChange={(open) => !mutation.isPending && onOpenChange(open)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('addImages.title')}</DialogTitle>
                    <DialogDescription>{t('addImages.description')}</DialogDescription>
                </DialogHeader>

                <ImageDraftList drafts={drafts} errors={errors} onAdd={add} onPatch={handlePatch} onRemove={remove} disabled={mutation.isPending} />
                {errors.images && <p className="text-sm text-destructive">{t(`form.errors.${errors.images}`)}</p>}
                {errors.gallery_id && <p className="text-sm text-destructive">{errors.gallery_id}</p>}
                {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>{t('form.cancel')}</Button>
                    <Button onClick={submit} disabled={mutation.isPending || uploading}>
                        {mutation.isPending || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {uploading ? t('form.uploadingFiles') : t('addImages.submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default memo(AddImagesDialog)
