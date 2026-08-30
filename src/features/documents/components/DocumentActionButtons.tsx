import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share2, Pencil, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface DocumentActionButtonsProps {
    onDownload?: () => void;
    onShare?: () => void;
    onEdit?: () => void;
    onMore?: () => void;
}

const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
    onDownload,
    onShare,
    onEdit,
    onMore,
}) => {
    const { t } = useTranslation(['documents', 'common']);

    const handleClick = useCallback((callback?: () => void) => {
        callback?.();
    }, []);

    return (
        <div className="flex items-center gap-2 flex-shrink-0">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleClick(onShare)}
            >
                <Share2 className="me-2 h-4 w-4" /> {t('common:actions.share')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleClick(onDownload)}
            >
                <Download className="me-2 h-4 w-4" /> {t('common:actions.download')}
            </Button>
            <Button
                size="sm"
                onClick={() => handleClick(onEdit)}
            >
                <Pencil className="me-2 h-4 w-4" /> {t('common:actions.edit')}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => handleClick(onMore)}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default React.memo(DocumentActionButtons);
