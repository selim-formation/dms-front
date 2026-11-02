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
import EmployeePageHeader from '../components/EmployeePageHeader'
import EmployeeFilterBar from '../components/EmployeeFilterBar'
import EmployeeGrid from '../components/EmployeeGrid'
import EmployeeFormDialog from '../components/EmployeeFormDialog'
import { EmployeeEmptyState, EmployeeGridSkeleton } from '../components/EmployeeStates'
import { useEmployeesList } from '../hooks/useEmployeesList'
import { useEmployeeFilterState } from '../hooks/useEmployeeFilterState'
import { useEmployeePermissions } from '../hooks/useEmployeePermissions'
import { useDeleteEmployee } from '../hooks/useDeleteEmployee'
import { useRestoreEmployee } from '../hooks/useRestoreEmployee'
import { useForceDeleteEmployee } from '../hooks/useForceDeleteEmployee'
import { useBulkEmployees } from '../hooks/useBulkEmployees'
import { EMPLOYEES_PER_PAGE } from '../utils/employeePayload'
import type { Employee, EmployeeBulkAction } from '../types/employee.types'

type FormTarget = { employee: Employee | null } | null

type ConfirmState =
    | { kind: 'delete' | 'restore' | 'forceDelete'; employee: Employee }
    | { kind: 'bulk'; action: EmployeeBulkAction; ids: number[] }
    | null

export default function EmployeesPage() {
    const { t } = useTranslation('employees')
    const permissions = useEmployeePermissions()
    const state = useEmployeeFilterState()
    const { employees, meta, isLoading, isFetching, isError, error, refetch } = useEmployeesList(state.filters)

    const pageIds = useMemo(() => employees.map((p) => p.id), [employees])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteEmployee()
    const restoreMutation = useRestoreEmployee()
    const forceMutation = useForceDeleteEmployee()
    const bulkMutation = useBulkEmployees()

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
    const handleEdit = useCallback((p: Employee) => setFormTarget({ employee: p }), [])
    const handleCreate = useCallback(() => setFormTarget({ employee: null }), [])
    const handleDelete = useCallback((p: Employee) => setConfirm({ kind: 'delete', employee: p }), [])
    const handleRestore = useCallback((p: Employee) => setConfirm({ kind: 'restore', employee: p }), [])
    const handleForceDelete = useCallback((p: Employee) => setConfirm({ kind: 'forceDelete', employee: p }), [])

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    const handleSaved = useCallback(
        (mode: 'created' | 'updated' | 'restored') => {
            setFormTarget(null)
            notify('success', t(`notice.${mode}`))
        },
        [notify, t],
    )

    const closeConfirm = useCallback((open: boolean) => !open && setConfirm(null), [])
    const closeForm = useCallback((open: boolean) => !open && setFormTarget(null), [])

    // Bulk actions for the current view + permissions (force delete has its own permission).
    const bulkActions = useMemo<EmployeeBulkAction[]>(() => {
        const list: EmployeeBulkAction[] = []
        if (state.trashed !== 'only' && permissions.canDelete) list.push('delete')
        if (state.trashed !== 'active' && permissions.canRestore) list.push('restore')
        if (state.trashed !== 'active' && permissions.canForceDelete) list.push('force_delete')
        return list
    }, [state.trashed, permissions])

    const handleBulkAction = useCallback(
        (action: EmployeeBulkAction) => setConfirm({ kind: 'bulk', action, ids: selection.selectedList }),
        [selection.selectedList],
    )

    const runConfirm = () => {
        if (!confirm) return
        const done = () => setConfirm(null)

        if (confirm.kind === 'bulk') {
            const total = confirm.ids.length
            bulkMutation.mutate(
                { action: confirm.action, ids: confirm.ids },
                {
                    onSuccess: (res) => {
                        selection.clear()
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

        const { kind, employee } = confirm
        const options = {
            onSuccess: () =>
                notify(
                    'success',
                    t(kind === 'delete' ? 'notice.deleted' : kind === 'restore' ? 'notice.restored' : 'notice.forceDeleted'),
                ),
            onError: notifyError,
            onSettled: done,
        }
        if (kind === 'delete') deleteMutation.mutate(employee.id, options)
        else if (kind === 'restore') restoreMutation.mutate(employee.id, options)
        else forceMutation.mutate(employee.id, options)
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
            description: t(`confirm.${confirm.kind}.description`, { name: confirm.employee.name }),
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
                    <EmployeePageHeader
                        canCreate={permissions.canCreate}
                        onCreate={handleCreate}
                        total={meta?.total ?? null}
                    />

                    <EmployeeFilterBar
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

                    {canBulk && employees.length > 0 && (
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
                        <EmployeeGridSkeleton count={EMPLOYEES_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : employees.length === 0 ? (
                        <EmployeeEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <EmployeeGrid
                                employees={employees}
                                permissions={permissions}
                                selectable={canBulk}
                                selectedIds={selection.selectedIds}
                                onToggleSelect={selection.toggle}
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
                <EmployeeFormDialog
                    key={formTarget.employee?.id ?? 'new'}
                    employee={formTarget.employee}
                    open
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                    canRestore={permissions.canRestore}
                />
            )}

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
