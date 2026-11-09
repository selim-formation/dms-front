import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { formErrorText } from './formErrorText'
import {
    REMINDER_MAX,
    REMINDER_MIN,
    VERSION_DESCRIPTION_MAX,
    type VersionMetaField,
    type VersionMetaValues,
} from '../../utils/versionFields'

interface VersionMetaFieldsProps {
    /** Unique per row / dialog so label `for` ids never collide. */
    idPrefix: string
    values: VersionMetaValues
    /** Errors keyed by field name (no row prefix). */
    errors: Record<string, string>
    onChange: (field: VersionMetaField, value: string) => void
}

/** Expiry + reminder, export date, special number and description: shared by the create form and the version dialog. */
function VersionMetaFields({ idPrefix, values, errors, onChange }: VersionMetaFieldsProps) {
    const { t } = useTranslation('management')
    const handle = (field: VersionMetaField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange(field, e.target.value)

    return (
        <>
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                <DepartmentFormField label={t('form.expireDate')} htmlFor={`${idPrefix}-exp`} error={formErrorText(t, errors.expire_date)}>
                    <Input id={`${idPrefix}-exp`} type="date" value={values.expire_date} onChange={handle('expire_date')} />
                </DepartmentFormField>
                <DepartmentFormField
                    label={t('form.reminderBefore')}
                    htmlFor={`${idPrefix}-rem`}
                    hint={t('form.reminderHint')}
                    error={formErrorText(t, errors.reminder_before)}
                >
                    <Input
                        id={`${idPrefix}-rem`}
                        type="number"
                        inputMode="numeric"
                        min={REMINDER_MIN}
                        max={REMINDER_MAX}
                        value={values.reminder_before}
                        onChange={handle('reminder_before')}
                    />
                </DepartmentFormField>
                <DepartmentFormField label={t('form.exportDate')} htmlFor={`${idPrefix}-exp2`} error={formErrorText(t, errors.export_date)}>
                    <Input id={`${idPrefix}-exp2`} type="date" value={values.export_date} onChange={handle('export_date')} />
                </DepartmentFormField>
                <DepartmentFormField
                    label={t('form.specialNumber')}
                    htmlFor={`${idPrefix}-num`}
                    error={formErrorText(t, errors.special_document_number)}
                >
                    <Input
                        id={`${idPrefix}-num`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={values.special_document_number}
                        onChange={handle('special_document_number')}
                    />
                </DepartmentFormField>
            </div>

            <DepartmentFormField
                label={t('form.versionDescription')}
                htmlFor={`${idPrefix}-desc`}
                error={formErrorText(t, errors.version_description)}
            >
                <textarea
                    id={`${idPrefix}-desc`}
                    value={values.version_description}
                    onChange={handle('version_description')}
                    maxLength={VERSION_DESCRIPTION_MAX}
                    rows={2}
                    dir="auto"
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />
            </DepartmentFormField>
        </>
    )
}

export default memo(VersionMetaFields)
