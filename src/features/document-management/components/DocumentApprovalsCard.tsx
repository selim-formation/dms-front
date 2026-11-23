import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ApprovalList from './ApprovalList'
import { DocumentStatusBadge } from './DocumentBadges'
import { useManagedDocumentDetail } from '../hooks/useManagedDocumentDetail'

/** Approval workflow of a document: overall status and each manager's decision. Hidden when there is nothing to show. */
function DocumentApprovalsCard({ documentId }: { documentId: number }) {
    const { t } = useTranslation('management')
    const { document: doc } = useManagedDocumentDetail(documentId)
    if (!doc || doc.approvals.length === 0) return null

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
                <CardTitle className="text-base font-semibold">{t('details.approvals')}</CardTitle>
                <DocumentStatusBadge status={doc.status} />
            </CardHeader>
            <CardContent>
                <ApprovalList approvals={doc.approvals} />
            </CardContent>
        </Card>
    )
}

export default memo(DocumentApprovalsCard)
