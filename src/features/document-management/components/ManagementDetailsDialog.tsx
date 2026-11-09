import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Check, Layers, Loader2, Pencil, X } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { DocumentStatusBadge, ImportanceBadge } from './DocumentBadges'
import ApprovalList from './ApprovalList'
import DepartmentChips from './DepartmentChips'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import { useManagedDocumentDetail } from '../hooks/useManagedDocumentDetail'
import { useVersionAccess } from '../hooks/useVersionAccess'
import type { ManagedDocument, ReviewDecision } from '../types/management.types'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{children}</dd>
        </div>
    )
}

interface ManagementDetailsDialogProps {
    documentId: number | null
    onOpenChange: (open: boolean) => void
    onReview: (doc: ManagedDocument, decision: ReviewDecision) => void
    onEdit: (doc: ManagedDocument) => void
}

/** Read-only view with approvals and the latest version; fetches only while open. */
function ManagementDetailsDialog({ documentId, onOpenChange, onReview, onEdit }: ManagementDetailsDialogProps) {
    const { t, i18n } = useTranslation('management')
    const tenant = useTenantId() ?? ''
    const { canRead: canVersions } = useVersionAccess()
    const { document: doc, isLoading, isError, error, refetch } = useManagedDocumentDetail(documentId)
    const notFound = isError && errorStatus(error) === 404
    const v = doc?.latest_version
    const date = (iso: string) => relativeTime(iso, i18n.language)

    return (
        <Dialog open={documentId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('details.title')}</DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isError && (
                    <div className="space-y-3 py-6 text-center">
                        <p className="text-sm text-destructive">{t(notFound ? 'states.notFound' : 'states.viewError')}</p>
                        {!notFound && (
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                {t('actions.retry', { ns: 'common' })}
                            </Button>
                        )}
                    </div>
                )}

                {doc && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground" dir="auto">{doc.title}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <DocumentStatusBadge status={doc.status} />
                                <ImportanceBadge importance={doc.importance} />
                                {doc.deleted_at && <Badge variant="outline">{t('details.inTrash')}</Badge>}
                            </div>
                            {doc.description && (
                                <p className="whitespace-pre-line text-sm text-muted-foreground" dir="auto">{doc.description}</p>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-4 text-sm">
                            <Row label={t('details.creator')}>{doc.creator?.name ?? '—'}</Row>
                            <Row label={t('details.responsible')}>{doc.responsible?.name ?? '—'}</Row>
                            <Row label={t('details.origin')}>{doc.origin_department?.title ?? '—'}</Row>
                            <Row label={t('details.category')}>{t(`category.${doc.category}`)}</Row>
                            <div className="col-span-2">
                                <dt className="mb-1 text-muted-foreground">{t('details.departments')}</dt>
                                <dd><DepartmentChips departments={doc.departments} max={6} /></dd>
                            </div>
                            <Row label={t('details.versions')}>{doc.versions_count}</Row>
                            <Row label={t('details.created')}>{date(doc.created_at)}</Row>
                            <Row label={t('details.updated')}>{date(doc.updated_at)}</Row>
                            {doc.deleted_at && <Row label={t('details.deleted')}>{date(doc.deleted_at)}</Row>}
                        </dl>

                        <div>
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('details.latestVersion')}</h4>
                            {v ? (
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border p-3 text-sm sm:grid-cols-4">
                                    <Row label={t('details.version')}>v{v.version}</Row>
                                    <Row label={t('details.extension')}><span className="uppercase">{v.extension ?? '—'}</span></Row>
                                    <Row label={t('details.uploadStatus')}>{v.upload_status}</Row>
                                    <Row label={t('details.expires')}>{v.expire_date ? date(v.expire_date) : '—'}</Row>
                                </dl>
                            ) : (
                                <p className="text-sm text-muted-foreground">{t('details.noFiles')}</p>
                            )}
                        </div>

                        <div>
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('details.approvals')}</h4>
                            <ApprovalList approvals={doc.approvals} />
                        </div>
                    </div>
                )}

                {doc && (canVersions || doc.abilities.approve || doc.abilities.reject || doc.abilities.update) && (
                    <DialogFooter>
                        {canVersions && (
                            <Button variant="outline" asChild>
                                <Link to="/$tenant/document-management/$documentId/versions" params={{ tenant, documentId: String(doc.id) }}>
                                    <Layers className="h-4 w-4" />
                                    {t('actions.versions')}
                                </Link>
                            </Button>
                        )}
                        {doc.abilities.update && (
                            <Button variant="outline" onClick={() => onEdit(doc)}>
                                <Pencil className="h-4 w-4" />
                                {t('actions.edit')}
                            </Button>
                        )}
                        {doc.abilities.reject && (
                            <Button variant="outline" onClick={() => onReview(doc, 'reject')}>
                                <X className="h-4 w-4 text-destructive" />
                                {t('actions.reject')}
                            </Button>
                        )}
                        {doc.abilities.approve && (
                            <Button onClick={() => onReview(doc, 'approve')}>
                                <Check className="h-4 w-4" />
                                {t('actions.approve')}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(ManagementDetailsDialog)
