import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DialogFooter } from '@/shared/components/ui/dialog'
import { errorMessage, errorStatus, fieldErrors } from '@/features/departments/utils/departmentErrors'
import UserIdentityFields from './UserIdentityFields'
import UserPasswordFields from './UserPasswordFields'
import UserAssignmentFields from './UserAssignmentFields'
import { useUserForm } from '../../hooks/useUserForm'
import { useCreateUser, useUpdateUser } from '../../hooks/useSaveUser'
import type { ManagedUser } from '../../types/user.types'

interface UserFormProps {
    /** `null` = create mode. */
    user: ManagedUser | null
    isSelf: boolean
    onCancel: () => void
    onSaved: (saved: ManagedUser, mode: 'create' | 'edit') => void
    /** 403 / 404 on save: the dialog closes and the page explains. */
    onBlocked: (error: unknown) => void
    onPendingChange: (pending: boolean) => void
}

/**
 * Create / edit body. The dialog keys it by user id, so a new target remounts it
 * with fresh state. Edit sends only what changed; a list that is left out stays unchanged.
 */
function UserForm({ user, isSelf, onCancel, onSaved, onBlocked, onPendingChange }: UserFormProps) {
    const { t } = useTranslation(['users', 'common'])
    const isEdit = !!user
    const form = useUserForm(user, isSelf)
    const { values, errors: localErrors, setField, setDepartments } = form

    const create = useCreateUser()
    const update = useUpdateUser()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    // Lets the dialog shell block closing while a request is in flight.
    useEffect(() => {
        onPendingChange(isPending)
    }, [isPending, onPendingChange])

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = useMemo(() => {
        const merged: Record<string, string | undefined> = { ...serverErrors }
        for (const [key, msg] of Object.entries(localErrors)) if (msg) merged[key] = msg
        return merged
    }, [serverErrors, localErrors])

    // 422 names the field; 409 (shared account / changed state) has no field, so the message is shown as is.
    const generalError = mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const handleName = useCallback((v: string) => setField('name', v), [setField])
    const handleEmail = useCallback((v: string) => setField('email', v), [setField])
    const handlePassword = useCallback((v: string) => setField('password', v), [setField])
    const handleCurrentPassword = useCallback((v: string) => setField('currentPassword', v), [setField])
    const handleRoles = useCallback((ids: number[]) => setField('roleIds', ids), [setField])
    const handleSections = useCallback((ids: number[]) => setField('sectionIds', ids), [setField])

    const handleError = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403 || status === 404) onBlocked(err)
        },
        [onBlocked],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.validate(t)) return

        const payload = form.buildPayload()

        if (!user) {
            create.mutate(payload, { onSuccess: (saved) => onSaved(saved, 'create'), onError: handleError })
            return
        }
        if (Object.keys(payload).length === 0) {
            onCancel()
            return
        }
        update.mutate({ id: user.id, payload }, { onSuccess: (saved) => onSaved(saved, 'edit'), onError: handleError })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <UserIdentityFields
                name={values.name}
                email={values.email}
                nameError={errors.name}
                emailError={errors.email}
                disabled={isPending}
                onNameChange={handleName}
                onEmailChange={handleEmail}
            />

            <UserPasswordFields
                isEdit={isEdit}
                isSelf={isSelf}
                password={values.password}
                currentPassword={values.currentPassword}
                passwordError={errors.password}
                currentPasswordError={errors.currentPassword ?? errors.current_password}
                disabled={isPending}
                onPasswordChange={handlePassword}
                onCurrentPasswordChange={handleCurrentPassword}
            />

            <UserAssignmentFields
                user={user}
                isSelf={isSelf}
                roleIds={values.roleIds}
                departmentIds={values.departmentIds}
                sectionIds={values.sectionIds}
                sectionOptions={form.sectionOptions}
                sectionsLoading={form.sectionsLoading}
                errors={errors}
                disabled={isPending}
                onRolesChange={handleRoles}
                onDepartmentsChange={setDepartments}
                onSectionsChange={handleSections}
            />

            {generalError && (
                <p role="alert" className="text-sm text-destructive">
                    {generalError}
                </p>
            )}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    {t('common:actions.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t(isEdit ? 'users:form.save' : 'users:form.create')}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default memo(UserForm)
