import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, UserRound } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { errorMessage, fieldErrors } from '@/features/departments/utils/departmentErrors'
import EmployeeRestoreHint from './EmployeeRestoreHint'
import { useCreateEmployee, useUpdateEmployee } from '../hooks/useSaveEmployee'
import { useRestoreEmployee } from '../hooks/useRestoreEmployee'
import { useTrashedEmployeeByEmail } from '../hooks/useTrashedEmployeeByEmail'
import { EMPLOYEE_EMAIL_MAX, EMPLOYEE_NAME_MAX, isValidEmail } from '../utils/employeePayload'
import type { Employee, EmployeePayload } from '../types/employee.types'

interface EmployeeFormDialogProps {
    /** `null` = create mode. */
    employee: Employee | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated' | 'restored') => void
    /** Offer "restore" when the duplicate email belongs to a deleted employee. */
    canRestore: boolean
}

/**
 * Create / edit form. Parent keys it by employee id (or "new") so a new
 * target remounts it with fresh state. Edit sends only changed fields.
 */
function EmployeeFormDialog({ employee, open, onOpenChange, onSaved, canRestore }: EmployeeFormDialogProps) {
    const { t } = useTranslation(['employees', 'common'])
    const isEdit = !!employee

    const [name, setName] = useState(employee?.name ?? '')
    const [email, setEmail] = useState(employee?.email ?? '')
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const create = useCreateEmployee()
    const update = useUpdateEmployee()
    const restore = useRestoreEmployee()
    const mutation = isEdit ? update : create
    const isPending = mutation.isPending || restore.isPending

    const serverErrors = useMemo(() => fieldErrors(mutation.error), [mutation.error])
    const errors = { ...serverErrors, ...localErrors }
    const generalError =
        mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    // After a duplicate-email 422, look for a deleted employee holding that email.
    const trashedMatch = useTrashedEmployeeByEmail(email, canRestore && !!serverErrors.email && !localErrors.email)

    const clearError = useCallback((key: string) => {
        setLocalErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev))
    }, [])

    const handleName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        clearError('name')
    }, [clearError])

    const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        clearError('email')
    }, [clearError])

    const handleRestore = useCallback(
        (target: Employee) => restore.mutate(target.id, { onSuccess: () => onSaved('restored') }),
        [restore, onSaved],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedName = name.trim()
        const trimmedEmail = email.trim()
        const errs: Record<string, string> = {}
        if (!trimmedName) errs.name = t('employees:form.nameRequired')
        else if (trimmedName.length > EMPLOYEE_NAME_MAX) errs.name = t('employees:form.nameTooLong')
        if (!trimmedEmail) errs.email = t('employees:form.emailRequired')
        else if (!isValidEmail(trimmedEmail)) errs.email = t('employees:form.emailInvalid')
        else if (trimmedEmail.length > EMPLOYEE_EMAIL_MAX) errs.email = t('employees:form.emailTooLong')
        setLocalErrors(errs)
        if (Object.keys(errs).length) return

        if (!employee) {
            create.mutate({ name: trimmedName, email: trimmedEmail }, { onSuccess: () => onSaved('created') })
            return
        }

        const payload: EmployeePayload = {}
        if (trimmedName !== employee.name) payload.name = trimmedName
        if (trimmedEmail !== employee.email) payload.email = trimmedEmail
        if (Object.keys(payload).length === 0) {
            onOpenChange(false)
            return
        }
        update.mutate({ id: employee.id, payload }, { onSuccess: () => onSaved('updated') })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'employees:form.editTitle' : 'employees:form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {t(isEdit ? 'employees:form.editDescription' : 'employees:form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <DepartmentFormField label={t('employees:form.name')} htmlFor="employee-name" error={errors.name}>
                        <Input
                            id="employee-name"
                            value={name}
                            onChange={handleName}
                            placeholder={t('employees:form.namePlaceholder')}
                            maxLength={EMPLOYEE_NAME_MAX}
                            disabled={isPending}
                            autoFocus
                        />
                    </DepartmentFormField>

                    <DepartmentFormField label={t('employees:form.email')} htmlFor="employee-email" error={errors.email}>
                        <Input
                            id="employee-email"
                            type="email"
                            dir="ltr"
                            value={email}
                            onChange={handleEmail}
                            placeholder={t('employees:form.emailPlaceholder')}
                            maxLength={EMPLOYEE_EMAIL_MAX}
                            disabled={isPending}
                        />
                    </DepartmentFormField>

                    {trashedMatch && (
                        <EmployeeRestoreHint employee={trashedMatch} isPending={restore.isPending} onRestore={handleRestore} />
                    )}

                    {(generalError || restore.error) && (
                        <p className="text-sm text-destructive">{generalError ?? errorMessage(restore.error)}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            {t('common:actions.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t(isEdit ? 'employees:form.save' : 'employees:form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(EmployeeFormDialog)
