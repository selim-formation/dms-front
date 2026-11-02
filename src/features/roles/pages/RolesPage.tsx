import { useCallback, useMemo, useState } from 'react'
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
import RolePageHeader from '../components/RolePageHeader'
import RoleFilterBar from '../components/RoleFilterBar'
import RoleGrid from '../components/RoleGrid'
import RoleFormDialog from '../components/RoleFormDialog'
import RoleDetailsDialog from '../components/RoleDetailsDialog'
import { RoleEmptyState, RoleGridSkeleton } from '../components/RoleStates'
import { useRolesList } from '../hooks/useRolesList'
import { useRoleFilterState } from '../hooks/useRoleFilterState'
import { useRoleAccess } from '../hooks/useRoleAccess'
import { useDeleteRole } from '../hooks/useDeleteRole'
import { useBulkDeleteRoles } from '../hooks/useBulkDeleteRoles'
import { errorList } from '../utils/roleErrors'
import { ROLES_PER_PAGE, getDeleteBlock } from '../utils/rolePayload'
import type { Role } from '../types/role.types'

/** `roleId: null` = create. */
type FormTarget = { roleId: number | null } | null
type ConfirmState = { kind: 'delete'; role: Role } | { kind: 'bulk'; ids: number[] } | null

const BULK_ACTIONS = ['delete'] as const

export default function RolesPage() {
    const { t } = useTranslation('roles')
    const access = useRoleAccess()
    const state = useRoleFilterState()
    const { roles, meta, isLoading, isFetching, isError, error, refetch } = useRolesList(state.filters)

    // System / in-use roles can't be deleted, and one of them fails a whole bulk call: never selectable.
    const deletableIds = useMemo(
        () => roles.filter((r) => getDeleteBlock(r) === null).map((r) => r.id),
        [roles],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), deletableIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [viewId, setViewId] = useState<number | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteRole()
    const bulkMutation = useBulkDeleteRoles()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    // Stable row callbacks (cards are memoised)
    const handleView = useCallback((r: Role) => setViewId(r.id), [])
    const handleEdit = useCallback((r: Role) => setFormTarget({ roleId: r.id }), [])
    const handleCreate = useCallback(() => setFormTarget({ roleId: null }), [])
    const handleDelete = useCallback((r: Role) => {
        setConfirmError(null)
        setConfirm({ kind: 'delete', role: r })
    }, [])
    const handleBulkAction = useCallback(() => {
        setConfirmError(null)
        setConfirm({ kind: 'bulk', ids: selection.selectedList })
    }, [selection.selectedList])

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

    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])
    const closeForm = useCallback((open: boolean) => !open && setFormTarget(null), [])
    const closeView = useCallback((open: boolean) => !open && setViewId(null), [])

    /** 404/403 close the dialog with a notice; business refusals (422) stay in the dialog. */
    const handleConfirmError = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 404 || status === 403) {
                setConfirm(null)
                notify('error', t(status === 404 ? 'notice.notFound' : 'notice.forbidden'))
                return
            }
            const refusals = errorList(err, 'ids')
            setConfirmError(refusals.length ? refusals.join(' ') : (errorMessage(err) ?? t('page.errorTitle')))
        },
        [notify, t],
    )

    const runConfirm = () => {
        if (!confirm) return

        if (confirm.kind === 'bulk') {
            const total = confirm.ids.length
            bulkMutation.mutate(confirm.ids, {
                onSuccess: (res) => {
                    selection.clear()
                    setConfirm(null)
                    notify(
                        'success',
                        t(res.processed < total ? 'notice.bulkSkipped' : 'notice.bulkDone', {
                            processed: res.processed,
                            total,
                        }),
                    )
                },
                onError: handleConfirmError,
            })
            return
        }

        deleteMutation.mutate(confirm.role.id, {
            onSuccess: () => {
                setConfirm(null)
                notify('success', t('notice.deleted'))
            },
            onError: handleConfirmError,
        })
    }

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        if (confirm.kind === 'bulk') {
            return {
                title: t('confirm.bulkDelete.title', { count: confirm.ids.length }),
                description: t('confirm.bulkDelete.description'),
                confirmLabel: t('confirm.bulkDelete.confirm'),
            }
        }
        return {
            title: t('confirm.delete.title'),
            description: t('confirm.delete.description', { name: confirm.role.name }),
            confirmLabel: t('confirm.delete.confirm'),
        }
    }, [confirm, t])

    const canBulk = access.canDelete

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <RolePageHeader canCreate={access.canCreate} onCreate={handleCreate} />

                    <RoleFilterBar
                        search={state.search}
                        onSearchChange={state.setSearch}
                        sort={state.sort}
                        onSortChange={state.setSort}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && deletableIds.length > 0 && (
                        <DepartmentBulkBar
                            selectedCount={selection.selectedList.length}
                            allSelected={selection.allSelected}
                            onToggleAll={selection.toggleAll}
                            onClear={selection.clear}
                            actions={[...BULK_ACTIONS]}
                            onAction={handleBulkAction}
                        />
                    )}

                    {isLoading ? (
                        <RoleGridSkeleton count={ROLES_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : roles.length === 0 ? (
                        <RoleEmptyState canCreate={access.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <RoleGrid
                                roles={roles}
                                access={access}
                                selectable={canBulk}
                                selectedIds={selection.selectedIds}
                                onToggleSelect={selection.toggle}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
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
                <RoleFormDialog
                    key={formTarget.roleId ?? 'new'}
                    roleId={formTarget.roleId}
                    open
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                />
            )}

            <RoleDetailsDialog roleId={viewId} onOpenChange={closeView} />

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={deleteMutation.isPending || bulkMutation.isPending}
                    onConfirm={runConfirm}
                    error={confirmError}
                    destructive
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
