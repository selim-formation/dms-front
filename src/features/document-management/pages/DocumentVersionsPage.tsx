import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { documentActivityKeys } from '@/features/documents/api/documentActivityKeys'
import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import Navbar from '@/shared/components/layout/Navbar'
import { Button } from '@/shared/components/ui/button'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import DepartmentBulkBar from '@/features/departments/components/DepartmentBulkBar'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useDepartmentSelection } from '@/features/departments/hooks/useDepartmentSelection'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { errorList } from '@/features/roles/utils/roleErrors'
import { DocumentStatusBadge } from '../components/DocumentBadges'
import { ManagementForbiddenState, ManagementTableSkeleton } from '../components/ManagementStates'
import VersionsTable from '../components/versions/VersionsTable'
import VersionFormDialog from '../components/versions/VersionFormDialog'
import ProcessFilesPanel from '../components/versions/ProcessFilesPanel'
import { useManagedDocumentDetail } from '../hooks/useManagedDocumentDetail'
import { useDocumentVersions } from '../hooks/useDocumentVersions'
import { useBulkDeleteVersions, useDeleteVersion } from '../hooks/useVersionMutations'
import { useVersionAccess } from '../hooks/useVersionAccess'
import { useOpenPreview } from '../hooks/useOpenPreview'
import { versionsApiService } from '../api/versionsApi'
import { useManagementCache } from '../hooks/useManagementCache'
import type { DocumentVersion } from '../types/version.types'

type FormTarget = { version: DocumentVersion | null } | null
type ConfirmState = { kind: 'one'; version: DocumentVersion } | { kind: 'bulk'; ids: number[] } | null

/** Versions + procedure files of one document. */
export default function DocumentVersionsPage() {
    const { t } = useTranslation('management')
    const { tenant, documentId } = useParams({ from: '/_protected/$tenant/document-management/$documentId/versions' })
    const id = Number(documentId)
    const tenantId = useTenantId() ?? tenant
    const queryClient = useQueryClient()
    const access = useVersionAccess()
    const { invalidate } = useManagementCache()

    const { document: doc, isLoading: docLoading, isError: docError, error: docErr, refetch: refetchDoc } = useManagedDocumentDetail(id)
    const { versions, isLoading, isError, error, refetch } = useDocumentVersions(id, access.canRead)

    const [form, setForm] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteVersion(id)
    const bulkMutation = useBulkDeleteVersions(id)

    const selectableIds = useMemo(
        () => (access.canDelete ? versions.filter((v) => v.abilities.delete).map((v) => v.id) : []),
        [versions, access.canDelete],
    )
    const selection = useDepartmentSelection(String(id), selectableIds)

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 / 404 / 409 → the server's words; 409 means somebody changed it first, so refresh. */
    const notifyBlocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 409) invalidate()
            if (status === 403) return notify('error', t('versions.notice.forbidden'))
            if (status === 404) return notify('error', t('versions.notice.notFound'))
            notify('error', errorMessage(err) ?? t('versions.notice.failed'))
        },
        [notify, invalidate, t],
    )

    const { open: openPreview, loadingKey } = useOpenPreview(
        useCallback((err: unknown) => notify('error', errorMessage(err) ?? t('versions.notice.previewFailed')), [notify, t]),
    )
    const previewingId = loadingKey?.startsWith('version-') ? Number(loadingKey.slice(8)) : null

    const handlePreview = useCallback(
        (v: DocumentVersion) =>
            openPreview(`version-${v.id}`, async () => {
                const link = await versionsApiService.preview(tenantId, id, v.id)
                // A preview is logged as a `view` of that version.
                queryClient.invalidateQueries({ queryKey: documentActivityKeys.all(tenantId, id) })
                return link
            }),
        [openPreview, tenantId, id, queryClient],
    )
    const handleAdd = useCallback(() => setForm({ version: null }), [])
    const handleEdit = useCallback((v: DocumentVersion) => setForm({ version: v }), [])
    const handleAskDelete = useCallback((v: DocumentVersion) => {
        setConfirmError(null)
        setConfirm({ kind: 'one', version: v })
    }, [])
    const handleBulk = useCallback(() => {
        setConfirmError(null)
        setConfirm({ kind: 'bulk', ids: selection.selectedList })
    }, [selection.selectedList])

    const closeForm = useCallback((open: boolean) => !open && setForm(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const handleSaved = useCallback(
        (mode: 'add' | 'edit') => {
            setForm(null)
            notify('success', t(`versions.notice.${mode === 'add' ? 'added' : 'updated'}`))
        },
        [notify, t],
    )
    const handleFormBlocked = useCallback(
        (err: unknown) => {
            setForm(null)
            notifyBlocked(err)
        },
        [notifyBlocked],
    )

    const runConfirm = () => {
        if (!confirm) return
        if (confirm.kind === 'bulk') {
            bulkMutation.mutate(confirm.ids, {
                onSuccess: (res) => {
                    selection.clear()
                    setConfirm(null)
                    notify('success', t('versions.notice.bulkDeleted', { count: res.affected }))
                },
                onError: (err) => {
                    // 422 names each blocker: keep the dialog open so the user can deselect.
                    const blockers = errorList(err, 'ids')
                    if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                    setConfirm(null)
                    notifyBlocked(err)
                },
            })
            return
        }
        deleteMutation.mutate(confirm.version.id, {
            onSuccess: () => {
                setConfirm(null)
                notify('success', t('versions.notice.deleted'))
            },
            onError: (err) => {
                setConfirm(null)
                notifyBlocked(err)
            },
        })
    }

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        return confirm.kind === 'bulk'
            ? {
                  title: t('versions.confirm.bulk.title', { count: confirm.ids.length }),
                  description: t('versions.confirm.bulk.description'),
              }
            : {
                  title: t('versions.confirm.one.title', { n: confirm.version.version }),
                  description: t('versions.confirm.one.description'),
              }
    }, [confirm, t])

    const docStatus = errorStatus(docErr)
    const versionsStatus = errorStatus(error)
    const forbidden = !access.canRead || docStatus === 403 || versionsStatus === 403
    const missing = docStatus === 404 || versionsStatus === 404
    const canAdd = access.canCreate && !!doc && !doc.deleted_at

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
                {docLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : forbidden || missing ? (
                    <div className="space-y-4 text-center">
                        {forbidden ? <ManagementForbiddenState /> : <p className="py-16 text-muted-foreground">{t('states.notFound')}</p>}
                        <Button asChild variant="outline">
                            <Link to="/$tenant/document-management" params={{ tenant }}>{t('form.backToList')}</Link>
                        </Button>
                    </div>
                ) : docError || !doc ? (
                    <DepartmentErrorState message={t('states.viewError')} onRetry={() => refetchDoc()} />
                ) : (
                    <>
                        <div className="space-y-4">
                            <Button asChild variant="ghost" size="sm" className="-ms-2">
                                <Link to="/$tenant/document-management" params={{ tenant }}>
                                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                                    {t('form.backToList')}
                                </Link>
                            </Button>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('versions.title')}</h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <p className="truncate text-muted-foreground" dir="auto">{doc.title}</p>
                                        <DocumentStatusBadge status={doc.status} />
                                    </div>
                                </div>
                                {canAdd && (
                                    <Button onClick={handleAdd}>
                                        <Plus className="h-4 w-4" />
                                        {t('versions.add')}
                                    </Button>
                                )}
                            </div>
                            {doc.deleted_at && <p className="text-sm text-muted-foreground">{t('versions.inTrash')}</p>}
                        </div>

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {access.canDelete && versions.length > 0 && (
                            <DepartmentBulkBar
                                selectedCount={selection.selectedList.length}
                                allSelected={selection.allSelected}
                                onToggleAll={selection.toggleAll}
                                onClear={selection.clear}
                                actions={['delete']}
                                onAction={handleBulk}
                            />
                        )}

                        {isLoading ? (
                            <ManagementTableSkeleton rows={4} />
                        ) : isError ? (
                            <DepartmentErrorState message={errorMessage(error) ?? t('versions.loadError')} onRetry={() => refetch()} />
                        ) : versions.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-border bg-card py-14 text-center">
                                <p className="font-medium text-muted-foreground">{t('versions.emptyTitle')}</p>
                                <p className="mt-1 text-sm text-muted-foreground/70">{t('versions.emptyDescription')}</p>
                            </div>
                        ) : (
                            <VersionsTable
                                versions={versions}
                                bulkEnabled={access.canDelete}
                                selectedIds={selection.selectedIds}
                                previewingId={previewingId}
                                onToggleSelect={selection.toggle}
                                onPreview={handlePreview}
                                onEdit={handleEdit}
                                onDelete={handleAskDelete}
                            />
                        )}

                        <ProcessFilesPanel documentId={id} canEdit={doc.abilities.update} onNotify={notify} onBlocked={notifyBlocked} />
                    </>
                )}
            </main>

            {form && (
                <VersionFormDialog
                    key={form.version?.id ?? 'new'}
                    documentId={id}
                    version={form.version}
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                    onBlocked={handleFormBlocked}
                />
            )}

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={deleteMutation.isPending || bulkMutation.isPending}
                    onConfirm={runConfirm}
                    error={confirmError}
                    destructive
                    confirmLabel={t('versions.confirm.confirm')}
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
