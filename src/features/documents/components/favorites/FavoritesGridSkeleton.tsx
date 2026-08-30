import { Skeleton } from '@/shared/components/ui/skeleton';

interface FavoritesGridSkeletonProps {
    count?: number;
}

export default function FavoritesGridSkeleton({ count = 6 }: FavoritesGridSkeletonProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="h-24 bg-muted" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <div className="pt-2 flex items-center justify-between border-t border-border">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-6 w-14" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
