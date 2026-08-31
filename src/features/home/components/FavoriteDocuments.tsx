import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { useLastFavorites } from '@/features/documents/hooks/useLastFavorites';
import FavoriteDocumentCard from '@/features/documents/components/favorites/FavoriteDocumentCard';
import {
  DocumentCardSkeleton,
  DocumentListErrorState,
  DocumentListEmptyState,
} from './shared/DocumentListStates';

/**
 * FavoriteDocuments Component
 *
 * Fetches and displays last favorite documents, reusing the same
 * DocumentCardGrid-based card the main Favorites page and Documents
 * browse grid use, instead of a bespoke home-only card.
 */
const FavoriteDocumentsComponent = memo(function FavoriteDocuments() {
  const { t } = useTranslation(['home', 'common']);
  const {
    favorites,
    isLoading,
    isError,
    error,
    refetch,
  } = useLastFavorites();

  const displayDocuments = useMemo(() => favorites.slice(0, 6), [favorites]);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {t('favoriteDocuments.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('favoriteDocuments.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <DocumentListErrorState
          message={error?.message || t('favoriteDocuments.failedToLoad')}
          onRetry={() => refetch()}
        />
      ) : displayDocuments.length === 0 ? (
        <DocumentListEmptyState icon={Star} message={t('favoriteDocuments.noFavoriteDocuments')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDocuments.map((fav) => (
            <FavoriteDocumentCard key={fav.id} favorite={fav} />
          ))}
        </div>
      )}
    </div>
  );
});

FavoriteDocumentsComponent.displayName = 'FavoriteDocuments';

export default FavoriteDocumentsComponent;
