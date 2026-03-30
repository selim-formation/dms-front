import { useMemo, memo, useState } from 'react';
import { FileText, MoreVertical, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useLastPinnedDocuments } from '@/features/documents/hooks/useLastPinnedDocuments';
import { useUnpinDocument } from '@/features/documents/hooks/useUnpinDocument';

/**
 * Pinned Document Card Component
 */
const PinnedDocCard = memo(function PinnedDocCard({
  id,
  title,
  description,
  userName,
  createdDate,
}: {
  id: number;
  title: string;
  description: string | null;
  userName: string;
  createdDate: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const { mutate: unpinDoc, isPending: isUnpinning } = useUnpinDocument({
    onSuccess: () => {
      setShowMenu(false);
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
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={handleUnpin}
                  disabled={isUnpinning}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isUnpinning ? 'Unpinning...' : 'Unpin'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-3 space-y-2">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Pinned by:</span>
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
 * Skeleton Loader
 */
const SkeletonCard = () => (
  <Card className="border-border">
    <CardContent className="p-0">
      <div className="h-14 bg-muted rounded-t-lg" />
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Error State Component
 */
const ErrorState = memo(function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-border/50 bg-muted/30">
      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-sm font-medium text-foreground mb-3">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
});

/**
 * Empty State Component
 */
const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-border/50 bg-muted/30">
      <FileText className="h-10 w-10 text-muted-foreground/40 mb-2" />
      <p className="text-sm text-muted-foreground text-center">
        No pinned documents yet
      </p>
    </div>
  );
});

/**
 * PinnedDocuments Component
 * 
 * Fetches and displays last pinned documents with:
 * - Real-time data from API
 * - TanStack Query caching
 * - React.memo optimization
 * - Loading, error, and empty states
 */
const PinnedDocumentsComponent = memo(function PinnedDocuments() {
  // Fetch last pinned documents
  const {
    pinnedDocuments,
    isLoading,
    isError,
    error,
    refetch,
  } = useLastPinnedDocuments();

  // Memoize documents for rendering
  const displayDocuments = useMemo(
    () =>
      pinnedDocuments.sort((a, b) => a.order - b.order).slice(0, 6),
    [pinnedDocuments]
  );

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Pinned Documents
        </h2>
        <p className="text-sm text-muted-foreground">
          Important or frequently-used documents today.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={error?.message || 'Failed to load pinned documents'}
          onRetry={() => refetch()}
        />
      ) : displayDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDocuments.map((doc) => (
            <PinnedDocCard
              key={doc.id}
              id={doc.id}
              title={doc.document.title}
              description={doc.document.description}
              userName={doc.user.name}
              createdDate={doc.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
});

PinnedDocumentsComponent.displayName = 'PinnedDocuments';

export default PinnedDocumentsComponent;
