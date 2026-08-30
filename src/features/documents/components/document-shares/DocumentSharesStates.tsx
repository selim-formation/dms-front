import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react';
import type { DocumentShareDirection } from '../../types/documentShare.types';

export const DocumentSharesEmptyState = memo(function DocumentSharesEmptyState({
    direction,
}: {
    direction: DocumentShareDirection;
}) {
    const { t } = useTranslation('documents');
    return (
        <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <Share2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {t(`documentShares.empty.${direction}Title`)}
            </h3>
            <p className="text-muted-foreground">{t(`documentShares.empty.${direction}Description`)}</p>
        </div>
    );
});

export const DocumentSharesErrorState = memo(function DocumentSharesErrorState({
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
