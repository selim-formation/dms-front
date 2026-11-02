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
import EntityPageHeader from '../components/EntityPageHeader'
import EntityStatsRow from '../components/EntityStatsRow'
import EntityFilterBar from '../components/EntityFilterBar'
import EntityGrid from '../components/EntityGrid'
import EntityFormDialog from '../components/EntityFormDialog'
import EntityDetailsDialog from '../components/EntityDetailsDialog'
import { EntityEmptyState, EntityGridSkeleton } from '../components/EntityStates'
import { pickEntityTitle } from '../components/EntityTitle'
import { useEntitiesList } from '../hooks/useEntitiesList'
import { useEntityFilterState } from '../hooks/useEntityFilterState'
import { useEntityPermissions } from '../hooks/useEntityPermissions'
import { useDeleteEntity } from '../hooks/useDeleteEntity'
import { useRestoreEntity } from '../hooks/useRestoreEntity'
import { useForceDeleteEntity } from '../hooks/useForceDeleteEntity'
import { useBulkEntities } from '../hooks/useBulkEntities'
import { ENTITIES_PER_PAGE } from '../utils/entityPayload'
import type { DocumentEntity, EntityBulkAction } from '../types/entity.types'

type FormTarget = { entity: DocumentEntity | null } | null

type ConfirmState =
    | { kind: 'delete' | 'restore' | 'forceDelete'; entity: DocumentEntity }
    | { kind: 'bulk'; action: EntityBulkAction; ids: number[] }
    | null

const IMAGE_REFETCH_COOLDOWN_MS = 15_000

export default function EntitiesPage() {
    const { t, i18n } = useTranslation('entities')
    const permissions = useEntityPermissions()
    const state = useEntityFilterState()
    const { entities, meta, isLoading, isFetching, isError, error, refetch } = useEntitiesList(state.filters)

    const pageIds = useMemo(() => entities.map((x) => x.id), [entities])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [viewId, setViewId] = useState<number | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteEntity()
    const restoreMutation = useRestoreEntity()
    const forceMutation = useForceDeleteEntity()
    const bulkMutation = useBulkEntities()

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
    const handleView = useCallback((x: DocumentEntity) => setViewId(x.id), [])
    const handleEdit = useCallback((x: DocumentEntity) => setFormTarget({ entity: x }), [])
    const handleCreate = useCallback(() => setFormTarget({ entity: null }), [])
    const handleDelete = useCallback((x: DocumentEntity) => setConfirm({ kind: 'delete', entity: x }), [])
    const handleRestore = useCallback((x: DocumentEntity) => setConfirm({ kind: 'restore', entity: x }), [])
    const handleForceDelete = useCallback((x: DocumentEntity) => setConfirm({ kind: 'forceDelete', entity: x }), [])

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

    // Bulk actions for the current view + permissions (force delete needs delete_entities).
    const bulkActions = useMemo<EntityBulkAction[]>(() => {
        const list: EntityBulkAction[] = []
        if (state.trashed !== 'only' && permissions.canDelete) list.push('delete')
        if (state.trashed !== 'active' && permissions.canRestore) list.push('restore')
        if (state.trashed !== 'active' && permissions.canForceDelete) list.push('force_delete')
        return list
    }, [state.trashed, permissions])

    const handleBulkAction = useCallback(
        (action: EntityBulkAction) => setConfirm({ kind: 'bulk', action, ids: selection.selectedList }),
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

        const { kind, entity } = confirm
        const options = {
            onSuccess: () =>
                notify(
                    'success',
                    t(kind === 'delete' ? 'notice.deleted' : kind === 'restore' ? 'notice.restored' : 'notice.forceDeleted'),
                ),
            onError: notifyError,
            onSettled: done,
        }
        if (kind === 'delete') deleteMutation.mutate(entity.id, options)
        else if (kind === 'restore') restoreMutation.mutate(entity.id, options)
        else forceMutation.mutate(entity.id, options)
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
                title: pickEntityTitle(confirm.entity, i18n.language) ?? t('card.untitled'),
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
                    <EntityPageHeader
                        canCreate={permissions.canCreate}
                        onCreate={handleCreate}
                    />

                    <EntityStatsRow />

                    <EntityFilterBar
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
                        showTrashedFilter={showTrashedFilter}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && entities.length > 0 && (
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
                        <EntityGridSkeleton count={ENTITIES_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : entities.length === 0 ? (
                        <EntityEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <EntityGrid
                                entities={entities}
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
                <EntityFormDialog
                    key={formTarget.entity?.id ?? 'new'}
                    entity={formTarget.entity}
                    open
                    onOpenChange={(open) => !open && setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            <EntityDetailsDialog entityId={viewId} onOpenChange={(open) => !open && setViewId(null)} />

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
