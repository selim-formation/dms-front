import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import FormStepper, { type StepperItem } from './FormStepper'
import DocumentDetailsStep from './DocumentDetailsStep'
import DocumentClassificationStep from './DocumentClassificationStep'
import DocumentPeopleStep from './DocumentPeopleStep'
import DocumentVersionsStep from './DocumentVersionsStep'
import { useDocumentForm } from '../../hooks/useDocumentForm'
import { useCreateDocument, useUpdateDocument } from '../../hooks/useSaveDocument'
import {
    buildCreatePayload,
    buildDocumentPayload,
    serverFieldErrors,
    stepOfErrors,
    validateStep,
    type DocumentFormValues,
    type FormErrors,
    type FormStep,
} from '../../utils/documentForm'
import type { PersonRef } from '../../types/management.types'

interface DocumentFormViewProps {
    initial: DocumentFormValues
    /** Present in edit mode. */
    documentId?: number
    responsibleFallback?: PersonRef | null
}

const CREATE_STEPS: FormStep[] = ['details', 'classification', 'people', 'versions']
const EDIT_STEPS: FormStep[] = ['details', 'classification', 'people'] // versions: phase 3

/**
 * Create / edit wizard. Each step is a memoised component fed by stable setters;
 * errors are local codes or server sentences, and a 422 jumps to the step that owns the field.
 */
export default function DocumentFormView({ initial, documentId, responsibleFallback }: DocumentFormViewProps) {
    const { t } = useTranslation('management')
    const navigate = useNavigate()
    const tenant = useTenantId() ?? ''
    const isEdit = documentId !== undefined
    const steps = isEdit ? EDIT_STEPS : CREATE_STEPS

    const { values, setScalar, setIds, addVersion, removeVersion, patchVersion } = useDocumentForm(initial)
    const [current, setCurrent] = useState(0)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const create = useCreateDocument()
    const update = useUpdateDocument()
    const isPending = create.isPending || update.isPending
    const uploading = values.versions.some((v) => v.uploading)

    const stepperItems = useMemo<StepperItem[]>(() => steps.map((key) => ({ key, label: t(`form.steps.${key}`) })), [steps, t])

    // Setters clear the error of the field being edited, keeping the step components dumb.
    const clearError = useCallback((field: string) => setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev)), [])
    const handleScalar = useCallback(
        <F extends Parameters<typeof setScalar>[0]>(field: F, value: DocumentFormValues[F]) => {
            setScalar(field, value)
            clearError(field)
        },
        [setScalar, clearError],
    )
    const handleIds = useCallback(
        (field: string, ids: number[]) => {
            setIds(field, ids)
            clearError(field)
        },
        [setIds, clearError],
    )
    const handlePatchVersion = useCallback(
        (key: string, patch: Parameters<typeof patchVersion>[1]) => {
            patchVersion(key, patch)
            setErrors((prev) => (Object.keys(prev).some((k) => k.startsWith('versions')) ? Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith('versions'))) : prev))
        },
        [patchVersion],
    )

    const goNext = () => {
        const errs = validateStep(steps[current], values)
        setErrors(errs)
        if (Object.keys(errs).length === 0) setCurrent((c) => c + 1)
    }
    const goBack = () => setCurrent((c) => Math.max(0, c - 1))
    const handleSelectStep = useCallback((i: number) => setCurrent(i), [])

    const submit = () => {
        setSubmitError(null)
        for (let i = 0; i < steps.length; i++) {
            const errs = validateStep(steps[i], values)
            if (Object.keys(errs).length) {
                setErrors(errs)
                setCurrent(i)
                return
            }
        }
        setErrors({})

        const onSuccess = (saved: { id: number }) => navigate({ to: '/$tenant/document-management', params: { tenant }, search: { view: saved.id } })
        const onError = (err: unknown) => {
            const fields = serverFieldErrors(err)
            if (Object.keys(fields).length) {
                setErrors(fields)
                const step = stepOfErrors(fields, steps)
                if (step) setCurrent(steps.indexOf(step))
                return
            }
            const status = errorStatus(err)
            setSubmitError(status === 403 ? t('form.errors.forbidden') : (errorMessage(err) ?? t('form.errors.generic')))
        }

        if (isEdit) update.mutate({ id: documentId, payload: buildDocumentPayload(values) }, { onSuccess, onError })
        else create.mutate(buildCreatePayload(values), { onSuccess, onError })
    }

    const last = current === steps.length - 1
    const step = steps[current]

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <FormStepper steps={stepperItems} current={current} onSelect={handleSelectStep} label={t('form.stepsLabel')} />

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6" aria-label={t(`form.steps.${step}`)}>
                {step === 'details' && (
                    <DocumentDetailsStep values={values} errors={errors} onChange={handleScalar} disabled={isPending} />
                )}
                {step === 'classification' && (
                    <DocumentClassificationStep
                        values={values}
                        errors={errors}
                        onScalar={handleScalar}
                        onIds={handleIds}
                        isEdit={isEdit}
                        disabled={isPending}
                    />
                )}
                {step === 'people' && (
                    <DocumentPeopleStep
                        values={values}
                        errors={errors}
                        onScalar={handleScalar}
                        onIds={handleIds}
                        responsibleFallback={responsibleFallback}
                        isEdit={isEdit}
                        disabled={isPending}
                    />
                )}
                {step === 'versions' && (
                    <DocumentVersionsStep
                        versions={values.versions}
                        errors={errors}
                        onAdd={addVersion}
                        onPatch={handlePatchVersion}
                        onRemove={removeVersion}
                        disabled={isPending}
                    />
                )}
            </section>

            {isEdit && last && <p className="text-sm text-muted-foreground">{t('form.editResubmitHint')}</p>}
            {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate({ to: '/$tenant/document-management', params: { tenant } })}
                    disabled={isPending}
                >
                    {t('form.cancel')}
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
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
        </div>
    )
}
