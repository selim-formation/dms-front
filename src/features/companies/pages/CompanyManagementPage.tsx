import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentBulkBar from '@/features/departments/components/DepartmentBulkBar'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useRowSelection } from '@/shared/hooks/useRowSelection'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { errorList } from '@/features/roles/utils/roleErrors'
import CompanyPageHeader from '../components/CompanyPageHeader'
import CompanyTabs from '../components/CompanyTabs'
import CompanyFilterBar from '../components/CompanyFilterBar'
import CompanyTable from '../components/CompanyTable'
import CompanyDetailsDialog from '../components/CompanyDetailsDialog'
import CompanyFormDialog from '../components/form/CompanyFormDialog'
import { CompanyEmptyState, CompanyForbiddenState, CompanyTableSkeleton } from '../components/CompanyStates'
import { useCompanyList } from '../hooks/useCompanyList'
import { useCompanyFilterState } from '../hooks/useCompanyFilterState'
import { useCompanyAccess } from '../hooks/useCompanyAccess'
import { useCompanyRowAction } from '../hooks/useCompanyRowAction'
import { useBulkCompanies } from '../hooks/useBulkCompanies'
import { bulkActionsFor, isSelectable } from '../utils/companyPayload'
import type { Company, CompanyBulkAction, CompanyRowAction } from '../types/company.types'

/** `companyId: null` = create. */
type FormTarget = { companyId: string | null } | null
type ConfirmState =
    | { kind: 'row'; action: CompanyRowAction; company: Company }
    | { kind: 'bulk'; action: CompanyBulkAction; ids: string[] }
    | null

export default function CompanyManagementPage() {
    const { t } = useTranslation('companies')
    const navigate = useNavigate()
    const tenantId = useTenantId()
    const access = useCompanyAccess()
    const state = useCompanyFilterState()
    const { companies, meta, isLoading, isFetching, isError, error, refetch } = useCompanyList(state.filters)

    const bulkActions = useMemo(
        () => bulkActionsFor(state.tab, { delete: access.canDelete, restore: access.canRestore, forceDelete: access.canForceDelete }),
        [state.tab, access.canDelete, access.canRestore, access.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0

    // All-or-nothing bulk: only rows the server will accept can be selected.
    const selectableIds = useMemo(
        () => (bulkEnabled ? companies.filter((c) => isSelectable(c, state.tab)).map((c) => c.id) : []),
        [companies, state.tab, bulkEnabled],
    )
    const selection = useRowSelection<string>(JSON.stringify(state.filters), selectableIds)

    const [viewId, setViewId] = useState<string | null>(null)
    const [form, setForm] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useCompanyRowAction('delete')
    const restoreMutation = useCompanyRowAction('restore')
    const forceMutation = useCompanyRowAction('force_delete')
    const rowMutations = { delete: deleteMutation, restore: restoreMutation, force_delete: forceMutation }
    const bulkMutation = useBulkCompanies()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 hides actions, 404 means gone, 409 / 422 carry the server's words (the list is refreshed). */
    const notifyBlocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403) return notify('error', t('notice.forbidden'))
            if (status === 404) return notify('error', t('notice.notFound'))
            notify('error', errorMessage(err) ?? t('notice.failed'))
        },
        [notify, t],
    )

    /** Locking yourself out of the open company: go back to the company chooser. */
    const leaveIfCurrent = useCallback(
        (ids: string[]) => {
            if (tenantId && ids.includes(tenantId)) navigate({ to: '/' })
        },
        [tenantId, navigate],
    )

    // Stable row callbacks (rows are memoised)
    const handleView = useCallback((c: Company) => setViewId(c.id), [])
    const handleCreate = useCallback(() => setForm({ companyId: null }), [])
    const handleEdit = useCallback((c: Company) => {
        setViewId(null)
        setForm({ companyId: c.id })
    }, [])
    const askRow = useCallback(
        (action: CompanyRowAction) => (c: Company) => {
            setViewId(null)
            setConfirmError(null)
            setConfirm({ kind: 'row', action, company: c })
        },
        [],
    )
    const handleDelete = useMemo(() => askRow('delete'), [askRow])
    const handleRestore = useMemo(() => askRow('restore'), [askRow])
    const handleForceDelete = useMemo(() => askRow('force_delete'), [askRow])
    const handleBulkAction = useCallback(
        (action: CompanyBulkAction) => {
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
        (_saved: Company, mode: 'create' | 'edit') => {
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

    /**
     * 409 (not empty, wrong state) and 422 (`errors.ids`) explain themselves: keep the dialog open
     * so the user can read why. 403 / 404 close it with a notice.
     */
    const handleConfirmError = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            const blockers = errorList(err, 'ids')
            if (status === 422 && blockers.length) return setConfirmError(blockers.join(' '))
            if (status === 409) return setConfirmError(errorMessage(err) ?? t('notice.failed'))
            setConfirm(null)
            notifyBlocked(err)
        },
        [notifyBlocked, t],
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
                        if (confirm.action !== 'restore') leaveIfCurrent(confirm.ids)
                    },
                    onError: handleConfirmError,
                },
            )
            return
        }

        rowMutations[confirm.action].mutate(confirm.company.id, {
            onSuccess: () => {
                setConfirm(null)
                notify('success', t(`notice.${confirm.action}`))
                if (confirm.action !== 'restore') leaveIfCurrent([confirm.company.id])
            },
            onError: handleConfirmError,
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
            description: t(`confirm.${confirm.action}.description`, { name: confirm.company.name }),
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
                    <CompanyForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <CompanyPageHeader canCreate={access.canCreate} onCreate={handleCreate} />
                        <CompanyTabs value={state.tab} onChange={state.setTab} />

                        <CompanyFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            hasLogo={state.hasLogo}
                            onHasLogoToggle={state.toggleHasLogo}
                            createdThisMonth={state.createdThisMonth}
                            onCreatedThisMonthToggle={state.toggleCreatedThisMonth}
                            permissionId={state.permissionId}
                            onPermissionChange={state.setPermissionId}
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
                            <CompanyTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : companies.length === 0 ? (
                            <CompanyEmptyState tab={state.tab} />
                        ) : (
                            <>
                                <CompanyTable
                                    companies={companies}
                                    tab={state.tab}
                                    currentTenantId={tenantId}
                                    bulkEnabled={bulkEnabled}
                                    selectedIds={selection.selectedIds}
                                    onToggleSelect={selection.toggle}
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

            <CompanyDetailsDialog
                companyId={viewId}
                onOpenChange={closeView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />

            {form && (
                <CompanyFormDialog
                    key={form.companyId ?? 'new'}
                    companyId={form.companyId}
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
