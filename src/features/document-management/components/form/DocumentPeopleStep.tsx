import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { UserCheck, Users } from 'lucide-react'
import FormSection from './FormSection'
import SectionField from './SectionField'
import ImportReferencePicker from '@/features/document-imports/components/ImportReferencePicker'
import PickerField from './PickerField'
import ReferenceSelect, { type SelectOption } from './ReferenceSelect'
import { formErrorText } from './formErrorText'
import { useDepartmentUsers } from '../../hooks/useDepartmentUsers'
import type { DocumentFormValues, FormErrors } from '../../utils/documentForm'
import type { PersonRef } from '../../types/management.types'

interface DocumentPeopleStepProps {
    values: Pick<DocumentFormValues, 'departments' | 'responsible' | 'cc'>
    errors: FormErrors
    onScalar: (field: 'responsible', value: number | null) => void
    onIds: (field: string, ids: number[]) => void
    /** Edit: the current responsible, so the select still shows them before the users load. */
    responsibleFallback?: PersonRef | null
    disabled?: boolean
}

/** Step 3: responsible (works in a chosen department) and cc (managers / heads of them). */
function DocumentPeopleStep({ values, errors, onScalar, onIds, responsibleFallback, disabled }: DocumentPeopleStepProps) {
    const { t } = useTranslation('management')
    const { users, leaders, isLoading, isError } = useDepartmentUsers(values.departments)

    const responsibleOptions = useMemo<SelectOption[]>(() => {
        const list = users.map((u) => ({ id: u.id, name: u.name }))
        if (responsibleFallback && !list.some((o) => o.id === responsibleFallback.id)) list.unshift(responsibleFallback)
        return list.sort((a, b) => a.name.localeCompare(b.name))
    }, [users, responsibleFallback])
    const ccOptions = useMemo(() => leaders.map((u) => ({ id: u.id, name: u.name })).sort((a, b) => a.name.localeCompare(b.name)), [leaders])

    const handleResponsible = useCallback((v: number | null) => onScalar('responsible', v), [onScalar])

    return (
        <div className="space-y-6">
            {isError && <p className="text-sm text-destructive">{t('form.usersError')}</p>}

            <FormSection icon={Users} title={t('form.cards.peopleStep.title')} subtitle={t('form.cards.peopleStep.subtitle')}>
                <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                    <SectionField
                        label={t('form.responsible')}
                        htmlFor="doc-responsible"
                        required
                        hint={t('form.responsibleHint')}
                        icon={UserCheck}
                        error={formErrorText(t, errors.responsible)}
                    >
                        <ReferenceSelect
                            id="doc-responsible"
                            value={values.responsible}
                            options={responsibleOptions}
                            onChange={handleResponsible}
                            placeholder={t('form.choose')}
                            invalid={!!errors.responsible}
                            isLoading={isLoading}
                            disabled={disabled}
                        />
                    </SectionField>

                    <PickerField hint={t('form.ccHint')} error={formErrorText(t, errors.cc)}>
                        <ImportReferencePicker
                            field="cc"
                            label={t('form.cc')}
                            options={ccOptions}
                            selectedIds={values.cc}
                            onChange={onIds}
                            isLoading={isLoading}
                            disabled={disabled}
                        />
                    </PickerField>
                </div>
            </FormSection>
        </div>
    )
}

export default memo(DocumentPeopleStep)
