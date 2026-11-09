import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { formErrorText } from './formErrorText'
import { DESCRIPTION_MAX, TITLE_MAX, type FormErrors, type TaskFormValues } from '../../utils/taskForm'

interface TaskBasicsStepProps {
    values: Pick<TaskFormValues, 'title' | 'description'>
    errors: FormErrors
    onChange: <F extends 'title' | 'description'>(field: F, value: TaskFormValues[F]) => void
    disabled?: boolean
}

/** Step 1: title and description. */
function TaskBasicsStep({ values, errors, onChange, disabled }: TaskBasicsStepProps) {
    const { t } = useTranslation('taskManagement')

    return (
        <div className="space-y-5">
            <DepartmentFormField label={t('form.title')} htmlFor="task-title" error={formErrorText(t, errors.title)}>
                <Input
                    id="task-title"
                    value={values.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder={t('form.titlePlaceholder')}
                    maxLength={TITLE_MAX}
                    disabled={disabled}
                    autoFocus
                    dir="auto"
                />
            </DepartmentFormField>

            <DepartmentFormField
                label={t('form.description')}
                htmlFor="task-description"
                hint={t('form.descriptionHint', { count: values.description.length, max: DESCRIPTION_MAX })}
                error={formErrorText(t, errors.description)}
            >
                <textarea
                    id="task-description"
                    value={values.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                    maxLength={DESCRIPTION_MAX}
                    rows={5}
                    disabled={disabled}
                    dir="auto"
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />
            </DepartmentFormField>
        </div>
    )
}

export default memo(TaskBasicsStep)
