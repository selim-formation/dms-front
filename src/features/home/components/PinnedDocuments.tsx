import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pin } from 'lucide-react';
import { useLastPinnedDocuments } from '@/features/documents/hooks/useLastPinnedDocuments';
import PinnedDocumentCard from '@/features/documents/components/pinned/PinnedDocumentCard';
import {
  DocumentCardSkeleton,
  DocumentListErrorState,
  DocumentListEmptyState,
} from './shared/DocumentListStates';

/**
 * PinnedDocuments Component
 *
 * Fetches and displays the last pinned documents with real API data,
 * reusing the same DocumentCardGrid-based card and loading/error/empty
 * states as the Favorite Documents widget.
 */
const PinnedDocumentsComponent = memo(function PinnedDocuments() {
  const { t } = useTranslation(['home', 'common']);
  const {
    pinnedDocuments,
    isLoading,
    isError,
    error,
    refetch,
  } = useLastPinnedDocuments();

  const displayDocuments = useMemo(() => pinnedDocuments.slice(0, 6), [pinnedDocuments]);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('pinnedDocuments.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('pinnedDocuments.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <DocumentListErrorState
          message={error?.message || t('pinnedDocuments.failedToLoad')}
          onRetry={() => refetch()}
        />
      ) : displayDocuments.length === 0 ? (
        <DocumentListEmptyState icon={Pin} message={t('pinnedDocuments.noPinnedDocuments')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDocuments.map((pinned) => (
            <PinnedDocumentCard key={pinned.id} pinned={pinned} />
          ))}
        </div>
      )}
    </div>
  );
});

PinnedDocumentsComponent.displayName = 'PinnedDocuments';

export default PinnedDocumentsComponent;
