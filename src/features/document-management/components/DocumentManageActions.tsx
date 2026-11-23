import { memo, useCallback, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Layers, Pencil, RotateCcw, Trash2, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { documentKeys } from '@/features/documents/api/documentKeys'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import ReviewDialog from './ReviewDialog'
import { useManagedDocumentDetail } from '../hooks/useManagedDocumentDetail'
import { useDocumentRowAction } from '../hooks/useDocumentRowAction'
import { useVersionAccess } from '../hooks/useVersionAccess'
import type { ReviewDecision } from '../types/management.types'

/**
 * The management actions of one document, on its own page. Every button comes from `abilities`
 * (and the version permission), so a user only sees what they can really do. Renders nothing for
 * documents outside the user's management audience (the endpoint answers 404).
 */
function DocumentManageActions({ documentId }: { documentId: number }) {
    const { t } = useTranslation('management')
    const tenant = useTenantId() ?? ''
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { canRead: canVersions } = useVersionAccess()
    const { document: doc } = useManagedDocumentDetail(documentId)
    const [decision, setDecision] = useState<ReviewDecision | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteMutation = useDocumentRowAction('delete')
    const restoreMutation = useDocumentRowAction('restore')

    // The view page reads its own cache: refresh it after anything that changes the document.
    const refreshView = useCallback(() => {
        if (tenant) queryClient.invalidateQueries({ queryKey: documentKeys.detail(tenant, documentId) })
    }, [queryClient, tenant, documentId])

    const blocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            setError(status === 403 ? t('notice.forbidden') : status === 404 ? t('notice.notFound') : (errorMessage(err) ?? t('notice.failed')))
        },
        [t],
    )

    const closeReview = useCallback((open: boolean) => !open && setDecision(null), [])
    const handleReviewDone = useCallback(() => {
        setDecision(null)
        setError(null)
        refreshView()
    }, [refreshView])
    const handleReviewBlocked = useCallback(
        (err: unknown) => {
            setDecision(null)
            blocked(err)
        },
        [blocked],
    )
    const closeConfirm = useCallback((open: boolean) => !open && setConfirmDelete(false), [])

    if (!doc) return null
    const a = doc.abilities
    const hasAny = a.update || a.approve || a.reject || a.delete || a.restore || canVersions
    if (!hasAny) return null

    const runDelete = () =>
        deleteMutation.mutate(doc.id, {
            onSuccess: () => navigate({ to: '/$tenant/documents', params: { tenant } }),
            onError: (err) => {
                setConfirmDelete(false)
                blocked(err)
            },
        })

    return (
        <>
            {a.approve && (
                <Button size="sm" onClick={() => setDecision('approve')}>
                    <Check className="me-2 h-4 w-4" />
                    {t('actions.approve')}
                </Button>
            )}
            {a.reject && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDecision('reject')}>
                    <X className="me-2 h-4 w-4" />
                    {t('actions.reject')}
                </Button>
            )}
            {a.update && (
                <Button asChild size="sm" variant="outline">
                    <Link to="/$tenant/document-management/$documentId/edit" params={{ tenant, documentId: String(doc.id) }}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </Link>
                </Button>
            )}
            {canVersions && (
                <Button asChild size="sm" variant="outline">
                    <Link to="/$tenant/document-management/$documentId/versions" params={{ tenant, documentId: String(doc.id) }}>
                        <Layers className="me-2 h-4 w-4" />
                        {t('actions.versions')}
                    </Link>
                </Button>
            )}
            {a.restore && (
                <Button
                    size="sm"
                    variant="outline"
                    disabled={restoreMutation.isPending}
                    onClick={() => restoreMutation.mutate(doc.id, { onSuccess: refreshView, onError: blocked })}
                >
                    <RotateCcw className="me-2 h-4 w-4" />
                    {t('actions.restore')}
                </Button>
            )}
            {a.delete && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="me-2 h-4 w-4" />
                    {t('actions.delete')}
                </Button>
            )}
            {error && (
                <p role="alert" className="basis-full text-sm text-destructive">
                    {error}
                </p>
            )}

            {decision && (
                <ReviewDialog
                    key={decision}
                    doc={doc}
                    decision={decision}
                    onOpenChange={closeReview}
                    onDone={handleReviewDone}
                    onBlocked={handleReviewBlocked}
                />
            )}
            {confirmDelete && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={deleteMutation.isPending}
                    onConfirm={runDelete}
                    destructive
                    title={t('confirm.delete.title')}
                    description={t('confirm.delete.description', { name: doc.title })}
                    confirmLabel={t('confirm.delete.confirm')}
                />
            )}
        </>
    )
}

export default memo(DocumentManageActions)
