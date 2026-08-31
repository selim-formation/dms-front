import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import DocumentResultsSummary from '../components/DocumentResultsSummary';
import PinnedDocumentsPageHeader from '../components/pinned/PinnedDocumentsPageHeader';
import PinnedDocumentsGrid from '../components/pinned/PinnedDocumentsGrid';
import FavoritesGridSkeleton from '../components/favorites/FavoritesGridSkeleton';
import {
    PinnedDocumentsEmptyState,
    PinnedDocumentsErrorState,
} from '../components/pinned/PinnedDocumentsStates';
import { usePinnedDocuments } from '../hooks/usePinnedDocuments';

// Backend caps this list server-side, not paginated — request a generous
// number of results instead of implementing pager UI for it.
const NUMBER_OF_DOCUMENTS = 50;

export default function PinnedDocumentsPage() {
    const { t } = useTranslation('documents');

    const { pinnedDocuments, isLoading, isError, error, refetch } = usePinnedDocuments({
        number_of_documents: NUMBER_OF_DOCUMENTS,
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <PinnedDocumentsPageHeader />

                {!isLoading && !isError && (
                    <DocumentResultsSummary
                        title={t('pinnedDocumentsPage.title')}
                        count={pinnedDocuments.length}
                    />
                )}

                {isLoading ? (
                    <FavoritesGridSkeleton count={9} />
                ) : isError ? (
                    <PinnedDocumentsErrorState
                        message={error?.message || t('pinnedDocumentsPage.errorTitle')}
                        onRetry={() => refetch()}
                    />
                ) : pinnedDocuments.length === 0 ? (
                    <PinnedDocumentsEmptyState />
                ) : (
                    <PinnedDocumentsGrid pinnedDocuments={pinnedDocuments} />
                )}
            </main>
        </div>
    );
}
