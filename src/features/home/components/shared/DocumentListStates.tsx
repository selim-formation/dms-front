import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Shared skeleton/error/empty states reused by the Pinned Documents and
 * Favorite Documents home widgets (identical layout, different copy/icon).
 */
export const DocumentCardSkeleton = () => (
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

export const DocumentListErrorState = memo(function DocumentListErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    const { t } = useTranslation('common');
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-border/50 bg-muted/30">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <p className="text-sm font-medium text-foreground mb-3">{message}</p>
            <Button size="sm" variant="outline" onClick={onRetry}>
                {t('common.tryAgain')}
            </Button>
        </div>
    );
});

export const DocumentListEmptyState = memo(function DocumentListEmptyState({
    icon: Icon,
    message,
}: {
    icon: LucideIcon;
    message: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-border/50 bg-muted/30">
            <Icon className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground text-center">{message}</p>
        </div>
    );
});
