import { useCallback, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import FormStepper, { type StepperItem } from '@/features/document-management/components/form/FormStepper'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import GalleryDetailsStep from './GalleryDetailsStep'
import ImageDraftList from '../images/ImageDraftList'
import { useImageDrafts } from '../../hooks/useImageDrafts'
import { useCreateGallery, useUpdateGallery } from '../../hooks/useSaveGallery'
import {
    EMPTY_VALUES,
    buildGalleryPayload,
    serverFieldErrors,
    stepOfErrors,
    validateDetails,
    validateImages,
    valuesFromGallery,
    type FormErrors,
    type FormStep,
    type GalleryFormValues,
} from '../../utils/galleryForm'
import type { Gallery } from '../../types/gallery.types'

interface GalleryFormDialogProps {
    /** Present in edit mode. */
    gallery?: Gallery
    /** Create wizard gets the pictures step only when the user may add images and upload files. */
    canAddImages: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (gallery: Gallery, mode: 'create' | 'edit') => void
    /** 403 / 404 / 409 while saving: the page shows the notice and closes the form. */
    onBlocked: (err: unknown) => void
}

function valuesReducer(state: GalleryFormValues, a: { field: keyof GalleryFormValues; value: string }): GalleryFormValues {
    return { ...state, [a.field]: a.value }
}

/** Create (details → pictures) / edit (details only) in a dialog; mounted only while open, so state is always fresh. */
export default function GalleryFormDialog({ gallery, canAddImages, onOpenChange, onSaved, onBlocked }: GalleryFormDialogProps) {
    const { t } = useTranslation('galleries')
    const isEdit = !!gallery
    const steps = useMemo<FormStep[]>(() => (isEdit || !canAddImages ? ['details'] : ['details', 'images']), [isEdit, canAddImages])

    const [values, dispatchValue] = useReducer(valuesReducer, gallery ? valuesFromGallery(gallery) : EMPTY_VALUES)
    const images = useImageDrafts()
    const [current, setCurrent] = useState(0)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const create = useCreateGallery()
    const update = useUpdateGallery()
    const isPending = create.isPending || update.isPending
    const uploading = images.drafts.some((d) => d.uploading)

    const stepperItems = useMemo<StepperItem[]>(() => steps.map((key) => ({ key, label: t(`form.steps.${key}`) })), [steps, t])

    const handleChange = useCallback(<F extends keyof GalleryFormValues>(field: F, value: GalleryFormValues[F]) => {
        dispatchValue({ field, value: value as string })
        setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))
    }, [])
    // Editing a row clears its server error (and any stale image-level error) so the user can resubmit.
    const { patch } = images
    const handlePatch = useCallback(
        (key: string, p: Parameters<typeof patch>[1]) => {
            patch(key, p)
            setErrors((prev) => (Object.keys(prev).some((k) => k.startsWith('images.')) ? Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith('images.'))) : prev))
        },
        [patch],
    )

    const validate = (step: FormStep): FormErrors => (step === 'details' ? validateDetails(values) : validateImages(images.drafts))

    const goNext = () => {
        const errs = validate(steps[current])
        setErrors(errs)
        if (Object.keys(errs).length === 0) setCurrent((c) => c + 1)
    }
    const goBack = () => setCurrent((c) => Math.max(0, c - 1))
    const handleSelectStep = useCallback((i: number) => setCurrent(i), [])

    const submit = () => {
        setSubmitError(null)
        for (let i = 0; i < steps.length; i++) {
            const errs = validate(steps[i])
            if (Object.keys(errs).length) {
                setErrors(errs)
                setCurrent(i)
                return
            }
        }
        setErrors({})

        const onSuccess = (saved: Gallery) => onSaved(saved, isEdit ? 'edit' : 'create')
        const onError = (err: unknown) => {
            const status = errorStatus(err)
            const fields = serverFieldErrors(err)
            if (status === 422 && Object.keys(fields).length) {
                setErrors(fields)
                const step = stepOfErrors(fields, steps)
                if (step) setCurrent(steps.indexOf(step))
                return
            }
            if (status === 403 || status === 404 || status === 409) return onBlocked(err)
            setSubmitError(errorMessage(err) ?? t('form.errors.generic'))
        }

        if (gallery) update.mutate({ id: gallery.id, payload: buildGalleryPayload(values) }, { onSuccess, onError })
        else create.mutate(buildGalleryPayload(values, images.drafts), { onSuccess, onError })
    }

    const last = current === steps.length - 1
    const step = steps[current]

    return (
        <Dialog open onOpenChange={(open) => !isPending && onOpenChange(open)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t(isEdit ? 'form.editTitle' : 'form.createTitle')}</DialogTitle>
                    <DialogDescription>{t(isEdit ? 'form.editSubtitle' : 'form.createSubtitle')}</DialogDescription>
                </DialogHeader>

                {steps.length > 1 && <FormStepper steps={stepperItems} current={current} onSelect={handleSelectStep} label={t('form.stepsLabel')} />}

                <section aria-label={t(`form.steps.${step}`)} className="min-h-56">
                    {step === 'details' && <GalleryDetailsStep values={values} errors={errors} onChange={handleChange} disabled={isPending} />}
                    {step === 'images' && (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{t('form.imagesHint')}</p>
                            <ImageDraftList drafts={images.drafts} errors={errors} onAdd={images.add} onPatch={handlePatch} onRemove={images.remove} disabled={isPending} />
                        </div>
                    )}
                </section>

                {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>{t('form.cancel')}</Button>
                    <div className="flex items-center gap-2">
                        {current > 0 && (
                            <Button type="button" variant="outline" onClick={goBack} disabled={isPending}>
                                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                                {t('form.back')}
                            </Button>
                        )}
                        {last ? (
                            <Button type="button" onClick={submit} disabled={isPending || uploading}>
                                {isPending || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {uploading ? t('form.uploadingFiles') : t(isEdit ? 'form.save' : 'form.create')}
                            </Button>
                        ) : (
                            <Button type="button" onClick={goNext}>
                                {t('form.next')}
                                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
