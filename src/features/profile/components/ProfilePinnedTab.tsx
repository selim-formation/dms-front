import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Pin } from 'lucide-react';
import PinnedDocCard from '@/features/home/components/PinnedDocCard';
import ProfileEmptyState from './ProfileEmptyState';
import { profileKeys } from '../api/profileKeys';
import type { PinnedDocumentData } from '@/features/documents/types/pinned.types';

interface ProfilePinnedTabProps {
    pinnedDocuments: PinnedDocumentData[];
}

function ProfilePinnedTab({ pinnedDocuments }: ProfilePinnedTabProps) {
    const { t } = useTranslation('profile');
    const queryClient = useQueryClient();

    // PinnedDocCard mutates via the pinned-documents feature's own query cache;
    // resync the profile's embedded copy so unpin shows immediately here too.
    const handleUnpinned = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: profileKeys.all });
    }, [queryClient]);

    if (pinnedDocuments.length === 0) {
        return <ProfileEmptyState icon={Pin} message={t('empty.pinned')} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedDocuments.map((pinned) => (
                <PinnedDocCard
                    key={pinned.id}
                    id={pinned.id}
                    title={pinned.document.title}
                    description={pinned.document.description}
                    userName={pinned.user.name}
                    createdDate={pinned.created_at}
                    onUnpinned={handleUnpinned}
                />
            ))}
        </div>
    );
}

export default memo(ProfilePinnedTab);
