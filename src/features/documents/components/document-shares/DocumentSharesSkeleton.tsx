import { Skeleton } from '@/shared/components/ui/skeleton';

interface DocumentSharesSkeletonProps {
    count?: number;
}

function DocumentSharesSkeleton({ count = 5 }: DocumentSharesSkeletonProps) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20 shrink-0" />
                </div>
            ))}
        </div>
    );
}

export default DocumentSharesSkeleton;
