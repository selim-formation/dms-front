import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { storageErrorText } from './storageErrorText'
import { fieldsOf, type FieldSection } from '../utils/providerFields'
import type { FormErrors } from '../utils/storagePayload'
import type { StorageProvider } from '../types/storage.types'

interface ProviderFieldsProps {
    provider: StorageProvider
    section: FieldSection
    idPrefix: string
    values: Record<string, string>
    errors: FormErrors
    onChange: (section: FieldSection, key: string, value: string) => void
    disabled?: boolean
}

/**
 * Renders the fields of one provider section from `PROVIDER_FIELDS`. The same
 * component builds the create form, the settings edit and the credentials dialog.
 */
function ProviderFields({ provider, section, idPrefix, values, errors, onChange, disabled }: ProviderFieldsProps) {
    const { t } = useTranslation('storage')
    // A server error on the whole `credentials` object has no single field to sit under.
    const sectionError = section === 'credentials' ? storageErrorText(t, errors.credentials) : undefined

    return (
        <div className="space-y-4">
            {sectionError && <p role="alert" className="text-sm text-destructive">{sectionError}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
                {fieldsOf(provider, section).map((f) => {
                    const id = `${idPrefix}-${f.key}`
                    return (
                        <DepartmentFormField
                            key={f.key}
                            label={t(`fields.${f.key}`)}
                            htmlFor={id}
                            hint={t(`fieldHints.${f.key}`, { defaultValue: '' }) || undefined}
                            error={storageErrorText(t, errors[`${section}.${f.key}`])}
                        >
                            <Input
                                id={id}
                                type={f.secret ? 'password' : 'text'}
                                autoComplete={f.secret ? 'new-password' : 'off'}
                                spellCheck={false}
                                value={values[f.key] ?? ''}
                                onChange={(e) => onChange(section, f.key, e.target.value)}
                                maxLength={f.max ?? 255}
                                disabled={disabled}
                                dir={f.secret ? 'ltr' : 'auto'}
                            />
                        </DepartmentFormField>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(ProviderFields)
