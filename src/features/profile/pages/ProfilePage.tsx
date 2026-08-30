import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileDocumentsTab from '../components/ProfileDocumentsTab';
import ProfileFavoritesTab from '../components/ProfileFavoritesTab';
import ProfilePinnedTab from '../components/ProfilePinnedTab';
import ProfileTasksTab from '../components/ProfileTasksTab';
import ProfileSkeleton from '../components/ProfileSkeleton';
import ProfileErrorState from '../components/ProfileErrorState';
import { useProfile } from '../hooks/useProfile';

const DEFAULT_RECENT_LIMIT = 5;
const RECENT_LIMIT_STEP = 5;
const MAX_RECENT_LIMIT = 20;

export default function ProfilePage() {
    const { t } = useTranslation('profile');
    const [recentLimit, setRecentLimit] = useState(DEFAULT_RECENT_LIMIT);
    const { profile, isLoading, isError, error, refetch, isFetching } = useProfile({ recentLimit });

    const handleShowMore = useCallback(() => {
        setRecentLimit((prev) => Math.min(prev + RECENT_LIMIT_STEP, MAX_RECENT_LIMIT));
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {isLoading ? (
                    <ProfileSkeleton />
                ) : isError || !profile ? (
                    <ProfileErrorState message={error?.message || t('errorTitle')} onRetry={() => refetch()} />
                ) : (
                    <>
                        <ProfileHeaderCard user={profile.user} />
                        <ProfileStatsRow stats={profile.stats} />

                        <Tabs defaultValue="documents" className="w-full">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <TabsList>
                                    <TabsTrigger value="documents">{t('tabs.documents')}</TabsTrigger>
                                    <TabsTrigger value="favorites">{t('tabs.favorites')}</TabsTrigger>
                                    <TabsTrigger value="pinned">{t('tabs.pinned')}</TabsTrigger>
                                    <TabsTrigger value="tasks">{t('tabs.tasks')}</TabsTrigger>
                                </TabsList>
                                {recentLimit < MAX_RECENT_LIMIT && (
                                    <button
                                        onClick={handleShowMore}
                                        disabled={isFetching}
                                        className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
                                    >
                                        {isFetching ? t('loadingMore') : t('showMore')}
                                    </button>
                                )}
                            </div>

                            <TabsContent value="documents" className="pt-4">
                                <ProfileDocumentsTab documents={profile.documents} />
                            </TabsContent>
                            <TabsContent value="favorites" className="pt-4">
                                <ProfileFavoritesTab favorites={profile.favorites} />
                            </TabsContent>
                            <TabsContent value="pinned" className="pt-4">
                                <ProfilePinnedTab pinnedDocuments={profile.pinned_documents} />
                            </TabsContent>
                            <TabsContent value="tasks" className="pt-4">
                                <ProfileTasksTab tasks={profile.tasks} />
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </main>
        </div>
    );
}
