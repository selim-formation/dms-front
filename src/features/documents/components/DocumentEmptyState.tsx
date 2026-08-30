import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DocumentEmptyStateProps {
    searchQuery: string;
    onUploadClick?: () => void;
}

const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({ searchQuery, onUploadClick }) => {
    const { t } = useTranslation(['documents', 'common']);

    return (
        <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('documentEmptyState.title')}</h3>
            <p className="text-muted-foreground mb-6">
                {searchQuery ? t('documentEmptyState.withQuery') : t('documentEmptyState.withoutQuery')}
            </p>
            <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold"
            >
                <Plus size={18} />
                {t('common:actions.uploadDocument')}
            </button>
        </div>
    );
};

export default React.memo(DocumentEmptyState);
