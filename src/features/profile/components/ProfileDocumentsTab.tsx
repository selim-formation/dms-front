import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import ProfileDocumentRow from './ProfileDocumentRow';
import ProfileEmptyState from './ProfileEmptyState';
import type { ProfileDocument } from '../types/profile.types';

interface ProfileDocumentsTabProps {
    documents: ProfileDocument[];
}

function ProfileDocumentsTab({ documents }: ProfileDocumentsTabProps) {
    const { t } = useTranslation('profile');

    if (documents.length === 0) {
        return <ProfileEmptyState icon={FileText} message={t('empty.documents')} />;
    }

    return (
        <div className="space-y-2">
            {documents.map((doc) => (
                <ProfileDocumentRow key={doc.id} document={doc} />
            ))}
        </div>
    );
}

export default memo(ProfileDocumentsTab);
