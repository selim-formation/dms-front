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
import GalleryPageHeader from '../components/GalleryPageHeader'
import GalleryTabs from '../components/GalleryTabs'
import GalleryFilterBar from '../components/GalleryFilterBar'
import GalleryTable from '../components/GalleryTable'
import GalleryFormDialog from '../components/form/GalleryFormDialog'
import { GalleryEmptyState, GalleryForbiddenState, GalleryTableSkeleton } from '../components/GalleryStates'
import { useGalleryList } from '../hooks/useGalleryList'
import { useGalleryFilterState, type GalleryTab } from '../hooks/useGalleryFilterState'
import { useGalleryAccess } from '../hooks/useGalleryAccess'
import { useRowAction, type RowAction } from '../hooks/useRowAction'
import { useBulkAction } from '../hooks/useBulkAction'
import { bulkActionsFor, isSelectable } from '../utils/galleryPayload'
import type { Gallery, GalleryBulkAction } from '../types/gallery.types'

const TABS: readonly GalleryTab[] = ['all', 'trash']

type FormTarget = { mode: 'create' } | { mode: 'edit'; gallery: Gallery } | null
type ConfirmState = { kind: 'row'; action: RowAction; gallery: Gallery } | { kind: 'bulk'; action: GalleryBulkAction; ids: number[] } | null

export default function GalleriesPage() {
    const { t } = useTranslation('galleries')
    const access = useGalleryAccess()
    const state = useGalleryFilterState()
    const { galleries, meta, isLoading, isFetching, isError, error, refetch } = useGalleryList(state.filters)
    const trashView = state.tab === 'trash'

    const bulkActions = useMemo(
        () => bulkActionsFor(trashView, { delete: access.canDelete, restore: access.canRestore, forceDelete: access.canForceDelete }),
        [trashView, access.canDelete, access.canRestore, access.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0

    // All-or-nothing bulk: only rows the server will accept can be selected.
    const selectableIds = useMemo(
        () => (bulkEnabled ? galleries.filter((g) => isSelectable(g, trashView)).map((g) => g.id) : []),
        [galleries, trashView, bulkEnabled],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), selectableIds)

    const [form, setForm] = useState<FormTarget>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const deleteMutation = useRowAction('galleries', 'delete')
    const restoreMutation = useRowAction('galleries', 'restore')
    const forceMutation = useRowAction('galleries', 'force_delete')
    const rowMutations = { delete: deleteMutation, restore: restoreMutation, force_delete: forceMutation }
    const bulkMutation = useBulkAction('galleries')

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
    const handleCreate = useCallback(() => setForm({ mode: 'create' }), [])
    const handleEdit = useCallback((g: Gallery) => setForm({ mode: 'edit', gallery: g }), [])
    const askRow = useCallback((action: RowAction) => (g: Gallery) => {
        setConfirmError(null)
        setConfirm({ kind: 'row', action, gallery: g })
    }, [])
    const handleDelete = useMemo(() => askRow('delete'), [askRow])
    const handleRestore = useMemo(() => askRow('restore'), [askRow])
    const handleForceDelete = useMemo(() => askRow('force_delete'), [askRow])
    const handleBulkAction = useCallback(
        (action: GalleryBulkAction) => {
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

    const closeForm = useCallback((open: boolean) => !open && setForm(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const handleSaved = useCallback(
        (_saved: Gallery, mode: 'create' | 'edit') => {
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
                        // 422 names every gallery that blocked it: keep the dialog open so the user can deselect.
                        const blockers = errorList(err, 'ids')
                        if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                        setConfirm(null)
                        notifyBlocked(err)
                    },
                },
            )
            return
        }

        rowMutations[confirm.action].mutate(confirm.gallery.id, {
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
            description: t(`confirm.${confirm.action}.description`, { name: confirm.gallery.name }),
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
                    <GalleryForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <GalleryPageHeader canCreate={access.canCreate} onCreate={handleCreate} />
                        <GalleryTabs value={state.tab} tabs={TABS} onChange={state.setTab} ariaLabel={t('tabs.label')} />

                        <GalleryFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            type={state.type}
                            onTypeChange={state.setType}
                            hasImages={state.hasImages}
                            onHasImagesChange={state.setHasImages}
                            sort={state.sort}
                            onSortChange={state.setSort}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {bulkEnabled && galleries.length > 0 && (
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
                            <GalleryTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : galleries.length === 0 ? (
                            <GalleryEmptyState trash={trashView} />
                        ) : (
                            <>
                                <GalleryTable
                                    galleries={galleries}
                                    trashView={trashView}
                                    bulkEnabled={bulkEnabled}
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
                )}
            </main>

            {form && (
                <GalleryFormDialog
                    key={form.mode === 'edit' ? form.gallery.id : 'new'}
                    gallery={form.mode === 'edit' ? form.gallery : undefined}
                    canAddImages={access.image.canCreate && access.canUpload}
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
