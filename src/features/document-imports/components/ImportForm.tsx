import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { DialogFooter } from '@/shared/components/ui/dialog'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import { errorMessage, errorStatus, fieldErrors } from '@/features/departments/utils/departmentErrors'
import ImportFileField from './ImportFileField'
import ImportModeSelector from './ImportModeSelector'
import ImportDefaultsSection, { type ImportDefaultsValue } from './ImportDefaultsSection'
import { useImportUpload } from '../hooks/useImportUpload'
import { useCreateImport, useDownloadManifestTemplate } from '../hooks/useImportMutations'
import { IMPORT_NAME_MAX, validateFile } from '../utils/importPayload'
import type { DocumentImport, ImportCategory, ImportImportance, ImportMode } from '../types/import.types'

interface ImportFormProps {
    onCancel: () => void
    onCreated: (created: DocumentImport) => void
    onBusyChange: (busy: boolean) => void
}

const EMPTY_DEFAULTS: ImportDefaultsValue = {
    department_ids: [],
    section_ids: [],
    type_ids: [],
    entity_ids: [],
    category: '',
    importance: '',
}

/**
 * New-import body: uploads the files (resumable, chunked), then creates the import.
 * A failed create never re-uploads: completed uploads are cached per file.
 */
function ImportForm({ onCancel, onCreated, onBusyChange }: ImportFormProps) {
    const { t } = useTranslation(['imports', 'common'])

    const [name, setName] = useState('')
    const [mode, setMode] = useState<ImportMode>('create_only')
    const [archive, setArchive] = useState<File | null>(null)
    const [manifest, setManifest] = useState<File | null>(null)
    const [defaults, setDefaults] = useState<ImportDefaultsValue>(EMPTY_DEFAULTS)
    const [skipInvalid, setSkipInvalid] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const cancelled = useRef(false)

    const { state: archiveState, upload: uploadArchive, cancel: cancelArchive, reset: resetArchive, forget: forgetArchive } = useImportUpload('archive')
    const { state: manifestState, upload: uploadManifest, cancel: cancelManifest, reset: resetManifest, forget: forgetManifest } = useImportUpload('manifest')
    const create = useCreateImport()
    const template = useDownloadManifestTemplate()

    const uploading = ['uploading', 'assembling'].includes(archiveState.phase) || ['uploading', 'assembling'].includes(manifestState.phase)
    const busy = uploading || create.isPending
    useEffect(() => {
        onBusyChange(busy)
    }, [busy, onBusyChange])

    const clearError = useCallback(
        (field: string) => setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev)),
        [],
    )
    const handleName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name') }, [clearError])
    const handleArchive = useCallback(
        (file: File | null) => { setArchive(file); resetArchive(); clearError('archive_upload_id') },
        [resetArchive, clearError],
    )
    const handleManifest = useCallback(
        (file: File | null) => { setManifest(file); resetManifest(); clearError('manifest_upload_id') },
        [resetManifest, clearError],
    )
    const handleIds = useCallback((field: string, ids: number[]) => setDefaults((d) => ({ ...d, [field]: ids })), [])
    const handleCategory = useCallback((category: ImportCategory | '') => setDefaults((d) => ({ ...d, category })), [])
    const handleImportance = useCallback((importance: ImportImportance | '') => setDefaults((d) => ({ ...d, importance })), [])

    const handleCancel = useCallback(() => {
        cancelled.current = true
        cancelArchive()
        cancelManifest()
        onCancel()
    }, [cancelArchive, cancelManifest, onCancel])

    const defaultsError = useMemo(
        () => ['department_ids', 'section_ids', 'type_ids', 'entity_ids', 'category', 'importance'].map((k) => errors[k]).find(Boolean),
        [errors],
    )

    const fileError = (kind: 'archive' | 'manifest', file: File | null): string | undefined => {
        if (!file) return kind === 'archive' ? t('imports:form.archiveRequired') : undefined
        const problem = validateFile(kind, file)
        return problem ? t(`imports:form.file.${problem}`, { ext: kind === 'archive' ? '.zip' : '.csv' }) : undefined
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = name.trim()
        const errs: Record<string, string> = {}
        if (!trimmed) errs.name = t('imports:form.nameRequired')
        else if (trimmed.length > IMPORT_NAME_MAX) errs.name = t('imports:form.nameTooLong')
        const archiveErr = fileError('archive', archive)
        if (archiveErr) errs.archive_upload_id = archiveErr
        const manifestErr = fileError('manifest', manifest)
        if (manifestErr) errs.manifest_upload_id = manifestErr
        setErrors(errs)
        setSubmitError(null)
        if (Object.keys(errs).length || !archive) return

        cancelled.current = false
        try {
            const archiveUpload = await uploadArchive(archive)
            const manifestUpload = manifest ? await uploadManifest(manifest) : null
            const created = await create.mutateAsync({
                name: trimmed,
                mode,
                archive_upload_id: archiveUpload.id,
                manifest_upload_id: manifestUpload?.id,
                department_ids: defaults.department_ids,
                section_ids: defaults.section_ids,
                type_ids: defaults.type_ids,
                entity_ids: defaults.entity_ids,
                category: defaults.category || undefined,
                importance: defaults.importance || undefined,
                skip_invalid: skipInvalid,
            })
            forgetArchive()
            forgetManifest()
            onCreated(created)
        } catch (err) {
            if (cancelled.current) return
            const fields = fieldErrors(err)
            if (Object.keys(fields).length) {
                setErrors(fields)
                return
            }
            const status = errorStatus(err)
            // The server can't use the upload any more: next submit uploads again.
            if (status === 422) { resetArchive(); resetManifest() }
            setSubmitError(
                status === 429 ? t('imports:form.tooManyUploads') : (errorMessage(err) ?? (err instanceof Error ? err.message : t('imports:form.genericError'))),
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <DepartmentFormField label={t('imports:form.name')} htmlFor="import-name" error={errors.name}>
                <Input
                    id="import-name"
                    value={name}
                    onChange={handleName}
                    placeholder={t('imports:form.namePlaceholder')}
                    maxLength={IMPORT_NAME_MAX}
                    disabled={busy}
                    autoFocus
                    dir="auto"
                />
            </DepartmentFormField>

            <DepartmentFormField label={t('imports:form.mode')} error={errors.mode}>
                <ImportModeSelector value={mode} onChange={setMode} disabled={busy} />
            </DepartmentFormField>

            <DepartmentFormField label={t('imports:form.archive')} htmlFor="import-archive" error={errors.archive_upload_id}>
                <ImportFileField
                    id="import-archive"
                    kind="archive"
                    file={archive}
                    onFileChange={handleArchive}
                    upload={archiveState}
                    disabled={busy}
                    invalid={!!errors.archive_upload_id}
                />
            </DepartmentFormField>

            <DepartmentFormField
                label={t('imports:form.manifest')}
                htmlFor="import-manifest"
                error={errors.manifest_upload_id}
                hint={t('imports:form.manifestHint')}
            >
                <div className="space-y-2">
                    <ImportFileField
                        id="import-manifest"
                        kind="manifest"
                        file={manifest}
                        onFileChange={handleManifest}
                        upload={manifestState}
                        disabled={busy}
                        invalid={!!errors.manifest_upload_id}
                    />
                    <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={() => template.mutate()} disabled={template.isPending}>
                        {template.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        {t('imports:form.template')}
                    </Button>
                </div>
            </DepartmentFormField>

            <ImportDefaultsSection
                value={defaults}
                onIdsChange={handleIds}
                onCategoryChange={handleCategory}
                onImportanceChange={handleImportance}
                error={defaultsError}
                disabled={busy}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    checked={skipInvalid}
                    onChange={(e) => setSkipInvalid(e.target.checked)}
                    disabled={busy}
                />
                <span>
                    <span className="block text-sm font-medium text-foreground">{t('imports:form.skipInvalid')}</span>
                    <span className="block text-xs text-muted-foreground">{t('imports:form.skipInvalidHint')}</span>
                </span>
            </label>

            {submitError && (
                <p role="alert" className="text-sm text-destructive">
                    {submitError}
                </p>
            )}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={create.isPending}>
                    {uploading ? t('imports:form.cancelUpload') : t('common:actions.cancel')}
                </Button>
                <Button type="submit" disabled={busy}>
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t('imports:form.submit')}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default memo(ImportForm)
