import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import PasswordInput from './PasswordInput'
import { USER_PASSWORD_MAX } from '../../utils/userPayload'

interface UserPasswordFieldsProps {
    isEdit: boolean
    /** Editing yourself: changing the password also needs the current one. */
    isSelf: boolean
    password: string
    currentPassword: string
    passwordError?: string
    currentPasswordError?: string
    disabled: boolean
    onPasswordChange: (value: string) => void
    onCurrentPasswordChange: (value: string) => void
}

/** Required on create; optional on edit (empty = unchanged). */
function UserPasswordFields(p: UserPasswordFieldsProps) {
    const { t } = useTranslation('users')
    const needsCurrent = p.isEdit && p.isSelf && p.password.length > 0
    const labels = { showLabel: t('form.showPassword'), hideLabel: t('form.hidePassword') }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {p.isEdit && p.isSelf && (
                <DepartmentFormField
                    label={t('form.currentPassword')}
                    htmlFor="user-current-password"
                    hint={needsCurrent ? undefined : t('form.currentPasswordHint')}
                    error={p.currentPasswordError}
                >
                    <PasswordInput
                        id="user-current-password"
                        value={p.currentPassword}
                        onChange={(e) => p.onCurrentPasswordChange(e.target.value)}
                        maxLength={USER_PASSWORD_MAX}
                        disabled={p.disabled}
                        autoComplete="current-password"
                        {...labels}
                    />
                </DepartmentFormField>
            )}

            <DepartmentFormField
                label={t(p.isEdit ? 'form.newPassword' : 'form.password')}
                htmlFor="user-password"
                hint={p.isEdit ? t('form.passwordEditHint') : t('form.passwordHint')}
                error={p.passwordError}
            >
                <PasswordInput
                    id="user-password"
                    value={p.password}
                    onChange={(e) => p.onPasswordChange(e.target.value)}
                    maxLength={USER_PASSWORD_MAX}
                    disabled={p.disabled}
                    autoComplete="new-password"
                    {...labels}
                />
            </DepartmentFormField>
        </div>
    )
}

export default memo(UserPasswordFields)
