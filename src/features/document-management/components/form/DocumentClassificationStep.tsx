import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartments } from '@/core/reference-data/hooks/useDepartments'
import { useSections } from '@/core/reference-data/hooks/useSections'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import PickerField from './PickerField'
import ReferenceSelect from './ReferenceSelect'
import { DepartmentsPicker, EntitiesPicker, SectionsPicker, TypesPicker } from './DocumentLookupPickers'
import { toPickerOptions } from './pickerOptions'
import { formErrorText } from './formErrorText'
import type { DocumentFormValues, FormErrors } from '../../utils/documentForm'

interface DocumentClassificationStepProps {
    values: Pick<DocumentFormValues, 'origin_department_id' | 'types' | 'departments' | 'sections' | 'entities'>
    errors: FormErrors
    onScalar: (field: 'origin_department_id', value: number | null) => void
    onIds: (field: string, ids: number[]) => void
    isEdit: boolean
    disabled?: boolean
}

/** Step 2: origin department, types, departments, sections (of the chosen departments), entities. */
function DocumentClassificationStep({ values, errors, onScalar, onIds, isEdit, disabled }: DocumentClassificationStepProps) {
    const { t } = useTranslation('management')
    const { departments, isLoading } = useDepartments()
    const { sections } = useSections()
    const departmentOptions = useMemo(() => toPickerOptions(departments), [departments])

    // Changing departments drops sections that no longer belong to one of them.
    const handleIds = useCallback(
        (field: string, ids: number[]) => {
            onIds(field, ids)
            if (field !== 'departments') return
            const withDept = sections as { id: number; department_id?: number | null }[]
            if (!withDept.some((s) => s.department_id != null)) return
            const allowed = new Set(ids)
            const valid = new Set(withDept.filter((s) => s.department_id != null && allowed.has(s.department_id)).map((s) => s.id))
            const kept = values.sections.filter((id) => valid.has(id))
            if (kept.length !== values.sections.length) onIds('sections', kept)
        },
        [onIds, sections, values.sections],
    )
    const handleOrigin = useCallback((v: number | null) => onScalar('origin_department_id', v), [onScalar])

    return (
        <div className="space-y-6">
            {isEdit && (
                <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400" role="note">
                    {t('form.editReselect')}
                </p>
            )}

            <DepartmentFormField label={t('form.origin')} htmlFor="doc-origin" error={formErrorText(t, errors.origin_department_id)}>
                <ReferenceSelect
                    id="doc-origin"
                    value={values.origin_department_id}
                    options={departmentOptions}
                    onChange={handleOrigin}
                    placeholder={t('form.none')}
                    isLoading={isLoading}
                    disabled={disabled}
                />
            </DepartmentFormField>

            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                <PickerField error={formErrorText(t, errors.types)}>
                    <TypesPicker selectedIds={values.types} onChange={onIds} disabled={disabled} />
                </PickerField>
                <PickerField error={formErrorText(t, errors.entities)}>
                    <EntitiesPicker selectedIds={values.entities} onChange={onIds} disabled={disabled} />
                </PickerField>
                <PickerField hint={t('form.departmentsHint')} error={formErrorText(t, errors.departments)}>
                    <DepartmentsPicker selectedIds={values.departments} onChange={handleIds} disabled={disabled} />
                </PickerField>
                <PickerField hint={t('form.sectionsHint')} error={formErrorText(t, errors.sections)}>
                    <SectionsPicker
                        selectedIds={values.sections}
                        departmentIds={values.departments}
                        onChange={onIds}
                        disabled={disabled || values.departments.length === 0}
                    />
                </PickerField>
            </div>
        </div>
    )
}

export default memo(DocumentClassificationStep)
