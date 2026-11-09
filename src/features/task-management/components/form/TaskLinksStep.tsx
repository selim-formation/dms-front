import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import ReferenceSelect, { type SelectOption } from '@/features/document-management/components/form/ReferenceSelect'
import { toPickerOptions } from '@/features/document-management/components/form/pickerOptions'
import { useDocumentVersions } from '@/features/document-management/hooks/useDocumentVersions'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'
import { useUsers } from '@/core/reference-data/hooks/useUsers'
import DocumentPicker from './DocumentPicker'
import { formErrorText } from './formErrorText'
import type { FormErrors, TaskFormValues } from '../../utils/taskForm'

type LinkField = 'assignee_id' | 'department_id' | 'document_id' | 'document_version_id'

interface TaskLinksStepProps {
    values: Pick<TaskFormValues, LinkField | 'document_label'>
    errors: FormErrors
    onChange: <F extends LinkField>(field: F, value: TaskFormValues[F]) => void
    /** Changing the document must reset the version in one update. */
    onDocumentChange: (id: number | null, title: string | null) => void
    /** Edit: the current version, so the select shows it before (or without) the version list loading. */
    versionFallback?: { id: number; version: number } | null
    disabled?: boolean
}

/** Step 3: assignee, department, document and its version (options load from the chosen document). */
function TaskLinksStep({ values, errors, onChange, onDocumentChange, versionFallback, disabled }: TaskLinksStepProps) {
    const { t } = useTranslation('taskManagement')
    const { users, isLoading: usersLoading } = useUsers()
    const { departments, isLoading: departmentsLoading } = useDepartments()
    const { versions, isLoading: versionsLoading } = useDocumentVersions(values.document_id ?? 0, values.document_id !== null)

    const userOptions = useMemo<SelectOption[]>(() => users.map((u) => ({ id: u.id, name: u.name })).sort((a, b) => a.name.localeCompare(b.name)), [users])
    const departmentOptions = useMemo<SelectOption[]>(() => toPickerOptions(departments), [departments])
    const versionOptions = useMemo<SelectOption[]>(() => {
        const list = versions.map((v) => ({ id: v.id, name: `v${v.version}` }))
        if (versionFallback && !list.some((o) => o.id === versionFallback.id)) list.unshift({ id: versionFallback.id, name: `v${versionFallback.version}` })
        return list
    }, [versions, versionFallback])

    const handleAssignee = useCallback((v: number | null) => onChange('assignee_id', v), [onChange])
    const handleDepartment = useCallback((v: number | null) => onChange('department_id', v), [onChange])
    const handleVersion = useCallback((v: number | null) => onChange('document_version_id', v), [onChange])

    return (
        <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <DepartmentFormField label={t('form.assignee')} htmlFor="task-assignee" error={formErrorText(t, errors.assignee_id)}>
                    <ReferenceSelect
                        id="task-assignee"
                        value={values.assignee_id}
                        options={userOptions}
                        onChange={handleAssignee}
                        placeholder={t('form.none')}
                        invalid={!!errors.assignee_id}
                        isLoading={usersLoading}
                        disabled={disabled}
                    />
                </DepartmentFormField>
                <DepartmentFormField label={t('form.department')} htmlFor="task-department" error={formErrorText(t, errors.department_id)}>
                    <ReferenceSelect
                        id="task-department"
                        value={values.department_id}
                        options={departmentOptions}
                        onChange={handleDepartment}
                        placeholder={t('form.none')}
                        invalid={!!errors.department_id}
                        isLoading={departmentsLoading}
                        disabled={disabled}
                    />
                </DepartmentFormField>
            </div>

            <DepartmentFormField label={t('form.document')} htmlFor="task-document" error={formErrorText(t, errors.document_id)}>
                <DocumentPicker
                    id="task-document"
                    value={values.document_id}
                    label={values.document_label}
                    onChange={onDocumentChange}
                    invalid={!!errors.document_id}
                    disabled={disabled}
                />
            </DepartmentFormField>

            {values.document_id !== null && (
                <DepartmentFormField label={t('form.version')} htmlFor="task-version" hint={t('form.versionHint')} error={formErrorText(t, errors.document_version_id)}>
                    <ReferenceSelect
                        id="task-version"
                        value={values.document_version_id}
                        options={versionOptions}
                        onChange={handleVersion}
                        placeholder={t('form.none')}
                        invalid={!!errors.document_version_id}
                        isLoading={versionsLoading && versionOptions.length === 0}
                        disabled={disabled}
                    />
                </DepartmentFormField>
            )}
        </div>
    )
}

export default memo(TaskLinksStep)
