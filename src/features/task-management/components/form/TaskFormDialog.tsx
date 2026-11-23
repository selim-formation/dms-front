import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import FormStepper, { type StepperItem } from '@/features/document-management/components/form/FormStepper'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import TaskBasicsStep from './TaskBasicsStep'
import TaskPlanningStep from './TaskPlanningStep'
import TaskLinksStep from './TaskLinksStep'
import TaskTagsStep from './TaskTagsStep'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useCreateTask, useUpdateTask } from '../../hooks/useSaveTask'
import {
    EMPTY_VALUES,
    FORM_STEPS,
    buildTaskPayload,
    serverFieldErrors,
    stepOfErrors,
    validateStep,
    valuesFromTask,
    type FormErrors,
    type TaskFormValues,
} from '../../utils/taskForm'
import type { Task } from '../../types/task.types'

interface TaskFormDialogProps {
    /** Present in edit mode. */
    task?: Task
    onOpenChange: (open: boolean) => void
    onSaved: (task: Task, mode: 'create' | 'edit') => void
    /** 403 / 404 / 409 while saving: the page shows the notice and closes the form. */
    onBlocked: (err: unknown) => void
}

/**
 * Create / edit wizard in a dialog. Mounted only while open (keyed by task), so its state
 * always starts fresh; each step is a memoised component fed by stable setters.
 */
export default function TaskFormDialog({ task, onOpenChange, onSaved, onBlocked }: TaskFormDialogProps) {
    const { t } = useTranslation('taskManagement')
    const isEdit = !!task

    const { values, setScalar, patch } = useTaskForm(task ? valuesFromTask(task) : EMPTY_VALUES)
    const [current, setCurrent] = useState(0)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const create = useCreateTask()
    const update = useUpdateTask()
    const isPending = create.isPending || update.isPending

    const stepperItems = useMemo<StepperItem[]>(() => FORM_STEPS.map((key) => ({ key, label: t(`form.steps.${key}`) })), [t])

    // Setters clear the error of the field being edited, keeping the step components dumb.
    const clearError = useCallback((field: string) => setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev)), [])
    const handleScalar = useCallback(
        <F extends keyof TaskFormValues>(field: F, value: TaskFormValues[F]) => {
            setScalar(field, value)
            clearError(field)
        },
        [setScalar, clearError],
    )
    const handleTags = useCallback((tags: string[]) => handleScalar('tags', tags), [handleScalar])
    const handleDocument = useCallback(
        (id: number | null, title: string | null) => {
            patch({ document_id: id, document_label: title, document_version_id: null })
            setErrors((prev) => ({ ...prev, document_id: '', document_version_id: '' }))
        },
        [patch],
    )

    const goNext = () => {
        const errs = validateStep(FORM_STEPS[current], values)
        setErrors(errs)
        if (Object.keys(errs).length === 0) setCurrent((c) => c + 1)
    }
    const goBack = () => setCurrent((c) => Math.max(0, c - 1))
    const handleSelectStep = useCallback((i: number) => setCurrent(i), [])

    const submit = () => {
        setSubmitError(null)
        for (let i = 0; i < FORM_STEPS.length; i++) {
            const errs = validateStep(FORM_STEPS[i], values)
            if (Object.keys(errs).length) {
                setErrors(errs)
                setCurrent(i)
                return
            }
        }
        setErrors({})

        const payload = buildTaskPayload(values, isEdit)
        const onSuccess = (saved: Task) => onSaved(saved, isEdit ? 'edit' : 'create')
        const onError = (err: unknown) => {
            const fields = serverFieldErrors(err)
            if (errorStatus(err) === 422 && Object.keys(fields).length) {
                setErrors(fields)
                const step = stepOfErrors(fields)
                if (step) setCurrent(FORM_STEPS.indexOf(step))
                return
            }
            const status = errorStatus(err)
            if (status === 403 || status === 404 || status === 409) return onBlocked(err)
            setSubmitError(errorMessage(err) ?? t('form.errors.generic'))
        }

        if (task) update.mutate({ id: task.id, payload }, { onSuccess, onError })
        else create.mutate(payload, { onSuccess, onError })
    }

    const last = current === FORM_STEPS.length - 1
    const step = FORM_STEPS[current]

    return (
        <Dialog open onOpenChange={(open: boolean) => !isPending && onOpenChange(open)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t(isEdit ? 'form.editTitle' : 'form.createTitle')}</DialogTitle>
                    <DialogDescription>{t(isEdit ? 'form.editSubtitle' : 'form.createSubtitle')}</DialogDescription>
                </DialogHeader>

                <FormStepper steps={stepperItems} current={current} onSelect={handleSelectStep} label={t('form.stepsLabel')} />

                <section aria-label={t(`form.steps.${step}`)} className="min-h-56">
                    {step === 'basics' && <TaskBasicsStep values={values} errors={errors} onChange={handleScalar} disabled={isPending} />}
                    {step === 'planning' && <TaskPlanningStep values={values} errors={errors} onChange={handleScalar} disabled={isPending} />}
                    {step === 'links' && (
                        <TaskLinksStep
                            values={values}
                            errors={errors}
                            onChange={handleScalar}
                            onDocumentChange={handleDocument}
                            versionFallback={task?.document_version}
                            disabled={isPending}
                        />
                    )}
                    {step === 'tags' && <TaskTagsStep tags={values.tags} errors={errors} onChange={handleTags} disabled={isPending} />}
                </section>

                {isEdit && last && <p className="text-sm text-muted-foreground">{t('form.editReplaceHint')}</p>}
                {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('form.cancel')}
                    </Button>
                    <div className="flex items-center gap-2">
                        {current > 0 && (
                            <Button type="button" variant="outline" onClick={goBack} disabled={isPending}>
                                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                                {t('form.back')}
                            </Button>
                        )}
                        {last ? (
                            <Button type="button" onClick={submit} disabled={isPending}>
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t(isEdit ? 'form.save' : 'form.create')}
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
