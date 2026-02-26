import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card } from '@/shared/components/ui/card';

const DocumentViewSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    <Skeleton className="h-5 w-48" />

                    <Card>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-14 w-14 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-7 w-80" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            </div>

                            <Skeleton className="h-10 w-full" />

                            {/* Tabs skeleton */}
                            <div className="flex gap-4 mb-6 border-b">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-5 w-20" />
                                ))}
                            </div>

                            {/* Content skeleton */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-32 w-full" />
                                    <Skeleton className="h-40 w-full" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-64 w-full" />
                                    <Skeleton className="h-48 w-full" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DocumentViewSkeleton);
