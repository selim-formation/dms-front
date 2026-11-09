import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { storageErrorText } from './storageErrorText'

interface ExpiryFieldProps {
    id: string
    value: string
    error?: string
    onChange: (value: string) => void
    disabled?: boolean
}

/** Optional "credentials stop working on" date (must be in the future). */
function ExpiryField({ id, value, error, onChange, disabled }: ExpiryFieldProps) {
    const { t } = useTranslation('storage')
    return (
        <DepartmentFormField label={t('fields.credentials_expires_at')} htmlFor={id} hint={t('fieldHints.credentials_expires_at')} error={storageErrorText(t, error)}>
            <Input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
        </DepartmentFormField>
    )
}

export default memo(ExpiryField)
