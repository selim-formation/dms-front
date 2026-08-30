import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import FavoriteCard from '@/features/documents/components/favorites/FavoriteCard';
import ProfileEmptyState from './ProfileEmptyState';
import { profileKeys } from '../api/profileKeys';
import type { FavoriteData } from '@/features/documents/types/favorites.types';

interface ProfileFavoritesTabProps {
    favorites: FavoriteData[];
}

function ProfileFavoritesTab({ favorites }: ProfileFavoritesTabProps) {
    const { t } = useTranslation('profile');
    const queryClient = useQueryClient();

    // FavoriteCard mutates via the favorites feature's own query cache;
    // resync the profile's embedded copy so unfavorite/note-edit shows immediately here too.
    const handleChanged = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: profileKeys.all });
    }, [queryClient]);

    if (favorites.length === 0) {
        return <ProfileEmptyState icon={Star} message={t('empty.favorites')} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
                <FavoriteCard key={favorite.id} favorite={favorite} onChanged={handleChanged} />
            ))}
        </div>
    );
}

export default memo(ProfileFavoritesTab);
