import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import DocumentResultsSummary from '../components/DocumentResultsSummary';
import FavoritesPageHeader from '../components/favorites/FavoritesPageHeader';
import FavoritesGrid from '../components/favorites/FavoritesGrid';
import FavoritesGridSkeleton from '../components/favorites/FavoritesGridSkeleton';
import FavoritesPagination from '../components/favorites/FavoritesPagination';
import { FavoritesEmptyState, FavoritesErrorState } from '../components/favorites/FavoritesStates';
import { useFavorites } from '../hooks/useFavorites';

const PER_PAGE = 12;

export default function FavoritesPage() {
    const { t } = useTranslation('documents');
    const [page, setPage] = useState(1);

    const { favorites, meta, isLoading, isFetching, isError, error, refetch } = useFavorites({
        page,
        per_page: PER_PAGE,
    });

    const handlePageChange = useCallback((nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <FavoritesPageHeader />

                {!isLoading && !isError && (
                    <DocumentResultsSummary title={t('favoritesPage.title')} count={meta?.total ?? favorites.length} />
                )}

                {isLoading ? (
                    <FavoritesGridSkeleton count={PER_PAGE} />
                ) : isError ? (
                    <FavoritesErrorState
                        message={error?.message || t('favoritesPage.errorTitle')}
                        onRetry={() => refetch()}
                    />
                ) : favorites.length === 0 ? (
                    <FavoritesEmptyState />
                ) : (
                    <>
                        <FavoritesGrid favorites={favorites} />
                        <FavoritesPagination
                            currentPage={meta?.current_page ?? page}
                            lastPage={meta?.last_page ?? 1}
                            onPageChange={handlePageChange}
                            disabled={isFetching}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
