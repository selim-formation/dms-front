import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Pin } from 'lucide-react';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

export const PinnedDocumentsEmptyState = memo(function PinnedDocumentsEmptyState() {
    const { t } = useTranslation(['documents', 'common']);
    const tenant = useTenantId();

    return (
        <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <Pin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('pinnedDocumentsPage.emptyTitle')}</h3>
            <p className="text-muted-foreground mb-6">{t('pinnedDocumentsPage.emptyDescription')}</p>
            <Link
                to="/$tenant/documents"
                params={{ tenant: tenant ?? '' }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
            >
                {t('pinnedDocumentsPage.browseDocuments')}
            </Link>
        </div>
    );
});

export const PinnedDocumentsErrorState = memo(function PinnedDocumentsErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    const { t } = useTranslation('common');
    return (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-12 text-center">
            <p className="text-destructive font-semibold mb-2 text-lg">{message}</p>
            <button
                onClick={onRetry}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
                {t('common.tryAgain')}
            </button>
        </div>
    );
});
