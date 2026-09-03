import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useRecentDocuments } from '@/features/documents/hooks/useRecentDocuments';

interface Props {
  tenant: string;
}

const RECENT_DOCUMENTS_LIMIT = 5;

function RecentDocumentsSidebar({ tenant }: Props) {
  const { t } = useTranslation(['home', 'common']);
  const { documents, isLoading } = useRecentDocuments({ limit: RECENT_DOCUMENTS_LIMIT });

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">{t('recentDocumentsSidebar.title')}</CardTitle>
          <Link to="/$tenant/documents" params={{ tenant }} className="text-xs text-primary font-medium hover:underline">
            {t('recentDocumentsSidebar.viewAll')}
          </Link>
        </div>
      </CardHeader>

      {isLoading ? (
        <CardContent className="p-0 divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      ) : documents.length === 0 ? (
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          {t('recentDocumentsSidebar.empty')}
        </CardContent>
      ) : (
        <CardContent className="p-0 divide-y divide-border">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              to="/$tenant/documents/$id"
              params={{ tenant, id: String(doc.id) }}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {doc.department?.title ?? doc.category}
                  {doc.uploaded_by ? ` · ${doc.uploaded_by.name}` : ''}
                </p>
              </div>
              {/* Backend sends date-only d/m/Y, no time component — shown as-is, same
                  convention as the reminders drawer, not run through a relative-time parser. */}
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">{doc.created_at}</span>
            </Link>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

export default memo(RecentDocumentsSidebar);
