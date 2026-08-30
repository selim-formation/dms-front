import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function CommentsSkeleton({ rows = 3 }: { rows?: number }) {
  const { t } = useTranslation(['documents', 'common']);
  return (
    <div className="space-y-6" role="status" aria-label={`${t('comments.title')} ${t('common:common.loading')}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
