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
import UserPageHeader from '../components/UserPageHeader'
import UserTabs from '../components/UserTabs'
import UserFilterBar from '../components/UserFilterBar'
import UserTable from '../components/UserTable'
import UserDetailsDialog from '../components/UserDetailsDialog'
import UserFormDialog from '../components/form/UserFormDialog'
import { UserEmptyState, UserForbiddenState, UserTableSkeleton } from '../components/UserStates'
import { useUserList } from '../hooks/useUserList'
import { useUserFilterState } from '../hooks/useUserFilterState'
import { useUserAccess } from '../hooks/useUserAccess'
import { useCurrentUserId } from '../hooks/useCurrentUserId'
import { useUserRowAction } from '../hooks/useUserRowAction'
import { useBulkUsers } from '../hooks/useBulkUsers'
import { bulkActionsFor, isSelectable } from '../utils/userPayload'
import type { ManagedUser, UserBulkAction, UserRowAction } from '../types/user.types'

type FormTarget = { mode: 'create' } | { mode: 'edit'; user: ManagedUser } | null
type ConfirmState =
    | { kind: 'row'; action: UserRowAction; user: ManagedUser }
    | { kind: 'bulk'; action: UserBulkAction; ids: number[] }
    | null

/** Actions that stop someone using the system or remove data are styled as destructive. */
const NON_DESTRUCTIVE: ReadonlySet<string> = new Set(['restore', 'activate'])

export default function UserManagementPage() {
    const { t } = useTranslation('users')
    const access = useUserAccess()
    const currentUserId = useCurrentUserId()
    const state = useUserFilterState()
    const { users, meta, isLoading, isFetching, isError, error, refetch } = useUserList(state.filters)

    const bulkActions = useMemo(
        () => bulkActionsFor(state.tab, { delete: access.canDelete, restore: access.canRestore, forceDelete: access.canForceDelete }),
        [state.tab, access.canDelete, access.canRestore, access.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0

    // All-or-nothing bulk: only rows the server will accept can be selected (never yourself).
    const selectableIds = useMemo(
        () => (bulkEnabled ? users.filter((u) => isSelectable(u, state.tab, currentUserId)).map((u) => u.id) : []),
        [users, state.tab, currentUserId, bulkEnabled],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), selectableIds)

    const [viewId, setViewId] = useState<number | null>(null)
    const [form, setForm] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useUserRowAction('delete')
    const restoreMutation = useUserRowAction('restore')
    const forceMutation = useUserRowAction('force_delete')
    const activateMutation = useUserRowAction('activate')
    const deactivateMutation = useUserRowAction('deactivate')
    const rowMutations = {
        delete: deleteMutation,
        restore: restoreMutation,
        force_delete: forceMutation,
        activate: activateMutation,
        deactivate: deactivateMutation,
    }
    const bulkMutation = useBulkUsers()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 hides actions, 404 means gone, 409 means the state changed or a rule blocks it: show the server's words. */
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
    const handleView = useCallback((u: ManagedUser) => setViewId(u.id), [])
    const handleCreate = useCallback(() => setForm({ mode: 'create' }), [])
    const handleEdit = useCallback((u: ManagedUser) => {
        setViewId(null)
        setForm({ mode: 'edit', user: u })
    }, [])
    const askRow = useCallback(
        (action: UserRowAction) => (u: ManagedUser) => {
            setViewId(null)
            setConfirmError(null)
            setConfirm({ kind: 'row', action, user: u })
        },
        [],
    )
    const handleActivate = useMemo(() => askRow('activate'), [askRow])
    const handleDeactivate = useMemo(() => askRow('deactivate'), [askRow])
    const handleDelete = useMemo(() => askRow('delete'), [askRow])
    const handleRestore = useMemo(() => askRow('restore'), [askRow])
    const handleForceDelete = useMemo(() => askRow('force_delete'), [askRow])
    const handleBulkAction = useCallback(
        (action: UserBulkAction) => {
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
    const closeForm = useCallback((open: boolean) => !open && setForm(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const handleSaved = useCallback(
        (_saved: ManagedUser, mode: 'create' | 'edit') => {
            setForm(null)
            notify('success', t(mode === 'create' ? 'notice.created' : 'notice.updated'))
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
            bulkMutation.mutate(
                { action: confirm.action, ids: confirm.ids },
                {
                    onSuccess: (res) => {
                        selection.clear()
                        setConfirm(null)
                        notify('success', t(`notice.bulk.${confirm.action}`, { count: res.affected }))
                    },
                    onError: (err) => {
                        // 422 names every user that blocked it: keep the dialog open so the list can be adjusted.
                        const blockers = errorList(err, 'ids')
                        if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                        setConfirm(null)
                        notifyBlocked(err)
                    },
                },
            )
            return
        }

        rowMutations[confirm.action].mutate(confirm.user.id, {
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
                destructive: !NON_DESTRUCTIVE.has(confirm.action),
            }
        }
        return {
            title: t(`confirm.${confirm.action}.title`),
            description: t(`confirm.${confirm.action}.description`, { name: confirm.user.name }),
            confirmLabel: t(`confirm.${confirm.action}.confirm`),
            destructive: !NON_DESTRUCTIVE.has(confirm.action),
        }
    }, [confirm, t])

    const forbidden = !access.canRead || (isError && errorStatus(error) === 403)
    const pending =
        deleteMutation.isPending ||
        restoreMutation.isPending ||
        forceMutation.isPending ||
        activateMutation.isPending ||
        deactivateMutation.isPending ||
        bulkMutation.isPending

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                {forbidden ? (
                    <UserForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <UserPageHeader canCreate={access.canCreate} onCreate={handleCreate} />
                        <UserTabs value={state.tab} onChange={state.setTab} />

                        <UserFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            roleId={state.roleId}
                            onRoleChange={state.setRoleId}
                            departmentId={state.departmentId}
                            onDepartmentChange={state.setDepartmentId}
                            sort={state.sort}
                            onSortChange={state.setSort}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {bulkEnabled && selectableIds.length > 0 && (
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
                            <UserTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : users.length === 0 ? (
                            <UserEmptyState tab={state.tab} />
                        ) : (
                            <>
                                <UserTable
                                    users={users}
                                    tab={state.tab}
                                    currentUserId={currentUserId}
                                    bulkEnabled={bulkEnabled}
                                    selectedIds={selection.selectedIds}
                                    onToggleSelect={selection.toggle}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onActivate={handleActivate}
                                    onDeactivate={handleDeactivate}
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

            <UserDetailsDialog
                userId={viewId}
                onOpenChange={closeView}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />

            {form && (
                <UserFormDialog
                    key={form.mode === 'edit' ? form.user.id : 'new'}
                    user={form.mode === 'edit' ? form.user : undefined}
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                    onBlocked={handleFormBlocked}
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
