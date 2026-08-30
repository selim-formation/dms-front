import { memo } from 'react';
import FavoriteDocumentCard from './FavoriteDocumentCard';
import type { FavoriteData } from '../../types/favorites.types';

interface FavoritesGridProps {
    favorites: FavoriteData[];
}

function FavoritesGrid({ favorites }: FavoritesGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
                <FavoriteDocumentCard key={favorite.id} favorite={favorite} />
            ))}
        </div>
    );
}

export default memo(FavoritesGrid);
