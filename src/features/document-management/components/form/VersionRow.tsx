import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import ImportFileField from '@/features/document-imports/components/ImportFileField'
import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload'
import { validateFile } from '@/features/document-imports/utils/importPayload'
import VersionMetaFields from './VersionMetaFields'
import { formErrorText } from './formErrorText'
import type { FormErrors, VersionDraft } from '../../utils/documentForm'
import type { VersionMetaField } from '../../utils/versionFields'

interface VersionRowProps {
    draft: VersionDraft
    index: number
    /** Whole form error map; the row reads only its own `versions.<index>.*` keys. */
    errors: FormErrors
    disabled?: boolean
    onPatch: (key: string, patch: Partial<VersionDraft>) => void
    onRemove: (key: string) => void
}

/**
 * One version: its file uploads as soon as it is chosen (own progress state),
 * and only the finished upload id goes up to the form. Memoised: typing in one
 * row, or a progress tick, never re-renders the others.
 */
function VersionRow({ draft, index, errors, disabled, onPatch, onRemove }: VersionRowProps) {
    const { t } = useTranslation('management')
    const { state, upload, cancel, reset, forget } = useImportUpload('document_file')
    const [file, setFile] = useState<File | null>(null)
    const [fileProblem, setFileProblem] = useState<string | null>(null)
    const { key } = draft

    const own = useMemo(() => {
        const prefix = `versions.${index}.`
        return Object.fromEntries(Object.entries(errors).filter(([k]) => k.startsWith(prefix)).map(([k, v]) => [k.slice(prefix.length), v]))
    }, [errors, index])

    const handleFile = useCallback(
        (next: File | null) => {
            setFile(next)
            setFileProblem(null)
            if (!next) {
                cancel()
                onPatch(key, { uploadId: null, fileName: null, uploading: false })
                return
            }
            const problem = validateFile('document_file', next)
            if (problem) {
                setFile(null)
                setFileProblem(problem)
                return
            }
            reset()
            onPatch(key, { uploadId: null, fileName: next.name, uploading: true })
            upload(next)
                .then((done) => {
                    onPatch(key, { uploadId: done.id, uploading: false })
                    forget() // consumed once the document is saved; no stale resume record
                })
                .catch(() => onPatch(key, { uploading: false }))
        },
        [cancel, reset, upload, forget, onPatch, key],
    )

    const handleRemove = useCallback(() => {
        cancel()
        onRemove(key)
    }, [cancel, onRemove, key])

    const handleMeta = useCallback((field: VersionMetaField, value: string) => onPatch(key, { [field]: value }), [onPatch, key])

    return (
        <fieldset className="space-y-4 rounded-xl border border-border p-4" disabled={disabled}>
            <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-foreground">
                {t('form.versionN', { n: index + 1 })}
            </legend>

            <DepartmentFormField
                label={t('form.file')}
                htmlFor={`ver-file-${key}`}
                error={fileProblem ? t(`form.fileProblem.${fileProblem}`) : formErrorText(t, own.upload_id)}
            >
                <ImportFileField
                    id={`ver-file-${key}`}
                    kind="document_file"
                    file={file}
                    onFileChange={handleFile}
                    upload={state}
                    disabled={disabled}
                    invalid={!!own.upload_id || !!fileProblem}
                />
            </DepartmentFormField>

            <VersionMetaFields idPrefix={`ver-${key}`} values={draft} errors={own} onChange={handleMeta} />

            <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {t('form.removeVersion')}
                </Button>
            </div>
        </fieldset>
    )
}

export default memo(VersionRow)
