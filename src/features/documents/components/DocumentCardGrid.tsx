import type { ReactNode } from 'react';
import { Download, Loader2, Pin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useTogglePin } from '../hooks/usePinnedStatus';
import { useToggleFavorite } from '../hooks/useFavoriteStatus';
import DocumentIconToggleButton from './DocumentIconToggleButton';
import { translateDocumentTypeName, translateDepartmentName } from '../utils/documentLabelDictionary';
import { useDownloadDocument } from '../hooks/useDownloadDocument';

interface DocumentCardGridProps {
    id: string;
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired' | 'Active';
    icon?: string;
    /** Override the renewal chip's text while keeping its color bucket — lets callers outside the browse grid (e.g. shares) show truthful copy. */
    renewalLabel?: string;
    /** Override the importance chip's text while keeping its color bucket. */
    importanceLabel?: string;
    /** Override the status chip's text while keeping its color bucket. */
    statusLabel?: string;
    /** Override the primary "view" action (defaults to navigating to the document). */
    onView?: () => void;
    /** Wires the download button, which otherwise renders inert. */
    onDownload?: () => void;
    downloadDisabled?: boolean;
    isDownloading?: boolean;
    /** Extra controls rendered below the view/download row (e.g. granter-only edit/revoke). */
    footerActions?: ReactNode;
}

const importanceStyles = {
    Critical: {
        bg: 'bg-destructive/5',
        badge: 'bg-destructive/10 text-destructive',
        dotColor: 'bg-destructive',
    },
    High: {
        bg: 'bg-warning/5',
        badge: 'bg-warning/10 text-warning',
        dotColor: 'bg-warning',
    },
    Medium: {
        bg: 'bg-info/5',
        badge: 'bg-info/10 text-info',
        dotColor: 'bg-info',
    },
};

const renewalStyles = {
    Renewable: 'bg-chart-4/10 text-chart-4',
    'One-Time': 'bg-muted text-muted-foreground',
};

const statusStyles = {
    Expires: 'text-warning',
    Expired: 'text-destructive',
    Active: 'text-success',
};

export default function DocumentCardGrid({
    id,
    name,
    department,
    entity,
    renewal,
    importance,
    expiryDate,
    status,
    icon = '📄',
    renewalLabel,
    importanceLabel,
    statusLabel,
    onView,
    onDownload,
    downloadDisabled = false,
    isDownloading = false,
    footerActions,
}: DocumentCardGridProps) {
    const importanceMode = importanceStyles[importance];
    const navigate = useNavigate();
    const tenant = useTenantId();
    const { t, i18n } = useTranslation(['documents', 'common']);
    const documentId = parseInt(id, 10);
    const departmentLabel = translateDepartmentName(department, i18n.language);
    const entityLabel = translateDocumentTypeName(entity, i18n.language);
    const { isPinned, isPending: isPinPending, toggle: togglePin } = useTogglePin(documentId);
    const { isFavorited, isPending: isFavoritePending, toggle: toggleFavorite } =
        useToggleFavorite(documentId);
    // Default download behavior when the caller doesn't wire its own (e.g. a
    // permission-gated share) — keeps the button working out of the box.
    const { download: downloadDefault, isDownloading: isDownloadingDefault } = useDownloadDocument();
    const handleDownload = onDownload ?? (() => downloadDefault({ documentId, filename: name }));
    const effectiveIsDownloading = onDownload ? isDownloading : isDownloadingDefault;

    const renewalLabels: Record<DocumentCardGridProps['renewal'], string> = {
        Renewable: t('renewalType.renewable'),
        'One-Time': t('renewalType.oneTime'),
    };

    const importanceLabels: Record<DocumentCardGridProps['importance'], string> = {
        Critical: t('common:priority.critical'),
        High: t('common:priority.high'),
        Medium: t('common:priority.medium'),
    };

    const statusLabels: Record<DocumentCardGridProps['status'], string> = {
        Expires: t('common:status.expires'),
        Expired: t('common:status.expired'),
        Active: t('common:status.active'),
    };
    return (
        <div
            className={`rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-border transition-all duration-300 ${importanceMode.bg}`}
        >
            {/* Card Header */}
            <div className="relative h-32 bg-gradient-to-br from-muted to-muted flex items-center justify-center border-b border-border">
                <div className="text-6xl opacity-50">{icon}</div>
                <div className="absolute top-3 end-3 flex items-center gap-1 bg-card/80 rounded-lg backdrop-blur-sm">
                    <DocumentIconToggleButton
                        icon={Star}
                        active={isFavorited}
                        pending={isFavoritePending}
                        onClick={toggleFavorite}
                        label={isFavorited ? t('common:actions.unfavorite') : t('common:actions.favorite')}
                    />
                    <DocumentIconToggleButton
                        icon={Pin}
                        active={isPinned}
                        pending={isPinPending}
                        onClick={togglePin}
                        label={isPinned ? t('common:actions.unpin') : t('common:actions.pin')}
                    />
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>

                {/* Department & Entity */}
                <div className="flex gap-2">
                    <span
                        title={departmentLabel}
                        className="min-w-0 flex-1 truncate px-2.5 py-1 bg-card border border-border text-muted-foreground text-xs font-medium rounded-lg text-center"
                    >
                        {departmentLabel}
                    </span>
                    <span
                        title={entityLabel}
                        className="min-w-0 flex-1 truncate px-2.5 py-1 bg-card border border-border text-muted-foreground text-xs font-medium rounded-lg text-center"
                    >
                        {entityLabel}
                    </span>
                </div>

                {/* Renewal & Importance */}
                <div className="flex gap-2">
                    <span
                        title={renewalLabel ?? renewalLabels[renewal]}
                        className={`min-w-0 flex-1 truncate px-2.5 py-1 text-xs font-medium rounded-lg text-center ${renewalStyles[renewal]}`}
                    >
                        {renewalLabel ?? renewalLabels[renewal]}
                    </span>
                    <span
                        title={importanceLabel ?? importanceLabels[importance]}
                        className={`min-w-0 flex-1 truncate px-2.5 py-1 text-xs font-semibold rounded-lg text-center ${importanceMode.badge}`}
                    >
                        {importanceLabel ?? importanceLabels[importance]}
                    </span>
                </div>

                {/* Expiry & Status */}
                <div className="pt-1 space-y-1.5 border-t border-border">
                    <div className="flex items-center justify-between gap-2">
                        <span className="shrink-0 text-xs text-muted-foreground">{t('documentCardGrid.expiry')}</span>
                        <span
                            title={expiryDate}
                            className={`min-w-0 truncate text-xs font-medium ${statusStyles[status]}`}
                        >
                            {expiryDate}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="shrink-0 text-xs text-muted-foreground">{t('documentCardGrid.statusLabel')}</span>
                        <span
                            title={statusLabel ?? statusLabels[status]}
                            className={`min-w-0 max-w-[65%] truncate px-2 py-0.5 text-xs font-semibold rounded-lg text-center ${status === 'Expired'
                                ? 'bg-destructive/10 text-destructive'
                                : status === 'Active'
                                    ? 'bg-success/10 text-success'
                                    : 'bg-warning/10 text-warning'
                                }`}
                        >
                            {statusLabel ?? statusLabels[status]}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                    <button
                        onClick={onView ?? (() => navigate({ to: `/${tenant}/documents/${id}` }))}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                    >
                        {t('documentCardGrid.view')}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={downloadDisabled || effectiveIsDownloading}
                        className="flex-1 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors font-medium text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted"
                    >
                        {effectiveIsDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        <span className="hidden sm:inline">{t('common:actions.download')}</span>
                    </button>
                </div>

                {footerActions && <div className="flex gap-2">{footerActions}</div>}
            </div>
        </div>
    );
}
