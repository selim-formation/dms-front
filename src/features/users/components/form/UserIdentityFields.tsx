import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { USER_EMAIL_MAX, USER_NAME_MAX } from '../../utils/userPayload'

interface UserIdentityFieldsProps {
    name: string
    email: string
    nameError?: string
    emailError?: string
    disabled: boolean
    onNameChange: (value: string) => void
    onEmailChange: (value: string) => void
}

/** Name + email. Email is stored trimmed and lower-cased by the server. */
function UserIdentityFields({ name, email, nameError, emailError, disabled, onNameChange, onEmailChange }: UserIdentityFieldsProps) {
    const { t } = useTranslation('users')

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <DepartmentFormField label={t('form.name')} htmlFor="user-name" error={nameError}>
                <Input
                    id="user-name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder={t('form.namePlaceholder')}
                    maxLength={USER_NAME_MAX}
                    disabled={disabled}
                    autoComplete="off"
                    autoFocus
                    dir="auto"
                />
            </DepartmentFormField>

            <DepartmentFormField label={t('form.email')} htmlFor="user-email" error={emailError}>
                <Input
                    id="user-email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder={t('form.emailPlaceholder')}
                    maxLength={USER_EMAIL_MAX}
                    disabled={disabled}
                    autoComplete="off"
                />
            </DepartmentFormField>
        </div>
    )
}

export default memo(UserIdentityFields)
