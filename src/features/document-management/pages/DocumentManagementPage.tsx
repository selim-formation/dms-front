import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentBulkBar from '@/features/departments/components/DepartmentBulkBar'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useDepartmentSelection } from '@/features/departments/hooks/useDepartmentSelection'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { errorList } from '@/features/roles/utils/roleErrors'
import ManagementPageHeader from '../components/ManagementPageHeader'
import ManagementTabs from '../components/ManagementTabs'
import ManagementFilterBar from '../components/ManagementFilterBar'
import ManagementTable from '../components/ManagementTable'
import ManagementDetailsDialog from '../components/ManagementDetailsDialog'
import ReviewDialog from '../components/ReviewDialog'
import {
    ManagementEmptyState,
    ManagementForbiddenState,
    ManagementTableSkeleton,
} from '../components/ManagementStates'
import { useManagedDocuments } from '../hooks/useManagedDocuments'
import { useManagementFilterState } from '../hooks/useManagementFilterState'
import { useManagementAccess } from '../hooks/useManagementAccess'
import { useDocumentRowAction, type RowAction } from '../hooks/useDocumentRowAction'
import { useBulkDocuments } from '../hooks/useBulkDocuments'
import { bulkActionsFor, isSelectable } from '../utils/managementPayload'
import type { BulkAction, ManagedDocument, ReviewDecision } from '../types/management.types'

type ReviewTarget = { doc: ManagedDocument; decision: ReviewDecision } | null
type ConfirmState = { kind: 'row'; action: RowAction; doc: ManagedDocument } | { kind: 'bulk'; action: BulkAction; ids: number[] } | null

export default function DocumentManagementPage() {
    const { t } = useTranslation('management')
    const access = useManagementAccess()
    const state = useManagementFilterState()
    const { documents, meta, isLoading, isFetching, isError, error, refetch } = useManagedDocuments(state.filters)

    const bulkActions = useMemo(
        () => bulkActionsFor(state.tab, { delete: access.canDelete, restore: access.canRestore, forceDelete: access.canForceDelete }),
        [state.tab, access.canDelete, access.canRestore, access.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0

    // All-or-nothing bulk: only rows the server will accept can be selected.
    const selectableIds = useMemo(
        () => (bulkEnabled ? documents.filter((d) => isSelectable(d, state.tab)).map((d) => d.id) : []),
        [documents, state.tab, bulkEnabled],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), selectableIds)

    const [viewId, setViewId] = useState<number | null>(null)
    const [review, setReview] = useState<ReviewTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDocumentRowAction('delete')
    const restoreMutation = useDocumentRowAction('restore')
    const forceMutation = useDocumentRowAction('force_delete')
    const rowMutations = { delete: deleteMutation, restore: restoreMutation, force_delete: forceMutation }
    const bulkMutation = useBulkDocuments()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 / 404 / 409 → notice with the server's words (409 already refreshed the data). */
    const notifyBlocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403) return notify('error', t('notice.forbidden'))
            if (status === 404) return notify('error', t('notice.notFound'))
            notify('error', errorMessage(err) ?? t('notice.failed'))
        },
        [notify, t],
    )

    // Stable row callbacks (rows are memoised)
    const handleView = useCallback((d: ManagedDocument) => setViewId(d.id), [])
    const handleReview = useCallback((doc: ManagedDocument, decision: ReviewDecision) => setReview({ doc, decision }), [])
    // From the View dialog: close it, then open the review dialog.
    const handleReviewFromView = useCallback((doc: ManagedDocument, decision: ReviewDecision) => {
        setViewId(null)
        setReview({ doc, decision })
    }, [])
    const askRow = useCallback((action: RowAction) => (doc: ManagedDocument) => {
        setConfirmError(null)
        setConfirm({ kind: 'row', action, doc })
    }, [])
    const handleDelete = useMemo(() => askRow('delete'), [askRow])
    const handleRestore = useMemo(() => askRow('restore'), [askRow])
    const handleForceDelete = useMemo(() => askRow('force_delete'), [askRow])
    const handleBulkAction = useCallback(
        (action: BulkAction) => {
            setConfirmError(null)
            setConfirm({ kind: 'bulk', action, ids: selection.selectedList })
        },
        [selection.selectedList],
    )

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    const closeView = useCallback((open: boolean) => !open && setViewId(null), [])
    const closeReview = useCallback((open: boolean) => !open && setReview(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const handleReviewDone = useCallback(
        (decision: ReviewDecision) => {
            setReview(null)
            notify('success', t(`notice.${decision}`))
        },
        [notify, t],
    )
    const handleReviewBlocked = useCallback(
        (err: unknown) => {
            setReview(null)
            notifyBlocked(err)
        },
        [notifyBlocked],
    )

    const runConfirm = () => {
        if (!confirm) return

        if (confirm.kind === 'bulk') {
            bulkMutation.mutate(
                { action: confirm.action, ids: confirm.ids },
                {
                    onSuccess: (res) => {
                        selection.clear()
                        setConfirm(null)
                        notify('success', t(`notice.bulk.${confirm.action}`, { count: res.affected }))
                    },
                    onError: (err) => {
                        // 422 names every document that blocked it: keep the dialog open so the user can deselect.
                        const blockers = errorList(err, 'ids')
                        if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                        setConfirm(null)
                        notifyBlocked(err)
                    },
                },
            )
            return
        }

        rowMutations[confirm.action].mutate(confirm.doc.id, {
            onSuccess: () => {
                setConfirm(null)
                notify('success', t(`notice.${confirm.action}`))
            },
            onError: (err) => {
                setConfirm(null)
                notifyBlocked(err)
            },
        })
    }

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        if (confirm.kind === 'bulk') {
            return {
                title: t(`confirm.bulk.${confirm.action}.title`, { count: confirm.ids.length }),
                description: t(`confirm.bulk.${confirm.action}.description`),
                confirmLabel: t(`confirm.bulk.${confirm.action}.confirm`),
                destructive: confirm.action !== 'restore',
            }
        }
        return {
            title: t(`confirm.${confirm.action}.title`),
            description: t(`confirm.${confirm.action}.description`, { name: confirm.doc.title }),
            confirmLabel: t(`confirm.${confirm.action}.confirm`),
            destructive: confirm.action !== 'restore',
        }
    }, [confirm, t])

    const forbidden = !access.canRead || (isError && errorStatus(error) === 403)
    const pending = deleteMutation.isPending || restoreMutation.isPending || forceMutation.isPending || bulkMutation.isPending

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                {forbidden ? (
                    <ManagementForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <ManagementPageHeader />
                        <ManagementTabs value={state.tab} onChange={state.setTab} />

                        <ManagementFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            importance={state.importance}
                            onImportanceChange={state.setImportance}
                            category={state.category}
                            onCategoryChange={state.setCategory}
                            sort={state.sort}
                            onSortChange={state.setSort}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {bulkEnabled && documents.length > 0 && (
                            <DepartmentBulkBar
                                selectedCount={selection.selectedList.length}
                                allSelected={selection.allSelected}
                                onToggleAll={selection.toggleAll}
                                onClear={selection.clear}
                                actions={bulkActions}
                                onAction={handleBulkAction}
                            />
                        )}

                        {isLoading ? (
                            <ManagementTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : documents.length === 0 ? (
                            <ManagementEmptyState tab={state.tab} />
                        ) : (
                            <>
                                <ManagementTable
                                    documents={documents}
                                    tab={state.tab}
                                    bulkEnabled={bulkEnabled}
                                    selectedIds={selection.selectedIds}
                                    onToggleSelect={selection.toggle}
                                    onView={handleView}
                                    onReview={handleReview}
                                    onDelete={handleDelete}
                                    onRestore={handleRestore}
                                    onForceDelete={handleForceDelete}
                                />
                                <DepartmentPagination
                                    currentPage={meta?.current_page ?? state.page}
                                    lastPage={meta?.last_page ?? 1}
                                    onPageChange={handlePageChange}
                                    disabled={isFetching}
                                />
                            </>
                        )}
                    </div>
                )}
            </main>

            <ManagementDetailsDialog documentId={viewId} onOpenChange={closeView} onReview={handleReviewFromView} />

            {review && (
                <ReviewDialog
                    key={`${review.doc.id}-${review.decision}`}
                    doc={review.doc}
                    decision={review.decision}
                    onOpenChange={closeReview}
                    onDone={handleReviewDone}
                    onBlocked={handleReviewBlocked}
                />
            )}

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={pending}
                    onConfirm={runConfirm}
                    error={confirmError}
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
