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
import SectionPageHeader from '../components/SectionPageHeader'
import SectionStatsRow from '../components/SectionStatsRow'
import SectionFilterBar from '../components/SectionFilterBar'
import SectionGrid from '../components/SectionGrid'
import SectionFormDialog from '../components/SectionFormDialog'
import SectionDetailsDialog from '../components/SectionDetailsDialog'
import { SectionEmptyState, SectionGridSkeleton } from '../components/SectionStates'
import { useSectionsList } from '../hooks/useSectionsList'
import { useSectionFilterState } from '../hooks/useSectionFilterState'
import { useSectionPermissions } from '../hooks/useSectionPermissions'
import { useDeleteSection } from '../hooks/useDeleteSection'
import { useBulkDeleteSections } from '../hooks/useBulkDeleteSections'
import { SECTIONS_PER_PAGE } from '../utils/sectionPayload'
import type { Section } from '../types/section.types'

type FormTarget = { section: Section | null } | null
type ConfirmState = { kind: 'delete'; section: Section } | { kind: 'bulk'; ids: number[] } | null

const BULK_ACTIONS = ['delete'] as const
const IMAGE_REFETCH_COOLDOWN_MS = 15_000

export default function SectionsPage() {
    const { t } = useTranslation('sections')
    const permissions = useSectionPermissions()
    const state = useSectionFilterState()
    const { sections, meta, isLoading, isFetching, isError, error, refetch } = useSectionsList(state.filters)

    const pageIds = useMemo(() => sections.map((s) => s.id), [sections])
    const selection = useDepartmentSelection(JSON.stringify(state.filters), pageIds)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [viewId, setViewId] = useState<number | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useDeleteSection()
    const bulkMutation = useBulkDeleteSections()

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
    const handleView = useCallback((s: Section) => setViewId(s.id), [])
    const handleEdit = useCallback((s: Section) => setFormTarget({ section: s }), [])
    const handleCreate = useCallback(() => setFormTarget({ section: null }), [])
    const handleDelete = useCallback((s: Section) => setConfirm({ kind: 'delete', section: s }), [])

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
    const closeForm = useCallback((open: boolean) => !open && setFormTarget(null), [])
    const closeView = useCallback((open: boolean) => !open && setViewId(null), [])

    const handleBulkAction = useCallback(
        () => setConfirm({ kind: 'bulk', ids: selection.selectedList }),
        [selection.selectedList],
    )

    const runConfirm = () => {
        if (!confirm) return
        const done = () => setConfirm(null)

        if (confirm.kind === 'bulk') {
            const total = confirm.ids.length
            bulkMutation.mutate(confirm.ids, {
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
            })
            return
        }

        deleteMutation.mutate(confirm.section.id, {
            onSuccess: () => notify('success', t('notice.deleted')),
            onError: notifyError,
            onSettled: done,
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
            description: t('confirm.delete.description', { name: confirm.section.name }),
            confirmLabel: t('confirm.delete.confirm'),
        }
    }, [confirm, t])

    const canBulk = permissions.canDelete

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <SectionPageHeader canCreate={permissions.canCreate} onCreate={handleCreate} />

                    <SectionStatsRow />

                    <SectionFilterBar
                        search={state.search}
                        onSearchChange={state.setSearch}
                        sort={state.sort}
                        onSortChange={state.setSort}
                        departmentIds={state.departmentIds}
                        onDepartmentIdsChange={state.setDepartmentIds}
                        hasImage={state.hasImage}
                        onHasImageToggle={state.toggleHasImage}
                        createdThisMonth={state.createdThisMonth}
                        onCreatedThisMonthToggle={state.toggleCreatedThisMonth}
                        hasActiveFilters={state.hasActiveFilters}
                        onClear={state.clear}
                    />

                    <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                    {canBulk && sections.length > 0 && (
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
                        <SectionGridSkeleton count={SECTIONS_PER_PAGE / 2} />
                    ) : isError ? (
                        <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                    ) : sections.length === 0 ? (
                        <SectionEmptyState canCreate={permissions.canCreate} onCreate={handleCreate} />
                    ) : (
                        <>
                            <SectionGrid
                                sections={sections}
                                permissions={permissions}
                                selectable={canBulk}
                                selectedIds={selection.selectedIds}
                                onToggleSelect={selection.toggle}
                                onImageError={handleImageError}
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
                <SectionFormDialog
                    key={formTarget.section?.id ?? 'new'}
                    section={formTarget.section}
                    open
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                />
            )}

            <SectionDetailsDialog sectionId={viewId} onOpenChange={closeView} />

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={deleteMutation.isPending || bulkMutation.isPending}
                    onConfirm={runConfirm}
                    destructive
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
