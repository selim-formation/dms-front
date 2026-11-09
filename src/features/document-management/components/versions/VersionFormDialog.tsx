import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import ImportFileField from '@/features/document-imports/components/ImportFileField'
import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload'
import { validateFile } from '@/features/document-imports/utils/importPayload'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import VersionMetaFields from '../form/VersionMetaFields'
import { formErrorText } from '../form/formErrorText'
import { useAddVersion, useUpdateVersion } from '../../hooks/useVersionMutations'
import { serverFieldErrors, type FormErrors } from '../../utils/documentForm'
import {
    EMPTY_META,
    buildVersionMeta,
    isVersionBusy,
    metaFromVersion,
    validateVersionMeta,
    type VersionMetaField,
    type VersionMetaValues,
} from '../../utils/versionFields'
import type { DocumentVersion } from '../../types/version.types'

interface VersionFormDialogProps {
    documentId: number
    /** `null` = add a version (renewal); otherwise edit that one. */
    version: DocumentVersion | null
    onOpenChange: (open: boolean) => void
    onSaved: (mode: 'add' | 'edit') => void
    /** 403 / 404 / 409: the dialog can't help; the page explains and refreshes. */
    onBlocked: (error: unknown) => void
}

/**
 * Add or edit one version. Add needs a finished upload; edit replaces the
 * metadata as a whole (so it is prefilled) and the file only if a new one is chosen.
 */
function VersionFormDialog({ documentId, version, onOpenChange, onSaved, onBlocked }: VersionFormDialogProps) {
    const { t } = useTranslation('management')
    const mode = version ? 'edit' : 'add'
    const [meta, setMeta] = useState<VersionMetaValues>(() => (version ? metaFromVersion(version) : EMPTY_META))
    const [errors, setErrors] = useState<FormErrors>({})
    const [file, setFile] = useState<File | null>(null)
    const [fileProblem, setFileProblem] = useState<string | null>(null)
    const [uploadId, setUploadId] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const { state, upload, cancel, reset, forget } = useImportUpload('document_file')

    const addMutation = useAddVersion(documentId)
    const updateMutation = useUpdateVersion(documentId)
    const saving = addMutation.isPending || updateMutation.isPending
    // The server refuses a replacement while the previous file is still being stored (409).
    const replaceBlocked = !!version && isVersionBusy(version.upload_status)

    const handleMeta = useCallback((field: VersionMetaField, value: string) => {
        setMeta((m) => ({ ...m, [field]: value }))
        setErrors((e) => (e[field] ? { ...e, [field]: '' } : e))
    }, [])

    const handleFile = useCallback(
        (next: File | null) => {
            setFile(next)
            setFileProblem(null)
            setUploadId(null)
            setErrors((e) => (e.upload_id ? { ...e, upload_id: '' } : e))
            if (!next) {
                cancel()
                setUploading(false)
                return
            }
            const problem = validateFile('document_file', next)
            if (problem) {
                setFile(null)
                setFileProblem(problem)
                return
            }
            reset()
            setUploading(true)
            upload(next)
                .then((done) => {
                    setUploadId(done.id)
                    forget()
                })
                .catch(() => undefined)
                .finally(() => setUploading(false))
        },
        [cancel, reset, upload, forget],
    )

    const close = useCallback(
        (open: boolean) => {
            if (open || saving) return
            cancel()
            onOpenChange(false)
        },
        [saving, cancel, onOpenChange],
    )

    const handleError = (err: unknown) => {
        const status = errorStatus(err)
        if (status === 422) {
            const fields = serverFieldErrors(err)
            if (fields.upload_id) {
                // The server can't use that upload any more: choose the file again.
                reset()
                setUploadId(null)
                setFile(null)
            }
            setErrors(fields)
            setFormError(Object.keys(fields).length === 0 ? (errorMessage(err) ?? t('versions.form.failed')) : null)
            return
        }
        if (status === 403 || status === 404 || status === 409) return onBlocked(err)
        setFormError(errorMessage(err) ?? t('versions.form.failed'))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (saving) return
        const next: FormErrors = validateVersionMeta(meta)
        if (uploading) next.upload_id = 'uploadPending'
        else if (mode === 'add' && !uploadId) next.upload_id = 'fileRequired'
        setErrors(next)
        setFormError(null)
        if (Object.keys(next).length > 0) return

        const payload = { ...buildVersionMeta(meta), ...(uploadId ? { upload_id: uploadId } : {}) }
        const options = { onSuccess: () => onSaved(mode), onError: handleError }

        if (version) updateMutation.mutate({ versionId: version.id, payload }, options)
        else addMutation.mutate({ ...payload, upload_id: uploadId as string }, options)
    }

    const fileError = fileProblem ? t(`form.fileProblem.${fileProblem}`) : formErrorText(t, errors.upload_id)
    const idPrefix = `version-${version?.id ?? 'new'}`

    return (
        <Dialog open onOpenChange={close}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? t('versions.form.addTitle') : t('versions.form.editTitle', { n: version?.version })}</DialogTitle>
                    <DialogDescription>{mode === 'add' ? t('versions.form.addDescription') : t('versions.form.editDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <DepartmentFormField
                        label={mode === 'add' ? t('form.file') : t('versions.form.replaceFile')}
                        htmlFor={`${idPrefix}-file`}
                        hint={mode === 'edit' ? (replaceBlocked ? t('versions.form.replaceBusy') : t('versions.form.replaceHint')) : undefined}
                        error={fileError}
                    >
                        <ImportFileField
                            id={`${idPrefix}-file`}
                            kind="document_file"
                            file={file}
                            onFileChange={handleFile}
                            upload={state}
                            disabled={saving || replaceBlocked}
                            invalid={!!fileError}
                        />
                    </DepartmentFormField>

                    <VersionMetaFields idPrefix={idPrefix} values={meta} errors={errors} onChange={handleMeta} />

                    {mode === 'edit' && <p className="text-xs text-muted-foreground">{t('versions.form.replaceMeta')}</p>}
                    {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => close(false)} disabled={saving}>
                            {t('actions.cancel', { ns: 'common' })}
                        </Button>
                        <Button type="submit" disabled={saving || uploading}>
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {mode === 'add' ? t('versions.form.add') : t('versions.form.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(VersionFormDialog)
