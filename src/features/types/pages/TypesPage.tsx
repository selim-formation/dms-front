import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentBulkBar from '@/features/departments/components/DepartmentBulkBar'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import DepartmentNotice, {
    type DepartmentNoticeData,
} from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useDepartmentSelection } from '@/features/departments/hooks/useDepartmentSelection'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import TypePageHeader from '../components/TypePageHeader'
import TypeFilterBar from '../components/TypeFilterBar'
import TypeGrid from '../components/TypeGrid'
import TypeFormDialog from '../components/TypeFormDialog'
import TypeDetailsDialog from '../components/TypeDetailsDialog'
import { TypeEmptyState, TypeGridSkeleton } from '../components/TypeStates'
import { pickTypeTitle } from '../components/TypeTitle'
import { useTypesList } from '../hooks/useTypesList'
import { useTypeFilterState } from '../hooks/useTypeFilterState'
import { useTypePermissions } from '../hooks/useTypePermissions'
import { useDeleteType } from '../hooks/useDeleteType'
import { useRestoreType } from '../hooks/useRestoreType'
import { useForceDeleteType } from '../hooks/useForceDeleteType'
import { useBulkTypes } from '../hooks/useBulkTypes'
import { TYPES_PER_PAGE } from '../utils/typePayload'
import type { DocumentType, TypeBulkAction } from '../types/type.types'

type FormTarget = { type: DocumentType | null } | null

type ConfirmState =
    | { kind: 'delete' | 'restore' | 'forceDelete'; type: DocumentType }
    | { kind: 'bulk'; action: TypeBulkAction; ids: number[] }
    | null

const IMAGE_REFETCH_COOLDOWN_MS = 15_000

export default function TypesPage() {
    const { t, i18n } = useTranslation('types')
    const permissions = useTypePermissions()
    const state = useTypeFilterState()
    const { types, meta, isLoading, isFetching, isError, error, refetch } = useTypesList(state.filters)

    const pageIds = useMemo(() => types.map((x) => x.id), [types])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [viewId, setViewId] = useState<number | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteType()
    const restoreMutation = useRestoreType()
    const forceMutation = useForceDeleteType()
    const bulkMutation = useBulkTypes()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
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

    // Stable row callbacks (cards are memoised)
    const handleView = useCallback((x: DocumentType) => setViewId(x.id), [])
    const handleEdit = useCallback((x: DocumentType) => setFormTarget({ type: x }), [])
    const handleCreate = useCallback(() => setFormTarget({ type: null }), [])
    const handleDelete = useCallback((x: DocumentType) => setConfirm({ kind: 'delete', type: x }), [])
    const handleRestore = useCallback((x: DocumentType) => setConfirm({ kind: 'restore', type: x }), [])
    const handleForceDelete = useCallback((x: DocumentType) => setConfirm({ kind: 'forceDelete', type: x }), [])

    // Signed image URLs expire: refetch (rate-limited) when one fails to load.
    const lastImageRefetch = useRef(0)
    const handleImageError = useCallback(() => {
        const now = Date.now()
        if (now - lastImageRefetch.current < IMAGE_REFETCH_COOLDOWN_MS) return
        lastImageRefetch.current = now
        refetch()
    }, [refetch])

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    const handleSaved = useCallback(
        (mode: 'created' | 'updated') => {
            setFormTarget(null)
            notify('success', t(mode === 'created' ? 'notice.created' : 'notice.updated'))
        },
        [notify, t],
    )

    const closeConfirm = useCallback((open: boolean) => !open && setConfirm(null), [])

    // Bulk actions for the current view + permissions (force delete needs delete_types).
    const bulkActions = useMemo<TypeBulkAction[]>(() => {
        const list: TypeBulkAction[] = []
        if (state.trashed !== 'only' && permissions.canDelete) list.push('delete')
        if (state.trashed !== 'active' && permissions.canRestore) list.push('restore')
        if (state.trashed !== 'active' && permissions.canForceDelete) list.push('force_delete')
        return list
    }, [state.trashed, permissions])

    const handleBulkAction = useCallback(
        (action: TypeBulkAction) => setConfirm({ kind: 'bulk', action, ids: selection.selectedList }),
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

        const { kind, type } = confirm
        const options = {
            onSuccess: () =>
                notify(
                    'success',
                    t(kind === 'delete' ? 'notice.deleted' : kind === 'restore' ? 'notice.restored' : 'notice.forceDeleted'),
                ),
            onError: notifyError,
            onSettled: done,
        }
        if (kind === 'delete') deleteMutation.mutate(type.id, options)
        else if (kind === 'restore') restoreMutation.mutate(type.id, options)
        else forceMutation.mutate(type.id, options)
    }

    const confirmPending =
        deleteMutation.isPending || restoreMutation.isPending || forceMutation.isPending || bulkMutation.isPending

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        if (confirm.kind === 'bulk') {
            const key =
                confirm.action === 'delete' ? 'bulkDelete' : confirm.action === 'restore' ? 'bulkRestore' : 'bulkForceDelete'
            return {
                title: t(`confirm.${key}.title`, { count: confirm.ids.length }),
                description: t(`confirm.${key}.description`),
                confirmLabel: t(`confirm.${key}.confirm`),
                destructive: confirm.action !== 'restore',
            }
        }
        return {
            title: t(`confirm.${confirm.kind}.title`),
            description: t(`confirm.${confirm.kind}.description`, {
                title: pickTypeTitle(confirm.type, i18n.language) ?? t('card.untitled'),
            }),
            confirmLabel: t(`confirm.${confirm.kind}.confirm`),
            destructive: confirm.kind !== 'restore',
        }
    }, [confirm, t, i18n.language])

    const canBulk = bulkActions.length > 0
    const showTrashedFilter = permissions.canRestore || permissions.canForceDelete

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <TypePageHeader
                        canCreate={permissions.canCreate}
                        onCreate={handleCreate}
                        total={meta?.total ?? null}
                    />

                    <TypeFilterBar
                        search={state.search}
                        onSearchChange={state.setSearch}
                        trashed={state.trashed}
                        onTrashedChange={state.setTrashed}
                        sort={state.sort}
                        onSortChange={state.setSort}
                        showTrashedFilter={showTrashedFilter}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && types.length > 0 && (
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
                        <TypeGridSkeleton count={TYPES_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : types.length === 0 ? (
                        <TypeEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <TypeGrid
                                types={types}
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
                <TypeFormDialog
                    key={formTarget.type?.id ?? 'new'}
                    type={formTarget.type}
                    open
                    onOpenChange={(open) => !open && setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            <TypeDetailsDialog typeId={viewId} onOpenChange={(open) => !open && setViewId(null)} />

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
