import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { DialogFooter } from '@/shared/components/ui/dialog'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { errorMessage, fieldErrors } from '@/features/departments/utils/departmentErrors'
import { usePermissionCatalog } from '@/core/reference-data/hooks/usePermissionCatalog'
import RolePermissionPicker from './RolePermissionPicker'
import { useCreateRole, useUpdateRole } from '../hooks/useSaveRole'
import { useHeldPermissions } from '../hooks/useHeldPermissions'
import { ROLE_NAME_MAX, ROLE_NAME_MIN, isSystemRoleName, sameIds } from '../utils/rolePayload'
import type { Role, RolePayload, RolePermission } from '../types/role.types'

interface RoleFormProps {
    /** `null` = create mode. Must include `permissions` (the detail payload). */
    role: Role | null
    onCancel: () => void
    onSaved: (mode: 'created' | 'updated') => void
    onPendingChange: (pending: boolean) => void
}

/**
 * Create / edit body. The shell keys it by role id, so a new target remounts it
 * with fresh state. Edit sends only what changed; `permissions` is the full set.
 */
function RoleForm({ role, onCancel, onSaved, onPendingChange }: RoleFormProps) {
    const { t } = useTranslation(['roles', 'common'])
    const isEdit = !!role
    const isSystem = isEdit && isSystemRoleName(role.name)
    const original = useMemo(() => (role?.permissions ?? []).map((p) => p.id), [role])

    const [name, setName] = useState(role?.name ?? '')
    const [permissionIds, setPermissionIds] = useState<number[]>(original)
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const held = useHeldPermissions()
    const catalog = usePermissionCatalog()

    // Catalog + the role's own permissions (so ones the tenant dropped can still be unchecked).
    const options = useMemo<RolePermission[]>(() => {
        const map = new Map<number, RolePermission>()
        role?.permissions?.forEach((p) => map.set(p.id, p))
        catalog.permissions.forEach((p) => map.set(p.id, p))
        return [...map.values()]
    }, [catalog.permissions, role])

    const selected = useMemo<ReadonlySet<number>>(() => new Set(permissionIds), [permissionIds])

    const create = useCreateRole()
    const update = useUpdateRole()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending

    // Lets the dialog shell block closing while a request is in flight.
    useEffect(() => {
        onPendingChange(isPending)
    }, [isPending, onPendingChange])

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = { ...serverErrors, ...localErrors }
    const generalError =
        mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const clearError = useCallback(
        (field: string) => setLocalErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev)),
        [],
    )
    const handleName = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name') },
        [clearError],
    )
    const handleToggle = useCallback(
        (id: number) => {
            setPermissionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
            clearError('permissions')
        },
        [clearError],
    )
    const handleToggleMany = useCallback(
        (ids: number[], checked: boolean) => {
            setPermissionIds((prev) =>
                checked ? [...new Set([...prev, ...ids])] : prev.filter((x) => !ids.includes(x)),
            )
            clearError('permissions')
        },
        [clearError],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = name.trim()
        const errs: Record<string, string> = {}
        if (!isSystem) {
            if (trimmed.length < ROLE_NAME_MIN) errs.name = t('roles:form.nameTooShort')
            else if (trimmed.length > ROLE_NAME_MAX) errs.name = t('roles:form.nameTooLong')
            else if (isSystemRoleName(trimmed)) errs.name = t('roles:form.nameReserved')
        }
        if (permissionIds.length === 0) errs.permissions = t('roles:form.permissionsRequired')
        setLocalErrors(errs)
        if (Object.keys(errs).length) return

        if (!role) {
            create.mutate({ name: trimmed, permissions: permissionIds }, { onSuccess: () => onSaved('created') })
            return
        }

        const payload: RolePayload = {}
        if (!isSystem && trimmed !== role.name) payload.name = trimmed
        if (!sameIds(permissionIds, original)) payload.permissions = permissionIds

        if (Object.keys(payload).length === 0) {
            onCancel()
            return
        }
        update.mutate({ id: role.id, payload }, { onSuccess: () => onSaved('updated') })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <DepartmentFormField
                label={t('roles:form.name')}
                htmlFor="role-name"
                error={errors.name}
                hint={isSystem ? t('roles:form.systemLocked') : undefined}
            >
                <Input
                    id="role-name"
                    value={name}
                    onChange={handleName}
                    placeholder={t('roles:form.namePlaceholder')}
                    maxLength={ROLE_NAME_MAX}
                    disabled={isPending || isSystem}
                    autoFocus={!isSystem}
                    dir="auto"
                />
            </DepartmentFormField>

            <DepartmentFormField label={t('roles:form.permissions')} error={errors.permissions}>
                <RolePermissionPicker
                    options={options}
                    selected={selected}
                    held={held}
                    onToggle={handleToggle}
                    onToggleMany={handleToggleMany}
                    isLoading={catalog.isLoading}
                    isError={catalog.isError}
                    onRetry={catalog.refetch}
                    invalid={!!errors.permissions}
                    disabled={isPending}
                />
            </DepartmentFormField>

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
                    {t(isEdit ? 'roles:form.save' : 'roles:form.create')}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default memo(RoleForm)
