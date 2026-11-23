import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilePlus2, FileText, RefreshCw } from 'lucide-react'
import FormSection from './FormSection'
import SectionField from './SectionField'
import ImportFileField from '@/features/document-imports/components/ImportFileField'
import { useImportUpload } from '@/features/document-imports/hooks/useImportUpload'
import { validateFile } from '@/features/document-imports/utils/importPayload'
import { validateProcessFile } from '../../utils/versionFields'
import { formErrorText } from './formErrorText'
import type { FormErrors, ProcessDraft } from '../../utils/documentForm'
import type { ProcessKind } from '../../types/version.types'
import type { ProcessFileState } from '../../types/management.types'

interface ProcessSlotProps {
    kind: ProcessKind
    error?: string
    current?: ProcessFileState
    disabled?: boolean
    onPatch: (kind: ProcessKind, patch: Partial<ProcessDraft>) => void
}

/** One procedure file: uploads as soon as it is chosen; only the finished upload id goes up to the form. */
const ProcessSlot = memo(function ProcessSlot({ kind, error, current, disabled, onPatch }: ProcessSlotProps) {
    const { t } = useTranslation('management')
    const { state, upload, cancel, reset, forget } = useImportUpload('document_file')
    const [file, setFile] = useState<File | null>(null)
    const [problem, setProblem] = useState<string | null>(null)

    const handleFile = useCallback(
        (next: File | null) => {
            setFile(next)
            setProblem(null)
            if (!next) {
                cancel()
                onPatch(kind, { uploadId: null, fileName: null, uploading: false })
                return
            }
            const invalid = validateProcessFile(next) ?? validateFile('document_file', next)
            if (invalid) {
                setFile(null)
                setProblem(invalid)
                return
            }
            reset()
            onPatch(kind, { uploadId: null, fileName: next.name, uploading: true })
            upload(next)
                .then((done) => {
                    onPatch(kind, { uploadId: done.id, uploading: false })
                    forget()
                })
                .catch(() => onPatch(kind, { uploading: false }))
        },
        [cancel, reset, upload, forget, onPatch, kind],
    )

    const storing = current?.status === 'processing'
    const problemText = problem ? (problem === 'blocked' ? t('form.fileProblem.blocked') : t(`process.problem.${problem}`)) : null

    return (
        <SectionField
            label={t(`process.${kind}.title`)}
            htmlFor={`process-${kind}`}
            hint={t(`form.cards.process.${kind}Hint`)}
            icon={kind === 'create' ? FilePlus2 : RefreshCw}
            error={problemText ?? error}
        >
            {current && (
                <p className="mb-2 text-xs text-muted-foreground" role="status">
                    {t(`form.processState.${current.status}`)}
                </p>
            )}
            <ImportFileField
                id={`process-${kind}`}
                kind="document_file"
                file={file}
                onFileChange={handleFile}
                upload={state}
                disabled={disabled || storing}
                invalid={!!error || !!problemText}
            />
        </SectionField>
    )
})

interface DocumentProcessStepProps {
    errors: FormErrors
    current?: Record<ProcessKind, ProcessFileState>
    onPatch: (kind: ProcessKind, patch: Partial<ProcessDraft>) => void
    disabled?: boolean
}

/** Optional creation / renewal procedure files, sent with the document. On edit a slot left empty keeps the stored file. */
function DocumentProcessStep({ errors, onPatch, current, disabled }: DocumentProcessStepProps) {
    const { t } = useTranslation('management')

    return (
        <FormSection icon={FileText} title={t('form.cards.process.title')} subtitle={t('form.cards.process.subtitle')}>
            <p className="mb-4 text-sm text-muted-foreground">{t('form.processHint')}</p>
            <div className="grid items-start gap-5 md:grid-cols-2">
                {(['create', 'update'] as const).map((kind) => (
                    <ProcessSlot key={kind} kind={kind} error={formErrorText(t, errors[`process.${kind}`])} current={current?.[kind]} disabled={disabled} onPatch={onPatch} />
                ))}
            </div>
        </FormSection>
    )
}

export default memo(DocumentProcessStep)
