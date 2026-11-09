import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HardDrive, Loader2, TriangleAlert } from 'lucide-react'
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
import DepartmentFilterSelect from '@/features/departments/components/DepartmentFilterSelect'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import ProviderFields from './ProviderFields'
import ExpiryField from './ExpiryField'
import StorageProviderBadge from './StorageProviderBadge'
import { storageErrorText } from './storageErrorText'
import { useCreateStorage, useUpdateStorage } from '../hooks/useSaveStorage'
import { PROVIDERS, hasCredentials, type FieldSection } from '../utils/providerFields'
import {
    NAME_MAX,
    buildCreatePayload,
    buildUpdatePayload,
    emptyValues,
    serverFieldErrors,
    validateCreate,
    validateName,
    validateSection,
    valuesFromConnection,
    type FormErrors,
    type StorageFormValues,
} from '../utils/storagePayload'
import type { StorageConnection, StorageProvider } from '../types/storage.types'

interface StorageFormDialogProps {
    /** `null` = create. Edit changes the name and settings only (secrets have their own dialog). */
    connection: StorageConnection | null
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'created' | 'updated') => void
    /** 403 / 404: the dialog can't help; the page explains. */
    onBlocked: (error: unknown) => void
}

function StorageFormDialog({ connection, onOpenChange, onSaved, onBlocked }: StorageFormDialogProps) {
    const { t } = useTranslation('storage')
    const isEdit = !!connection
    const [values, setValues] = useState<StorageFormValues>(() => (connection ? valuesFromConnection(connection) : emptyValues()))
    const [errors, setErrors] = useState<FormErrors>({})
    const [formError, setFormError] = useState<string | null>(null)

    const create = useCreateStorage()
    const update = useUpdateStorage()
    const saving = create.isPending || update.isPending
    const provider = values.provider

    const providerOptions = useMemo(
        () => PROVIDERS.map((p) => ({ value: p, label: t(`provider.${p}`) })),
        [t],
    )

    const clearError = useCallback(
        (key: string) => setErrors((e) => (e[key] ? { ...e, [key]: '' } : e)),
        [],
    )
    const handleName = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues((v) => ({ ...v, name: e.target.value }))
            clearError('name')
        },
        [clearError],
    )
    const handleProvider = useCallback((next: StorageProvider) => {
        // Each provider has its own keys: start clean so nothing foreign is sent.
        setValues((v) => ({ ...emptyValues(next), name: v.name }))
        setErrors({})
    }, [])
    const handleField = useCallback(
        (section: FieldSection, key: string, value: string) => {
            setValues((v) => ({ ...v, [section]: { ...v[section], [key]: value } }))
            clearError(`${section}.${key}`)
        },
        [clearError],
    )
    const handleExpiry = useCallback(
        (value: string) => {
            setValues((v) => ({ ...v, credentials_expires_at: value }))
            clearError('credentials_expires_at')
        },
        [clearError],
    )

    const close = useCallback(
        (open: boolean) => {
            if (!open && !saving) onOpenChange(false)
        },
        [saving, onOpenChange],
    )

    const handleError = (err: unknown) => {
        const status = errorStatus(err)
        if (status === 403 || status === 404) return onBlocked(err)
        const fields = status === 422 ? serverFieldErrors(err) : {}
        setErrors(fields)
        setFormError(Object.keys(fields).length === 0 ? (errorMessage(err) ?? t('form.failed')) : null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (saving) return
        setFormError(null)

        if (!connection) {
            const next = validateCreate(values)
            setErrors(next)
            if (Object.keys(next).length) return
            create.mutate(buildCreatePayload(values), { onSuccess: () => onSaved('created'), onError: handleError })
            return
        }

        const next = { ...validateName(values.name), ...validateSection(connection.provider, 'configuration', values.configuration) }
        setErrors(next)
        if (Object.keys(next).length) return
        const payload = buildUpdatePayload(connection, values)
        if (!payload) return onOpenChange(false)
        update.mutate({ id: connection.id, payload }, { onSuccess: () => onSaved('updated'), onError: handleError })
    }

    // Moving where it points (not a rename) returns it to pending and drops the default.
    const movesTarget = !!connection && !!buildUpdatePayload(connection, values)?.configuration
    const idPrefix = `storage-${connection?.id ?? 'new'}`

    return (
        <Dialog open onOpenChange={close}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-primary" />
                        {t(isEdit ? 'form.editTitle' : 'form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>{t(isEdit ? 'form.editDescription' : 'form.createDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <DepartmentFormField label={t('fields.name')} htmlFor={`${idPrefix}-name`} error={storageErrorText(t, errors.name)}>
                            <Input
                                id={`${idPrefix}-name`}
                                value={values.name}
                                onChange={handleName}
                                maxLength={NAME_MAX}
                                disabled={saving}
                                autoFocus
                                dir="auto"
                            />
                        </DepartmentFormField>
                        <DepartmentFormField
                            label={t('fields.provider')}
                            hint={isEdit ? t('form.providerLocked') : undefined}
                            error={storageErrorText(t, errors.provider)}
                        >
                            {isEdit ? (
                                <div className="flex h-10 items-center"><StorageProviderBadge provider={provider} /></div>
                            ) : (
                                <DepartmentFilterSelect label={t('fields.provider')} value={provider} options={providerOptions} onChange={handleProvider} />
                            )}
                        </DepartmentFormField>
                    </div>

                    <fieldset className="space-y-3" disabled={saving}>
                        <legend className="mb-1 text-sm font-semibold text-foreground">{t('form.settings')}</legend>
                        <ProviderFields
                            provider={provider}
                            section="configuration"
                            idPrefix={idPrefix}
                            values={values.configuration}
                            errors={errors}
                            onChange={handleField}
                        />
                    </fieldset>

                    {!isEdit && hasCredentials(provider) && (
                        <fieldset className="space-y-3" disabled={saving}>
                            <legend className="mb-1 text-sm font-semibold text-foreground">{t('form.credentials')}</legend>
                            <p className="text-xs text-muted-foreground">{t('form.credentialsHint')}</p>
                            <ProviderFields
                                provider={provider}
                                section="credentials"
                                idPrefix={idPrefix}
                                values={values.credentials}
                                errors={errors}
                                onChange={handleField}
                            />
                            <ExpiryField id={`${idPrefix}-expires`} value={values.credentials_expires_at} error={errors.credentials_expires_at} onChange={handleExpiry} />
                        </fieldset>
                    )}

                    {!isEdit && provider === 'local' && <p className="text-xs text-muted-foreground">{t('form.localHint')}</p>}

                    {movesTarget && connection.status !== 'pending' && (
                        <p role="status" className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
                            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            {connection.is_default ? t('form.movesDefaultWarning') : t('form.movesWarning')}
                        </p>
                    )}

                    {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => close(false)} disabled={saving}>
                            {t('actions.cancel', { ns: 'common' })}
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t(isEdit ? 'form.save' : 'form.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(StorageFormDialog)
