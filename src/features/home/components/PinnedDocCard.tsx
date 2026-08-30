import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useUnpinDocument } from '@/features/documents/hooks/useUnpinDocument';

interface PinnedDocCardProps {
    id: number;
    title: string;
    description: string | null;
    userName: string;
    createdDate: string;
    /** Called after a successful unpin — lets embedding pages (e.g. Profile)
     * invalidate their own queries in addition to the default pinned-docs cache. */
    onUnpinned?: () => void;
}

/**
 * Pinned Document Card — reused by the home "Pinned Documents" widget and the
 * Profile page's Pinned tab so both share the exact same design.
 */
function PinnedDocCard({ id, title, description, userName, createdDate, onUnpinned }: PinnedDocCardProps) {
    const { t } = useTranslation(['home', 'common']);
    const [showMenu, setShowMenu] = useState(false);
    const { mutate: unpinDoc, isPending: isUnpinning } = useUnpinDocument({
        onSuccess: () => {
            setShowMenu(false);
            onUnpinned?.();
        },
        onError: (error) => {
            console.error('Failed to unpin document:', error);
        },
    });

    const handleUnpin = () => {
        unpinDoc(id);
    };

    return (
        <Card className="border-border hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 rounded-t-lg bg-primary/15">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={t('pinnedDocuments.moreOptions')}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                        {showMenu && (
                            <div className="absolute end-0 top-6 w-32 bg-popover border border-border rounded-lg shadow-lg z-20">
                                <button
                                    onClick={handleUnpin}
                                    disabled={isUnpinning}
                                    className="w-full text-start px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                                >
                                    {isUnpinning ? t('pinnedDocuments.unpinning') : t('common:actions.unpin')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-4 py-3 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground truncate">{description}</p>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t('pinnedDocuments.pinnedBy')}</span>
                        <span className="text-xs font-medium text-foreground">{userName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                        {new Date(createdDate).toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PinnedDocCard);
