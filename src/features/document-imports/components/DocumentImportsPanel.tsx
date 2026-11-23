import { memo, useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import ImportPageHeader from './ImportPageHeader'
import ImportFilterBar from './ImportFilterBar'
import ImportList from './ImportList'
import ImportFormDialog from './ImportFormDialog'
import { ImportBlockedState, ImportEmptyState, ImportListSkeleton } from './ImportStates'
import { useImportsList } from '../hooks/useImportsList'
import { useImportFilterState } from '../hooks/useImportFilterState'
import { useImportAccess } from '../hooks/useImportAccess'
import type { DocumentImport } from '../types/import.types'

/** The whole bulk-import workspace (list, filters, create dialog) without a page shell, so any page can host it. */
function DocumentImportsPanel() {
    const { t } = useTranslation('imports')
    const tenant = useTenantId() ?? ''
    const navigate = useNavigate()
    const access = useImportAccess()
    const state = useImportFilterState()
    const { imports, meta, isLoading, isFetching, isError, error, refetch } = useImportsList(state.filters)
    const [formOpen, setFormOpen] = useState(false)

    const openForm = useCallback(() => setFormOpen(true), [])
    const handleFormOpenChange = useCallback((open: boolean) => setFormOpen(open), [])
    const handleCreated = useCallback(
        (created: DocumentImport) => {
            setFormOpen(false)
            navigate({ to: '/$tenant/document-imports/$importId', params: { tenant, importId: String(created.id) } })
        },
        [navigate, tenant],
    )

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    // 403 hides the whole screen.
    const forbidden = !access.canRead || (isError && errorStatus(error) === 403)

    return (
        <>
            {forbidden ? (
                    <ImportBlockedState kind="forbidden" tenant={tenant} />
                ) : (
                    <div className="space-y-8">
                        <ImportPageHeader canCreate={access.canCreate} onCreate={openForm} />

                        <ImportFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            status={state.status}
                            onStatusChange={state.setStatus}
                            mode={state.mode}
                            onModeChange={state.setMode}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        {isLoading ? (
                            <ImportListSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : imports.length === 0 ? (
                            <ImportEmptyState canCreate={access.canCreate} onCreate={openForm} />
                        ) : (
                            <>
                                <ImportList items={imports} tenant={tenant} />
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
            {formOpen && <ImportFormDialog open onOpenChange={handleFormOpenChange} onCreated={handleCreated} />}
        </>
    )
}

export default memo(DocumentImportsPanel)
