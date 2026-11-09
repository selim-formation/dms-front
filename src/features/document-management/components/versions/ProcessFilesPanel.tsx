import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import ProcessFileCard from './ProcessFileCard'
import { useAttachProcessFile, useProcessFiles, useRemoveProcessFile } from '../../hooks/useProcessFiles'
import { useOpenPreview } from '../../hooks/useOpenPreview'
import { processFilesApiService } from '../../api/processFilesApi'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import type { ProcessKind } from '../../types/version.types'

const KINDS: ProcessKind[] = ['create', 'update']

interface ProcessFilesPanelProps {
    documentId: number
    canEdit: boolean
    onNotify: (tone: 'success' | 'error', message: string) => void
    /** 403 / 404 / 409 → page-level explanation. */
    onBlocked: (error: unknown) => void
}

/** Creation / renewal procedure files of the document. */
function ProcessFilesPanel({ documentId, canEdit, onNotify, onBlocked }: ProcessFilesPanelProps) {
    const { t } = useTranslation('management')
    const tenant = useTenantId() ?? ''
    const { state, isLoading, isError, refetch, watch, unwatch, isStoring } = useProcessFiles(documentId)
    const attach = useAttachProcessFile(documentId)
    const remove = useRemoveProcessFile(documentId)
    const [confirm, setConfirm] = useState<ProcessKind | null>(null)

    const handlePreviewError = useCallback((err: unknown) => onNotify('error', errorMessage(err) ?? t('versions.notice.previewFailed')), [onNotify, t])
    const { open, loadingKey } = useOpenPreview(handlePreviewError)

    const handleAttach = useCallback(
        (kind: ProcessKind, uploadId: string) =>
            attach.mutateAsync({ kind, uploadId }).then(
                () => {
                    watch(kind)
                    onNotify('success', t('process.notice.attached'))
                },
                (err) => {
                    const status = errorStatus(err)
                    if (status === 403 || status === 404 || status === 409) onBlocked(err)
                    else onNotify('error', errorMessage(err) ?? t('process.notice.failed'))
                    throw err
                },
            ),
        [attach, watch, onNotify, onBlocked, t],
    )

    const handlePreview = useCallback(
        (kind: ProcessKind) => open(`process-${kind}`, () => processFilesApiService.preview(tenant, documentId, kind)),
        [open, tenant, documentId],
    )
    const handleAskRemove = useCallback((kind: ProcessKind) => setConfirm(kind), [])
    const closeConfirm = useCallback((o: boolean) => !o && setConfirm(null), [])

    const runRemove = () => {
        if (!confirm) return
        const kind = confirm
        remove.mutate(kind, {
            onSuccess: () => {
                unwatch(kind)
                setConfirm(null)
                onNotify('success', t('process.notice.removed'))
            },
            onError: (err) => {
                setConfirm(null)
                const status = errorStatus(err)
                if (status === 403 || status === 404 || status === 409) onBlocked(err)
                else onNotify('error', errorMessage(err) ?? t('process.notice.failed'))
            },
        })
    }

    return (
        <section aria-labelledby="process-files-title" className="space-y-3">
            <div>
                <h2 id="process-files-title" className="text-lg font-semibold text-foreground">{t('process.title')}</h2>
                <p className="text-sm text-muted-foreground">{canEdit ? t('process.subtitle') : t('process.readOnly')}</p>
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
                    {KINDS.map((k) => <div key={k} className="h-32 animate-pulse rounded-xl bg-muted" />)}
                </div>
            ) : isError || !state ? (
                <p className="text-sm text-destructive">
                    {t('process.loadError')}{' '}
                    <button type="button" className="underline" onClick={() => refetch()}>{t('actions.retry', { ns: 'common' })}</button>
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {KINDS.map((kind) => (
                        <ProcessFileCard
                            key={kind}
                            kind={kind}
                            exists={state[kind].exists}
                            storing={isStoring(kind)}
                            canEdit={canEdit}
                            previewing={loadingKey === `process-${kind}`}
                            onAttach={handleAttach}
                            onPreview={handlePreview}
                            onRemove={handleAskRemove}
                        />
                    ))}
                </div>
            )}

            {confirm && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={remove.isPending}
                    onConfirm={runRemove}
                    destructive
                    title={t('process.confirm.title')}
                    description={t('process.confirm.description', { name: t(`process.${confirm}.title`) })}
                    confirmLabel={t('process.confirm.confirm')}
                />
            )}
        </section>
    )
}

export default memo(ProcessFilesPanel)
