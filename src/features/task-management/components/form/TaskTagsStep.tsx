import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import TagsInput from './TagsInput'
import { formErrorText } from './formErrorText'
import { TAGS_MAX, TAG_MAX, type FormErrors } from '../../utils/taskForm'

interface TaskTagsStepProps {
    tags: string[]
    errors: FormErrors
    onChange: (tags: string[]) => void
    disabled?: boolean
}

/** Step 4: tags (up to 20, 50 characters each, no duplicates). */
function TaskTagsStep({ tags, errors, onChange, disabled }: TaskTagsStepProps) {
    const { t } = useTranslation('taskManagement')
    return (
        <DepartmentFormField label={t('form.tags')} htmlFor="task-tags" hint={t('form.tagsHint', { max: TAGS_MAX })} error={formErrorText(t, errors.tags)}>
            <TagsInput
                id="task-tags"
                tags={tags}
                onChange={onChange}
                max={TAGS_MAX}
                maxLength={TAG_MAX}
                placeholder={t('form.tagsPlaceholder')}
                disabled={disabled}
            />
        </DepartmentFormField>
    )
}

export default memo(TaskTagsStep)
