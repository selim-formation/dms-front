import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pin } from 'lucide-react';
import PinnedDocumentCard from '@/features/documents/components/pinned/PinnedDocumentCard';
import ProfileEmptyState from './ProfileEmptyState';
import type { PinnedDocumentData } from '@/features/documents/types/pinned.types';

interface ProfilePinnedTabProps {
    pinnedDocuments: PinnedDocumentData[];
}

function ProfilePinnedTab({ pinnedDocuments }: ProfilePinnedTabProps) {
    const { t } = useTranslation('profile');

    if (pinnedDocuments.length === 0) {
        return <ProfileEmptyState icon={Pin} message={t('empty.pinned')} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedDocuments.map((pinned) => (
                <PinnedDocumentCard key={pinned.id} pinned={pinned} />
            ))}
        </div>
    );
}

export default memo(ProfilePinnedTab);
