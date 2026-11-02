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
import ProjectPageHeader from '../components/ProjectPageHeader'
import ProjectFilterBar from '../components/ProjectFilterBar'
import ProjectGrid from '../components/ProjectGrid'
import ProjectFormDialog from '../components/ProjectFormDialog'
import { ProjectEmptyState, ProjectGridSkeleton } from '../components/ProjectStates'
import { useProjectsList } from '../hooks/useProjectsList'
import { useProjectFilterState } from '../hooks/useProjectFilterState'
import { useProjectPermissions } from '../hooks/useProjectPermissions'
import { useDeleteProject } from '../hooks/useDeleteProject'
import { useRestoreProject } from '../hooks/useRestoreProject'
import { useForceDeleteProject } from '../hooks/useForceDeleteProject'
import { useBulkProjects } from '../hooks/useBulkProjects'
import { PROJECTS_PER_PAGE } from '../utils/projectPayload'
import type { Project, ProjectBulkAction } from '../types/project.types'

type FormTarget = { project: Project | null } | null

type ConfirmState =
    | { kind: 'delete' | 'restore' | 'forceDelete'; project: Project }
    | { kind: 'bulk'; action: ProjectBulkAction; ids: number[] }
    | null

export default function ProjectsPage() {
    const { t } = useTranslation('projects')
    const permissions = useProjectPermissions()
    const state = useProjectFilterState()
    const { projects, meta, isLoading, isFetching, isError, error, refetch } = useProjectsList(state.filters)

    const pageIds = useMemo(() => projects.map((p) => p.id), [projects])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteProject()
    const restoreMutation = useRestoreProject()
    const forceMutation = useForceDeleteProject()
    const bulkMutation = useBulkProjects()

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
    const handleEdit = useCallback((p: Project) => setFormTarget({ project: p }), [])
    const handleCreate = useCallback(() => setFormTarget({ project: null }), [])
    const handleDelete = useCallback((p: Project) => setConfirm({ kind: 'delete', project: p }), [])
    const handleRestore = useCallback((p: Project) => setConfirm({ kind: 'restore', project: p }), [])
    const handleForceDelete = useCallback((p: Project) => setConfirm({ kind: 'forceDelete', project: p }), [])

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
    const closeForm = useCallback((open: boolean) => !open && setFormTarget(null), [])

    // Bulk actions for the current view + permissions (force delete has its own permission).
    const bulkActions = useMemo<ProjectBulkAction[]>(() => {
        const list: ProjectBulkAction[] = []
        if (state.trashed !== 'only' && permissions.canDelete) list.push('delete')
        if (state.trashed !== 'active' && permissions.canRestore) list.push('restore')
        if (state.trashed !== 'active' && permissions.canForceDelete) list.push('force_delete')
        return list
    }, [state.trashed, permissions])

    const handleBulkAction = useCallback(
        (action: ProjectBulkAction) => setConfirm({ kind: 'bulk', action, ids: selection.selectedList }),
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

        const { kind, project } = confirm
        const options = {
            onSuccess: () =>
                notify(
                    'success',
                    t(kind === 'delete' ? 'notice.deleted' : kind === 'restore' ? 'notice.restored' : 'notice.forceDeleted'),
                ),
            onError: notifyError,
            onSettled: done,
        }
        if (kind === 'delete') deleteMutation.mutate(project.id, options)
        else if (kind === 'restore') restoreMutation.mutate(project.id, options)
        else forceMutation.mutate(project.id, options)
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
            description: t(`confirm.${confirm.kind}.description`, { name: confirm.project.name }),
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
                    <ProjectPageHeader
                        canCreate={permissions.canCreate}
                        onCreate={handleCreate}
                        total={meta?.total ?? null}
                    />

                    <ProjectFilterBar
                        search={state.search}
                        onSearchChange={state.setSearch}
                        trashed={state.trashed}
                        onTrashedChange={state.setTrashed}
                        sort={state.sort}
                        onSortChange={state.setSort}
                        status={state.status}
                        onStatusChange={state.setStatus}
                        type={state.type}
                        onTypeChange={state.setType}
                        showTrashedFilter={showTrashedFilter}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && projects.length > 0 && (
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
                        <ProjectGridSkeleton count={PROJECTS_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : projects.length === 0 ? (
                        <ProjectEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <ProjectGrid
                                projects={projects}
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
                <ProjectFormDialog
                    key={formTarget.project?.id ?? 'new'}
                    project={formTarget.project}
                    open
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
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
