import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { DocumentStatusBadge } from './DocumentBadges'
import type { DocumentApproval } from '../types/management.types'

function ApprovalList({ approvals }: { approvals: DocumentApproval[] }) {
    const { t, i18n } = useTranslation('management')

    if (approvals.length === 0) return <p className="text-sm text-muted-foreground">{t('details.noApprovals')}</p>

    return (
        <ul className="divide-y divide-border rounded-xl border border-border">
            {approvals.map((a) => (
                <li key={a.id} className="space-y-1 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{a.user?.name ?? '—'}</span>
                        <DocumentStatusBadge status={a.status} />
                    </div>
                    {a.note && <p className="text-sm text-muted-foreground" dir="auto">{a.note}</p>}
                    <p className="text-xs text-muted-foreground">{relativeTime(a.updated_at, i18n.language)}</p>
                </li>
            ))}
        </ul>
    )
}

export default memo(ApprovalList)
