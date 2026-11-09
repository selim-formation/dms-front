import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '@/shared/components/layout/Navbar'
import { Button } from '@/shared/components/ui/button'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import DepartmentBulkBar from '@/features/departments/components/DepartmentBulkBar'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useDepartmentSelection } from '@/features/departments/hooks/useDepartmentSelection'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { errorList } from '@/features/roles/utils/roleErrors'
import GalleryHeaderCard from '../components/GalleryHeaderCard'
import GalleryFormDialog from '../components/form/GalleryFormDialog'
import ImageToolbar from '../components/images/ImageToolbar'
import GalleryImageGrid from '../components/images/GalleryImageGrid'
import AddImagesDialog from '../components/images/AddImagesDialog'
import ImageEditDialog from '../components/images/ImageEditDialog'
import { GalleryEmptyState, GalleryForbiddenState, ImageGridSkeleton } from '../components/GalleryStates'
import { useGalleryDetail } from '../hooks/useGalleryDetail'
import { useGalleryImages } from '../hooks/useGalleryImages'
import { useImageFilterState } from '../hooks/useImageFilterState'
import { useGalleryAccess } from '../hooks/useGalleryAccess'
import { useGalleryCache } from '../hooks/useGalleryCache'
import { useRowAction, type GalleryResource, type RowAction } from '../hooks/useRowAction'
import { useBulkAction } from '../hooks/useBulkAction'
import { bulkActionsFor, isSelectable } from '../utils/galleryPayload'
import type { Gallery, GalleryBulkAction, GalleryImage } from '../types/gallery.types'

type ConfirmState =
    | { kind: 'row'; resource: GalleryResource; action: RowAction; name: string; id: number }
    | { kind: 'bulk'; action: GalleryBulkAction; ids: number[] }
    | null
type Dialog = 'edit' | 'add' | { image: GalleryImage } | null

/** One gallery: its details and a paginated grid of its pictures (12 per page). */
export default function GalleryDetailPage() {
    const { t } = useTranslation('galleries')
    const { galleryId } = useParams({ from: '/_protected/$tenant/galleries/$galleryId' })
    const id = Number(galleryId)
    const tenant = useTenantId() ?? ''
    const navigate = useNavigate()
    const access = useGalleryAccess()
    const { invalidate } = useGalleryCache()

    const { gallery, isLoading: galleryLoading, isError: galleryError, error: galleryErr, refetch: refetchGallery } = useGalleryDetail(id)
    const state = useImageFilterState(id)
    const trashView = state.tab === 'trash'
    const { images, meta, isLoading, isFetching, isError, error, refetch } = useGalleryImages(state.filters, access.image.canRead)

    const bulkActions = useMemo(
        () => bulkActionsFor(trashView, { delete: access.image.canDelete, restore: access.image.canRestore, forceDelete: access.image.canForceDelete }),
        [trashView, access.image.canDelete, access.image.canRestore, access.image.canForceDelete],
    )
    const bulkEnabled = bulkActions.length > 0
    const selectableIds = useMemo(
        () => (bulkEnabled ? images.filter((i) => isSelectable(i, trashView)).map((i) => i.id) : []),
        [images, trashView, bulkEnabled],
    )
    const selection = useDepartmentSelection(JSON.stringify(state.filters), selectableIds)

    const [dialog, setDialog] = useState<Dialog>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const galleryDelete = useRowAction('galleries', 'delete')
    const galleryRestore = useRowAction('galleries', 'restore')
    const galleryForce = useRowAction('galleries', 'force_delete')
    const imageDelete = useRowAction('images', 'delete')
    const imageRestore = useRowAction('images', 'restore')
    const imageForce = useRowAction('images', 'force_delete')
    const mutations = {
        galleries: { delete: galleryDelete, restore: galleryRestore, force_delete: galleryForce },
        images: { delete: imageDelete, restore: imageRestore, force_delete: imageForce },
    }
    const bulkMutation = useBulkAction('images')

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])
    const notifyBlocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403) return notify('error', t('notice.forbidden'))
            if (status === 404) return notify('error', t('notice.notFound'))
            notify('error', errorMessage(err) ?? t('notice.failed'))
        },
        [notify, t],
    )

    // Picture links last 2 hours: when one fails, refresh the page once (not once per picture).
    const refreshedAt = useRef(0)
    const handleLinkError = useCallback(() => {
        if (Date.now() - refreshedAt.current < 30_000) return
        refreshedAt.current = Date.now()
        refetch()
    }, [refetch])

    const askGallery = useCallback((action: RowAction) => (g: Gallery) => {
        setConfirmError(null)
        setConfirm({ kind: 'row', resource: 'galleries', action, name: g.name, id: g.id })
    }, [])
    const handleGalleryDelete = useMemo(() => askGallery('delete'), [askGallery])
    const handleGalleryRestore = useMemo(() => askGallery('restore'), [askGallery])
    const handleGalleryForce = useMemo(() => askGallery('force_delete'), [askGallery])
    const askImage = useCallback((action: RowAction) => (img: GalleryImage) => {
        setConfirmError(null)
        setConfirm({ kind: 'row', resource: 'images', action, name: img.title, id: img.id })
    }, [])
    const handleImageDelete = useMemo(() => askImage('delete'), [askImage])
    const handleImageRestore = useMemo(() => askImage('restore'), [askImage])
    const handleImageForce = useMemo(() => askImage('force_delete'), [askImage])
    const handleBulkAction = useCallback(
        (action: GalleryBulkAction) => {
            setConfirmError(null)
            setConfirm({ kind: 'bulk', action, ids: selection.selectedList })
        },
        [selection.selectedList],
    )

    const handleEditGallery = useCallback(() => setDialog('edit'), [])
    const handleAddImages = useCallback(() => setDialog('add'), [])
    const handleEditImage = useCallback((image: GalleryImage) => setDialog({ image }), [])
    const closeDialog = useCallback((open: boolean) => !open && setDialog(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    const handleBlocked = useCallback(
        (err: unknown) => {
            setDialog(null)
            notifyBlocked(err)
            invalidate()
        },
        [notifyBlocked, invalidate],
    )
    const handleGallerySaved = useCallback(() => {
        setDialog(null)
        notify('success', t('notice.updated'))
    }, [notify, t])
    const handleImagesAdded = useCallback(
        (count: number) => {
            setDialog(null)
            notify('success', t('notice.imagesAdded', { count }))
        },
        [notify, t],
    )
    const handleImageSaved = useCallback(() => {
        setDialog(null)
        notify('success', t('notice.imageUpdated'))
    }, [notify, t])

    const runConfirm = () => {
        if (!confirm) return

        if (confirm.kind === 'bulk') {
            bulkMutation.mutate(
                { action: confirm.action, ids: confirm.ids },
                {
                    onSuccess: (res) => {
                        selection.clear()
                        setConfirm(null)
                        notify('success', t(`notice.imageBulk.${confirm.action}`, { count: res.affected }))
                    },
                    onError: (err) => {
                        const blockers = errorList(err, 'ids')
                        if (errorStatus(err) === 422 && blockers.length) return setConfirmError(blockers.join(' '))
                        setConfirm(null)
                        notifyBlocked(err)
                    },
                },
            )
            return
        }

        mutations[confirm.resource][confirm.action].mutate(confirm.id, {
            onSuccess: () => {
                setConfirm(null)
                // A gallery deleted for good has no page left to show.
                if (confirm.resource === 'galleries' && confirm.action === 'force_delete') {
                    navigate({ to: '/$tenant/galleries', params: { tenant } })
                    return
                }
                notify('success', t(`notice.${confirm.resource === 'galleries' ? '' : 'image_'}${confirm.action}`))
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
                title: t(`confirm.imageBulk.${confirm.action}.title`, { count: confirm.ids.length }),
                description: t(`confirm.imageBulk.${confirm.action}.description`),
                confirmLabel: t(`confirm.imageBulk.${confirm.action}.confirm`),
                destructive: confirm.action !== 'restore',
            }
        }
        const scope = confirm.resource === 'galleries' ? 'confirm' : 'confirm.image'
        return {
            title: t(`${scope}.${confirm.action}.title`),
            description: t(`${scope}.${confirm.action}.description`, { name: confirm.name }),
            confirmLabel: t(`${scope}.${confirm.action}.confirm`),
            destructive: confirm.action !== 'restore',
        }
    }, [confirm, t])

    const pending =
        Object.values(mutations.galleries).some((m) => m.isPending) ||
        Object.values(mutations.images).some((m) => m.isPending) ||
        bulkMutation.isPending

    const forbidden = !access.canRead || (galleryError && errorStatus(galleryErr) === 403)
    const notFound = galleryError && errorStatus(galleryErr) === 404

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/$tenant/galleries" params={{ tenant }}>
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t('detail.back')}
                    </Link>
                </Button>

                {forbidden ? (
                    <GalleryForbiddenState />
                ) : galleryLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : notFound ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
                        <p className="font-medium text-foreground">{t('states.notFound')}</p>
                        <Button className="mt-4" variant="outline" asChild>
                            <Link to="/$tenant/galleries" params={{ tenant }}>{t('detail.back')}</Link>
                        </Button>
                    </div>
                ) : galleryError || !gallery ? (
                    <DepartmentErrorState message={t('states.viewError')} onRetry={() => refetchGallery()} />
                ) : (
                    <>
                        <GalleryHeaderCard
                            gallery={gallery}
                            onEdit={handleEditGallery}
                            onAddImages={handleAddImages}
                            onDelete={handleGalleryDelete}
                            onRestore={handleGalleryRestore}
                            onForceDelete={handleGalleryForce}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {access.image.canRead && (
                            <section className="space-y-4" aria-label={t('detail.imagesSection')}>
                                <ImageToolbar
                                    tab={state.tab}
                                    onTabChange={state.setTab}
                                    showTrash={access.image.canRestore || access.image.canForceDelete || access.image.canDelete}
                                    search={state.search}
                                    onSearchChange={state.setSearch}
                                    sort={state.sort}
                                    onSortChange={state.setSort}
                                />

                                {bulkEnabled && images.length > 0 && (
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
                                    <ImageGridSkeleton />
                                ) : isError ? (
                                    <DepartmentErrorState message={error?.message || t('imageStates.errorTitle')} onRetry={() => refetch()} />
                                ) : images.length === 0 ? (
                                    <GalleryEmptyState trash={trashView} prefix="imageStates" />
                                ) : (
                                    <>
                                        <GalleryImageGrid
                                            images={images}
                                            trashView={trashView}
                                            bulkEnabled={bulkEnabled}
                                            selectedIds={selection.selectedIds}
                                            onToggleSelect={selection.toggle}
                                            onLinkError={handleLinkError}
                                            onEdit={handleEditImage}
                                            onDelete={handleImageDelete}
                                            onRestore={handleImageRestore}
                                            onForceDelete={handleImageForce}
                                        />
                                        <DepartmentPagination
                                            currentPage={meta?.current_page ?? state.page}
                                            lastPage={meta?.last_page ?? 1}
                                            onPageChange={handlePageChange}
                                            disabled={isFetching}
                                        />
                                    </>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>

            {dialog === 'edit' && gallery && (
                <GalleryFormDialog gallery={gallery} canAddImages={false} onOpenChange={closeDialog} onSaved={handleGallerySaved} onBlocked={handleBlocked} />
            )}
            {dialog === 'add' && <AddImagesDialog galleryId={id} onOpenChange={closeDialog} onSaved={handleImagesAdded} onBlocked={handleBlocked} />}
            {dialog && typeof dialog === 'object' && (
                <ImageEditDialog key={dialog.image.id} image={dialog.image} onOpenChange={closeDialog} onSaved={handleImageSaved} onBlocked={handleBlocked} />
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
