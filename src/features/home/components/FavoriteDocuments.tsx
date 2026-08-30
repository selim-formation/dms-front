import { useMemo, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useLastFavorites } from '@/features/documents/hooks/useLastFavorites';
import { useDeleteFavorite } from '@/features/documents/hooks/useDeleteFavorite';
import {
  DocumentCardSkeleton,
  DocumentListErrorState,
  DocumentListEmptyState,
} from './shared/DocumentListStates';

/**
 * Favorite Document Card Component
 */
const FavoriteDocCard = memo(function FavoriteDocCard({
  id,
  title,
  description,
  note,
  userName,
  createdDate,
}: {
  id: number;
  title: string;
  description: string | null;
  note: string | null;
  userName: string;
  createdDate: string;
}) {
  const { t } = useTranslation(['home', 'common']);
  const [showMenu, setShowMenu] = useState(false);
  const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite({
    onSuccess: () => {
      setShowMenu(false);
    },
    onError: (error) => {
      console.error('Failed to remove favorite:', error);
    },
  });

  const handleUnfavorite = () => {
    removeFavorite(id);
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 rounded-t-lg bg-warning/15">
          <Star className="h-8 w-8 text-warning" fill="currentColor" />
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={t('favoriteDocuments.moreOptions')}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute end-0 top-6 w-32 bg-popover border border-border rounded-lg shadow-lg z-20">
                <button
                  onClick={handleUnfavorite}
                  disabled={isRemoving}
                  className="w-full text-start px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isRemoving ? t('favoriteDocuments.unfavoriting') : t('common:actions.unfavorite')}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-3 space-y-2">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h3>
          {(note || description) && (
            <p className="text-xs text-muted-foreground truncate">{note || description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('favoriteDocuments.favoritedBy')}</span>
            <span className="text-xs font-medium text-foreground">{userName}</span>
          </div>
          <div className="text-xs text-muted-foreground pt-1 border-t border-border">
            {new Date(createdDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * FavoriteDocuments Component
 *
 * Fetches and displays last favorite documents with:
 * - Real-time data from API
 * - TanStack Query caching
 * - React.memo optimization
 * - Loading, error, and empty states
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
            <FavoriteDocCard
              key={fav.id}
              id={fav.id}
              title={fav.document.title}
              description={fav.document.description}
              note={fav.note}
              userName={fav.user.name}
              createdDate={fav.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
});

FavoriteDocumentsComponent.displayName = 'FavoriteDocuments';

export default FavoriteDocumentsComponent;
