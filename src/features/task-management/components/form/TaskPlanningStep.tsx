import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { formErrorText } from './formErrorText'
import { PRIORITIES, TASK_TYPES } from '../../utils/taskPayload'
import { DUE_DATE_MAX, DUE_DATE_MIN, type FormErrors, type TaskFormValues } from '../../utils/taskForm'

type PlanningField = 'priority' | 'task_type' | 'due_date'

interface TaskPlanningStepProps {
    values: Pick<TaskFormValues, PlanningField>
    errors: FormErrors
    onChange: <F extends PlanningField>(field: F, value: TaskFormValues[F]) => void
    disabled?: boolean
}

/** Step 2: priority, type and due date. */
function TaskPlanningStep({ values, errors, onChange, disabled }: TaskPlanningStepProps) {
    const { t } = useTranslation('taskManagement')

    const priorityOptions = useMemo(() => PRIORITIES.map((v) => ({ value: v, label: t(`priority.${v}`) })), [t])
    const typeOptions = useMemo(
        () => [{ value: '' as const, label: t('form.choose') }, ...TASK_TYPES.map((v) => ({ value: v, label: t(`type.${v}`) }))],
        [t],
    )

    return (
        <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <DepartmentFormField label={t('form.priority')} error={formErrorText(t, errors.priority)}>
                    <DepartmentFilterSelect
                        label={t('form.priority')}
                        value={values.priority}
                        options={priorityOptions}
                        onChange={(v) => onChange('priority', v)}
                    />
                </DepartmentFormField>
                <DepartmentFormField label={t('form.type')} error={formErrorText(t, errors.task_type)}>
                    <DepartmentFilterSelect
                        label={t('form.type')}
                        value={values.task_type}
                        options={typeOptions}
                        onChange={(v) => onChange('task_type', v)}
                    />
                </DepartmentFormField>
            </div>

            <DepartmentFormField label={t('form.dueDate')} htmlFor="task-due" hint={t('form.dueDateHint')} error={formErrorText(t, errors.due_date)}>
                <Input
                    id="task-due"
                    type="date"
                    value={values.due_date}
                    min={DUE_DATE_MIN}
                    max={DUE_DATE_MAX}
                    onChange={(e) => onChange('due_date', e.target.value)}
                    disabled={disabled}
                    className="sm:max-w-56"
                />
            </DepartmentFormField>
        </div>
    )
}

export default memo(TaskPlanningStep)
