import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentPageHeader from '../components/DepartmentPageHeader'
import DepartmentStatsRow from '../components/DepartmentStatsRow'
import DepartmentFilterBar from '../components/DepartmentFilterBar'
import DepartmentBulkBar from '../components/DepartmentBulkBar'
import DepartmentGrid from '../components/DepartmentGrid'
import DepartmentPagination from '../components/DepartmentPagination'
import DepartmentNotice, { type DepartmentNoticeData } from '../components/DepartmentNotice'
import DepartmentFormDialog from '../components/DepartmentFormDialog'
import DepartmentDetailsDialog from '../components/DepartmentDetailsDialog'
import DepartmentConfirmDialog from '../components/DepartmentConfirmDialog'
import {
    DepartmentEmptyState,
    DepartmentErrorState,
    DepartmentGridSkeleton,
} from '../components/DepartmentStates'
import { useDepartmentsList } from '../hooks/useDepartmentsList'
import { useDepartmentFilterState } from '../hooks/useDepartmentFilterState'
import { useDepartmentSelection } from '../hooks/useDepartmentSelection'
import { useDepartmentPermissions } from '../hooks/useDepartmentPermissions'
import { useDeleteDepartment } from '../hooks/useDeleteDepartment'
import { useRestoreDepartment } from '../hooks/useRestoreDepartment'
import { useForceDeleteDepartment } from '../hooks/useForceDeleteDepartment'
import { useBulkDepartments } from '../hooks/useBulkDepartments'
import { errorMessage, errorStatus } from '../utils/departmentErrors'
import { DEPARTMENTS_PER_PAGE } from '../utils/departmentPayload'
import type { Department, DepartmentBulkAction } from '../types/department.types'

type FormTarget = { department: Department | null } | null

type ConfirmState =
    | { kind: 'delete' | 'restore' | 'forceDelete'; department: Department }
    | { kind: 'bulk'; action: DepartmentBulkAction; ids: number[] }
    | null

const IMAGE_REFETCH_COOLDOWN_MS = 15_000

export default function DepartmentsPage() {
    const { t } = useTranslation('departments')
    const permissions = useDepartmentPermissions()
    const state = useDepartmentFilterState()
    const { departments, meta, isLoading, isFetching, isError, error, refetch } = useDepartmentsList(
        state.filters,
    )

    const pageIds = useMemo(() => departments.map((d) => d.id), [departments])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [viewId, setViewId] = useState<number | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteDepartment()
    const restoreMutation = useRestoreDepartment()
    const forceMutation = useForceDeleteDepartment()
    const bulkMutation = useBulkDepartments()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) =>
            setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    const notifyError = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 404) return notify('error', t('notice.notFound'))
            if (status === 403) return notify('error', t('notice.forbidden'))
            notify('error', errorMessage(err) ?? t('page.errorTitle'))
        },
        [notify, t],
    )

    // ── Stable row callbacks (cards are memoised) ─────────────────────────
    const handleView = useCallback((d: Department) => setViewId(d.id), [])
    const handleEdit = useCallback((d: Department) => setFormTarget({ department: d }), [])
    const handleCreate = useCallback(() => setFormTarget({ department: null }), [])
    const handleDelete = useCallback((d: Department) => setConfirm({ kind: 'delete', department: d }), [])
    const handleRestore = useCallback((d: Department) => setConfirm({ kind: 'restore', department: d }), [])
    const handleForceDelete = useCallback(
        (d: Department) => setConfirm({ kind: 'forceDelete', department: d }),
        [],
    )

    // Signed image URLs expire: refetch (rate-limited) when one fails to load.
    const lastImageRefetch = useRef(0)
    const handleImageError = useCallback(() => {
        const now = Date.now()
        if (now - lastImageRefetch.current < IMAGE_REFETCH_COOLDOWN_MS) return
        lastImageRefetch.current = now
        refetch()
    }, [refetch])

    const handlePageChange = useCallback(
        (next: number) => {
            state.setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.setPage],
    )

    const handleSaved = useCallback(
        (mode: 'created' | 'updated') => {
            setFormTarget(null)
            notify('success', t(mode === 'created' ? 'notice.created' : 'notice.updated'))
        },
        [notify, t],
    )

    const closeConfirm = useCallback((open: boolean) => !open && setConfirm(null), [])

    // ── Bulk actions available for the current view + permissions ─────────
    const bulkActions = useMemo<DepartmentBulkAction[]>(() => {
        const list: DepartmentBulkAction[] = []
        if (state.trashed !== 'only' && permissions.canDelete) list.push('delete')
        if (state.trashed !== 'active' && permissions.canRestore) list.push('restore')
        if (state.trashed !== 'active' && permissions.canForceDelete) list.push('force_delete')
        return list
    }, [state.trashed, permissions])

    const handleBulkAction = useCallback(
        (action: DepartmentBulkAction) =>
            setConfirm({ kind: 'bulk', action, ids: selection.selectedList }),
        [selection.selectedList],
    )

    const runConfirm = () => {
        if (!confirm) return
        const done = () => setConfirm(null)

        if (confirm.kind === 'bulk') {
            bulkMutation.mutate(
                { action: confirm.action, ids: confirm.ids },
                {
                    onSuccess: (res) => {
                        selection.clear()
                        const total = confirm.ids.length
                        notify(
                            'success',
                            t(res.processed < total ? 'notice.bulkSkipped' : 'notice.bulkDone', {
                                processed: res.processed,
                                total,
                            }),
                        )
                    },
                    onError: notifyError,
                    onSettled: done,
                },
            )
            return
        }

        const { kind, department } = confirm
        const options = {
            onSuccess: () =>
                notify(
                    'success',
                    t(
                        kind === 'delete'
                            ? 'notice.deleted'
                            : kind === 'restore'
                              ? 'notice.restored'
                              : 'notice.forceDeleted',
                    ),
                ),
            onError: notifyError,
            onSettled: done,
        }
        if (kind === 'delete') deleteMutation.mutate(department.id, options)
        else if (kind === 'restore') restoreMutation.mutate(department.id, options)
        else forceMutation.mutate(department.id, options)
    }

    const confirmPending =
        deleteMutation.isPending || restoreMutation.isPending || forceMutation.isPending || bulkMutation.isPending

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        if (confirm.kind === 'bulk') {
            const key =
                confirm.action === 'delete'
                    ? 'bulkDelete'
                    : confirm.action === 'restore'
                      ? 'bulkRestore'
                      : 'bulkForceDelete'
            return {
                title: t(`confirm.${key}.title`, { count: confirm.ids.length }),
                description: t(`confirm.${key}.description`),
                confirmLabel: t(`confirm.${key}.confirm`),
                destructive: confirm.action !== 'restore',
            }
        }
        return {
            title: t(`confirm.${confirm.kind}.title`),
            description: t(`confirm.${confirm.kind}.description`, { title: confirm.department.title }),
            confirmLabel: t(`confirm.${confirm.kind}.confirm`),
            destructive: confirm.kind !== 'restore',
        }
    }, [confirm, t])

    const canBulk = bulkActions.length > 0
    const showTrashedFilter = permissions.canRestore || permissions.canForceDelete

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <DepartmentPageHeader canCreate={permissions.canCreate} onCreate={handleCreate} />

                    <DepartmentStatsRow />

                    <DepartmentFilterBar
                        search={state.search}
                        onSearchChange={state.setSearch}
                        trashed={state.trashed}
                        onTrashedChange={state.setTrashed}
                        sort={state.sort}
                        onSortChange={state.setSort}
                        hasImage={state.hasImage}
                        onHasImageToggle={state.toggleHasImage}
                        createdThisMonth={state.createdThisMonth}
                        onCreatedThisMonthToggle={state.toggleCreatedThisMonth}
                        sectionIds={state.sectionIds}
                        onSectionIdsChange={state.setSectionIds}
                        showTrashedFilter={showTrashedFilter}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && departments.length > 0 && (
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
                        <DepartmentGridSkeleton count={DEPARTMENTS_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState
                            message={error?.message || t('page.errorTitle')}
                            onRetry={() => refetch()}
                        />
                    ) : departments.length === 0 ? (
                        <DepartmentEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <DepartmentGrid
                                departments={departments}
                                permissions={permissions}
                                selectable={canBulk}
                                selectedIds={selection.selectedIds}
                                onToggleSelect={selection.toggle}
                                onImageError={handleImageError}
                                onView={handleView}
                                onEdit={handleEdit}
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
            </main>

            {formTarget && (
                <DepartmentFormDialog
                    key={formTarget.department?.id ?? 'new'}
                    department={formTarget.department}
                    open
                    onOpenChange={(open) => !open && setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            <DepartmentDetailsDialog
                departmentId={viewId}
                onOpenChange={(open) => !open && setViewId(null)}
            />

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={confirmPending}
                    onConfirm={runConfirm}
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
