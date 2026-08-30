import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentShareCard from './DocumentShareCard';
import DocumentSharesSkeleton from './DocumentSharesSkeleton';
import { DocumentSharesEmptyState, DocumentSharesErrorState } from './DocumentSharesStates';
import EditShareDialog from './EditShareDialog';
import RevokeShareDialog from './RevokeShareDialog';
import PaginationControl from '@/shared/components/ui/PaginationControl';
import { useDocumentShares } from '../../hooks/useDocumentShares';
import type { DocumentShareData, DocumentShareDirection } from '../../types/documentShare.types';

const PER_PAGE = 10;

interface DocumentSharesListProps {
    direction: DocumentShareDirection;
}

/**
 * Full list section for one tab (given/received): fetch, states, rows,
 * pagination, and — for the "given" side — the edit/revoke dialogs.
 */
function DocumentSharesList({ direction }: DocumentSharesListProps) {
    const { t } = useTranslation('documents');
    const [page, setPage] = useState(1);
    const [editTarget, setEditTarget] = useState<DocumentShareData | null>(null);
    const [revokeTarget, setRevokeTarget] = useState<DocumentShareData | null>(null);

    const { shares, meta, isLoading, isFetching, isError, error, refetch } = useDocumentShares(direction, {
        page,
        per_page: PER_PAGE,
    });

    const handlePageChange = useCallback((nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (isLoading) return <DocumentSharesSkeleton count={PER_PAGE} />;

    if (isError) {
        return (
            <DocumentSharesErrorState
                message={error?.message || t('documentShares.errorTitle')}
                onRetry={() => refetch()}
            />
        );
    }

    if (shares.length === 0) {
        return <DocumentSharesEmptyState direction={direction} />;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shares.map((share) => (
                    <DocumentShareCard
                        key={share.id}
                        share={share}
                        direction={direction}
                        onEdit={setEditTarget}
                        onRevoke={setRevokeTarget}
                    />
                ))}
            </div>

            <PaginationControl
                currentPage={meta?.current_page ?? page}
                lastPage={meta?.last_page ?? 1}
                onPageChange={handlePageChange}
                disabled={isFetching}
                label={t('favoritesPage.pageOf', { current: meta?.current_page ?? page, last: meta?.last_page ?? 1 })}
            />

            <EditShareDialog
                key={editTarget?.id ?? 'edit-none'}
                share={editTarget}
                open={!!editTarget}
                onOpenChange={(open) => !open && setEditTarget(null)}
            />

            <RevokeShareDialog
                share={revokeTarget}
                open={!!revokeTarget}
                onOpenChange={(open) => !open && setRevokeTarget(null)}
            />
        </>
    );
}

export default DocumentSharesList;
