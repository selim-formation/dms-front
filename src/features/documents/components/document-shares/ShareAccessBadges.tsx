import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Download, Loader2 } from 'lucide-react';

interface ShareAccessBadgesProps {
    canView: boolean;
    canDownload: boolean;
    /** When provided and canView, the view pill becomes a clickable preview action. */
    onView?: () => void;
    /** When provided and canDownload, the download pill becomes a clickable download action. */
    onDownload?: () => void;
    isDownloading?: boolean;
}

const activeClass = 'bg-primary/10 text-primary';
const inactiveClass = 'bg-muted text-muted-foreground/60';
const pillClass = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5';

/**
 * Compact view/download rights indicator, reused across list rows and dialogs.
 * Becomes a real preview/download action when a handler is passed and the
 * right is granted; otherwise it's a plain read-only indicator.
 */
function ShareAccessBadges({ canView, canDownload, onView, onDownload, isDownloading }: ShareAccessBadgesProps) {
    const { t } = useTranslation('documents');

    return (
        <div className="flex items-center gap-2 text-xs">
            {canView && onView ? (
                <button
                    type="button"
                    onClick={onView}
                    className={`${pillClass} ${activeClass} hover:bg-primary/20 transition-colors cursor-pointer`}
                >
                    <Eye className="h-3 w-3" /> {t('documentShares.access.view')}
                </button>
            ) : (
                <span className={`${pillClass} ${canView ? activeClass : inactiveClass}`}>
                    <Eye className="h-3 w-3" /> {t('documentShares.access.view')}
                </span>
            )}

            {canDownload && onDownload ? (
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={isDownloading}
                    className={`${pillClass} ${activeClass} hover:bg-primary/20 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait`}
                >
                    {isDownloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    {t('documentShares.access.download')}
                </button>
            ) : (
                <span className={`${pillClass} ${canDownload ? activeClass : inactiveClass}`}>
                    <Download className="h-3 w-3" /> {t('documentShares.access.download')}
                </span>
            )}
        </div>
    );
}

export default memo(ShareAccessBadges);
