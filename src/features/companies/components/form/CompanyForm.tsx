import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DialogFooter } from '@/shared/components/ui/dialog'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { errorMessage, errorStatus, fieldErrors } from '@/features/departments/utils/departmentErrors'
import { usePermissionCatalog } from '@/core/reference-data/hooks/usePermissionCatalog'
import CompanyNameFields from './CompanyNameFields'
import CompanyLogoField from './CompanyLogoField'
import CompanyFeaturePicker from './CompanyFeaturePicker'
import { useCompanyForm } from '../../hooks/useCompanyForm'
import { useCreateCompany, useUpdateCompany } from '../../hooks/useSaveCompany'
import { useCompanyLogoUpload } from '../../hooks/useCompanyLogoUpload'
import { buildCreatePayload, buildEditPayload, sameIds } from '../../utils/companyPayload'
import type { Company } from '../../types/company.types'

interface CompanyFormProps {
    /** `null` = create mode. Edit needs the detail payload (`permission_ids`). */
    company: Company | null
    onCancel: () => void
    onSaved: (saved: Company, mode: 'create' | 'edit') => void
    /** 403 / 404 on save: the dialog closes and the page explains. */
    onBlocked: (error: unknown) => void
    onPendingChange: (pending: boolean) => void
}

/**
 * Create / edit body. The dialog keys it by company id, so a new target remounts it with fresh
 * state. Edit shows name / slug / id read-only and changes features and logo only.
 */
function CompanyForm({ company, onCancel, onSaved, onBlocked, onPendingChange }: CompanyFormProps) {
    const { t } = useTranslation(['companies', 'common'])
    const isEdit = !!company
    const form = useCompanyForm(company)
    const { values, errors: localErrors, setPermissionIds } = form
    const catalog = usePermissionCatalog()
    const logo = useCompanyLogoUpload()
    const { reset: resetLogo, forget: forgetLogo } = logo

    const create = useCreateCompany()
    const update = useUpdateCompany()
    const mutation = isEdit ? update : create
    const uploading = logo.state.phase === 'uploading' || logo.state.phase === 'assembling'
    const isPending = mutation.isPending || uploading

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

    const logoError = errors.logo ?? serverErrors.logo_upload_id ?? serverErrors.remove_logo ?? (logo.state.phase === 'error' ? (logo.state.error ?? undefined) : undefined)
    // 409 (in the trash / not empty …) has no field, so the message is shown as is.
    const generalError = mutation.error && Object.keys(serverErrors).length === 0 ? errorMessage(mutation.error) : null

    const progress = useMemo(() => {
        const { phase, sent, total } = logo.state
        if (phase === 'assembling') return 100
        if (phase !== 'uploading' || total === 0) return null
        return Math.min(99, Math.round((sent / total) * 100))
    }, [logo.state])

    const handleLogoFile = useCallback(
        (file: File | null) => {
            resetLogo() // the previous upload belonged to another file
            form.pickLogo(file)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [resetLogo, form.pickLogo],
    )

    const handleError = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403 || status === 404) onBlocked(err)
        },
        [onBlocked],
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.validate(t)) return

        let uploadId: string | undefined
        if (form.logoFile) {
            try {
                uploadId = (await logo.upload(form.logoFile)).id
            } catch {
                return // the upload hook already holds the message
            }
        }

        const done = (saved: Company) => {
            forgetLogo()
            onSaved(saved, isEdit ? 'edit' : 'create')
        }

        if (!company) {
            create.mutate(buildCreatePayload(values, uploadId), { onSuccess: done, onError: handleError })
            return
        }

        const unchanged =
            !uploadId && !form.removeLogo && sameIds(values.permissionIds, company.permission_ids ?? [])
        if (unchanged) {
            onCancel()
            return
        }
        update.mutate(
            { id: company.id, payload: buildEditPayload(values, { uploadId, remove: form.removeLogo }) },
            { onSuccess: done, onError: handleError },
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <CompanyNameFields
                readOnly={isEdit}
                name={values.name}
                slug={values.slug}
                id={values.id}
                errors={errors}
                disabled={isPending}
                onNameChange={form.setName}
                onSlugChange={form.setSlug}
                onIdChange={form.setId}
            />

            <DepartmentFormField label={t('companies:form.logo')}>
                <CompanyLogoField
                    name={values.name}
                    currentSrc={company?.logo_url ?? null}
                    file={form.logoFile}
                    removed={form.removeLogo}
                    onFileChange={handleLogoFile}
                    onRemoveChange={form.setRemoveLogo}
                    progress={progress}
                    error={logoError}
                    disabled={isPending}
                />
            </DepartmentFormField>

            <DepartmentFormField label={t('companies:form.features')} hint={t('companies:form.featuresHint')} error={errors.permissions}>
                <CompanyFeaturePicker
                    options={catalog.permissions}
                    selectedIds={values.permissionIds}
                    onChange={setPermissionIds}
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
                    {t(isEdit ? 'companies:form.save' : 'companies:form.create')}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default memo(CompanyForm)
