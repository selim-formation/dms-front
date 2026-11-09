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
import TaskPageHeader from '../components/TaskPageHeader'
import TaskTabs from '../components/TaskTabs'
import TaskFilterBar from '../components/TaskFilterBar'
import TaskTable from '../components/TaskTable'
import TaskDetailsDialog from '../components/TaskDetailsDialog'
import TaskFormDialog from '../components/form/TaskFormDialog'
import { TaskEmptyState, TaskForbiddenState, TaskTableSkeleton } from '../components/TaskStates'
import { useTaskList } from '../hooks/useTaskList'
import { useTaskFilterState } from '../hooks/useTaskFilterState'
import { useTaskAccess } from '../hooks/useTaskAccess'
import { useTaskRowAction, type TaskRowAction } from '../hooks/useTaskRowAction'
import { useChangeTaskStatus } from '../hooks/useChangeTaskStatus'
import { useBulkTasks } from '../hooks/useBulkTasks'
import { bulkActionsFor, isSelectable } from '../utils/taskPayload'
import type { Task, TaskBulkAction, TaskStatus } from '../types/task.types'

type FormTarget = { mode: 'create' } | { mode: 'edit'; task: Task } | null
type ConfirmState = { kind: 'row'; action: TaskRowAction; task: Task } | { kind: 'bulk'; action: TaskBulkAction; ids: number[] } | null

export default function TaskManagementPage() {
    const { t } = useTranslation('taskManagement')
    const access = useTaskAccess()
    const state = useTaskFilterState()
    const { tasks, meta, isLoading, isFetching, isError, error, refetch } = useTaskList(state.filters)

    const bulkActions = useMemo(
        () => bulkActionsFor(state.tab, { delete: access.canDelete, restore: access.canRestore, forceDelete: access.canForceDelete }),
        [state.tab, access.canDelete, access.canRestore, access.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0

    // All-or-nothing bulk: only rows the server will accept can be selected.
    const selectableIds = useMemo(
        () => (bulkEnabled ? tasks.filter((x) => isSelectable(x, state.tab)).map((x) => x.id) : []),
        [tasks, state.tab, bulkEnabled],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), selectableIds)

    const [viewId, setViewId] = useState<number | null>(null)
    const [form, setForm] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useTaskRowAction('delete')
    const restoreMutation = useTaskRowAction('restore')
    const forceMutation = useTaskRowAction('force_delete')
    const rowMutations = { delete: deleteMutation, restore: restoreMutation, force_delete: forceMutation }
    const bulkMutation = useBulkTasks()
    const statusMutation = useChangeTaskStatus()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 hides actions, 404 means gone, 409 means the state changed: show the server's words (data is refreshed). */
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
    const handleView = useCallback((x: Task) => setViewId(x.id), [])
    const handleCreate = useCallback(() => setForm({ mode: 'create' }), [])
    const handleEdit = useCallback((x: Task) => {
        setViewId(null)
        setForm({ mode: 'edit', task: x })
    }, [])
    const askRow = useCallback((action: TaskRowAction) => (x: Task) => {
        setViewId(null)
        setConfirmError(null)
        setConfirm({ kind: 'row', action, task: x })
    }, [])
    const handleDelete = useMemo(() => askRow('delete'), [askRow])
    const handleRestore = useMemo(() => askRow('restore'), [askRow])
    const handleForceDelete = useMemo(() => askRow('force_delete'), [askRow])
    const handleBulkAction = useCallback(
        (action: TaskBulkAction) => {
            setConfirmError(null)
            setConfirm({ kind: 'bulk', action, ids: selection.selectedList })
        },
        [selection.selectedList],
    )

    const { mutate: changeStatus } = statusMutation
    const handleChangeStatus = useCallback(
        (x: Task, status: TaskStatus) =>
            changeStatus({ id: x.id, status }, { onError: notifyBlocked }),
        [changeStatus, notifyBlocked],
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
        (_saved: Task, mode: 'create' | 'edit') => {
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
                        // 422 names every task that blocked it: keep the dialog open so the user can deselect.
                        const blockers = errorList(err, 'ids')
                        if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                        setConfirm(null)
                        notifyBlocked(err)
                    },
                },
            )
            return
        }

        rowMutations[confirm.action].mutate(confirm.task.id, {
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
            description: t(`confirm.${confirm.action}.description`, { name: confirm.task.title }),
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
                    <TaskForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <TaskPageHeader canCreate={access.canCreate} onCreate={handleCreate} />
                        <TaskTabs value={state.tab} onChange={state.setTab} />

                        <TaskFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            priority={state.priority}
                            onPriorityChange={state.setPriority}
                            scope={state.scope}
                            onScopeChange={state.setScope}
                            sort={state.sort}
                            onSortChange={state.setSort}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {bulkEnabled && tasks.length > 0 && (
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
                            <TaskTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : tasks.length === 0 ? (
                            <TaskEmptyState tab={state.tab} />
                        ) : (
                            <>
                                <TaskTable
                                    tasks={tasks}
                                    tab={state.tab}
                                    bulkEnabled={bulkEnabled}
                                    selectedIds={selection.selectedIds}
                                    onToggleSelect={selection.toggle}
                                    onChangeStatus={handleChangeStatus}
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
                )}
            </main>

            <TaskDetailsDialog
                taskId={viewId}
                onOpenChange={closeView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />

            {form && (
                <TaskFormDialog
                    key={form.mode === 'edit' ? form.task.id : 'new'}
                    task={form.mode === 'edit' ? form.task : undefined}
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
