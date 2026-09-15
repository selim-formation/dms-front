import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import FavoriteDocumentCard from '@/features/documents/components/favorites/FavoriteDocumentCard';
import ProfileEmptyState from './ProfileEmptyState';
import type { FavoriteData } from '@/features/documents/types/favorites.types';

interface ProfileFavoritesTabProps {
    favorites: FavoriteData[];
}

function ProfileFavoritesTab({ favorites }: ProfileFavoritesTabProps) {
    const { t } = useTranslation('profile');

    if (favorites.length === 0) {
        return <ProfileEmptyState icon={Star} message={t('empty.favorites')} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
                <FavoriteDocumentCard key={favorite.id} favorite={favorite} />
            ))}
        </div>
    );
}

export default memo(ProfileFavoritesTab);
