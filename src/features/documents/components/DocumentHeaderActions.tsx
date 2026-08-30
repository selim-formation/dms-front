<<<<<<< Updated upstream
import React, { useCallback } from 'react';
=======
import React from 'react';
import { useTranslation } from 'react-i18next';
>>>>>>> Stashed changes
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Star, Pin, Share2, Download, Pencil, MoreHorizontal } from 'lucide-react';
import { useTogglePin } from '../hooks/usePinnedStatus';
import { useToggleFavorite } from '../hooks/useFavoriteStatus';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

interface DocumentHeaderActionsProps {
    documentId: number;
    onShare?: () => void;
    onDownload?: () => void;
    onEdit?: () => void;
    onMore?: () => void;
}

const DocumentHeaderActions: React.FC<DocumentHeaderActionsProps> = ({
    documentId,
    onShare,
    onDownload,
    onEdit,
    onMore,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    const { isFavorited, isPending: isFavoritePending, toggle: toggleFavorite } =
        useToggleFavorite(documentId);
    const { isPinned, isPending: isPinPending, toggle: togglePin } = useTogglePin(documentId);
    const { can } = usePermissions();
    const canShare = can('create_document_shares');

    return (
        <div className="flex items-center gap-2 flex-shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className={isFavorited ? 'text-warning hover:text-warning' : 'text-muted-foreground hover:text-foreground'}
                onClick={toggleFavorite}
                disabled={isFavoritePending}
                aria-pressed={isFavorited}
                title={isFavorited ? t('common:actions.unfavorite') : t('common:actions.favorite')}
            >
                <Star className="h-4 w-4" fill={isFavorited ? 'currentColor' : 'none'} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={isPinned ? 'text-warning hover:text-warning' : 'text-muted-foreground hover:text-foreground'}
                onClick={togglePin}
                disabled={isPinPending}
                aria-pressed={isPinned}
                title={isPinned ? t('common:actions.unpin') : t('common:actions.pin')}
            >
                <Pin className="h-4 w-4" fill={isPinned ? 'currentColor' : 'none'} />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            {canShare && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onShare}
                >
                    <Share2 className="me-2 h-4 w-4" /> {t('common:actions.share')}
                </Button>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
            >
                <Download className="me-2 h-4 w-4" /> {t('common:actions.download')}
            </Button>
            <Button
                size="sm"
                onClick={onEdit}
            >
                <Pencil className="me-2 h-4 w-4" /> {t('common:actions.edit')}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={onMore}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default React.memo(DocumentHeaderActions);
