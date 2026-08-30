import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/components/ui/badge';
import type { DocumentShareStatus } from '../../types/documentShare.types';

const STATUS_CLASSES: Record<DocumentShareStatus, string> = {
    active: 'border-transparent bg-success/10 text-success',
    pending: 'border-transparent bg-info/10 text-info',
    expired: 'border-transparent bg-muted text-muted-foreground',
    revoked: 'border-transparent bg-destructive/10 text-destructive',
};

interface ShareStatusBadgeProps {
    status: DocumentShareStatus;
    className?: string;
}

function ShareStatusBadge({ status, className = '' }: ShareStatusBadgeProps) {
    const { t } = useTranslation('documents');

    return (
        <Badge className={`${STATUS_CLASSES[status]} ${className}`}>
            {t(`documentShares.status.${status}`)}
        </Badge>
    );
}

export default memo(ShareStatusBadge);
