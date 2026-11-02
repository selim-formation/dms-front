import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/components/ui/badge';
import { SHARE_TARGET_META } from './shareTargetMeta';
import type { DocumentShareTargetType } from '../../types/documentShare.types';

interface ShareTargetBadgeProps {
    type: DocumentShareTargetType;
    className?: string;
}

/** Small pill showing whether a share reaches a user, a department or a section. */
function ShareTargetBadge({ type, className = '' }: ShareTargetBadgeProps) {
    const { t } = useTranslation('documents');
    const { icon: Icon, badgeClass } = SHARE_TARGET_META[type];

    return (
        <Badge className={`gap-1 ${badgeClass} ${className}`}>
            <Icon className="h-3 w-3" />
            {t(`documentShares.targetType.${type}`)}
        </Badge>
    );
}

export default memo(ShareTargetBadge);
