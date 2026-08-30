import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import DocumentCardGrid from '../DocumentCardGrid';
import { Button } from '@/shared/components/ui/button';
import type { DocumentShareData, DocumentShareDirection } from '../../types/documentShare.types';

interface DocumentShareCardProps {
    share: DocumentShareData;
    direction: DocumentShareDirection;
    onEdit?: (share: DocumentShareData) => void;
    onRevoke?: (share: DocumentShareData) => void;
}

function formatDate(value: string | null): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

const STATUS_IMPORTANCE: Record<DocumentShareData['status'], 'Critical' | 'High' | 'Medium'> = {
    revoked: 'Critical',
    expired: 'High',
    pending: 'Medium',
    active: 'Medium',
};

/**
 * Adapter over the shared browse-grid `DocumentCardGrid` — reuses that exact
 * card (same header, tags, expiry/status rows, view/download actions)
 * instead of a bespoke share card, mapping share fields onto its slots.
 * On the "given" side it adds a granter-only edit/revoke row via footerActions.
 */
function DocumentShareCard({ share, direction, onEdit, onRevoke }: DocumentShareCardProps) {
    const { t } = useTranslation(['documents', 'common']);
    const counterpart = direction === 'given' ? share.shared_with : share.shared_by;
    const isActionable = direction === 'received' && share.status === 'active';
    const canManage = direction === 'given' && !share.revoked_at;
    const expires = formatDate(share.expires_at);

    const accessLabel = share.can_download
        ? t('documentShares.access.download')
        : share.can_view
            ? t('documentShares.access.view')
            : t('documentShares.access.none');

    const statusLabel = t(`documentShares.status.${share.status}`);

    return (
        <DocumentCardGrid
            id={String(share.document.id)}
            name={share.document.title}
            department={counterpart.name}
            entity={counterpart.email}
            renewal={share.can_download ? 'Renewable' : 'One-Time'}
            renewalLabel={accessLabel}
            importance={STATUS_IMPORTANCE[share.status]}
            importanceLabel={statusLabel}
            expiryDate={expires ?? t('documentShares.neverExpires')}
            status={share.status === 'expired' || share.status === 'revoked' ? 'Expired' : 'Expires'}
            downloadDisabled={!isActionable || !share.can_download}
            footerActions={
                canManage ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onEdit?.(share)}
                        >
                            <Pencil className="h-3.5 w-3.5" /> {t('common:actions.edit')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRevoke?.(share)}
                        >
                            <Trash2 className="h-3.5 w-3.5" /> {t('documentShares.revoke.action')}
                        </Button>
                    </>
                ) : undefined
            }
        />
    );
}

export default memo(DocumentShareCard);
