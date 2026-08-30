import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Star } from 'lucide-react';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useDeleteFavorite } from '../../hooks/useDeleteFavorite';
import DocumentIconToggleButton from '../DocumentIconToggleButton';
import FavoriteNoteEditor from './FavoriteNoteEditor';
import type { FavoriteData } from '../../types/favorites.types';

interface FavoriteCardProps {
    favorite: FavoriteData;
    /** Called after a successful unfavorite/note-save — lets embedding pages
     * (e.g. the Profile page's own cached copy) invalidate their own queries. */
    onChanged?: () => void;
}

/**
 * Page-level favorite document card: title, note, favorited date,
 * unfavorite toggle (always highlighted/active), and a link into the document.
 */
function FavoriteCard({ favorite, onChanged }: FavoriteCardProps) {
    const { t } = useTranslation(['documents', 'common']);
    const navigate = useNavigate();
    const tenant = useTenantId();
    const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite({
        onSuccess: () => onChanged?.(),
    });

    const handleView = () => {
        navigate({ to: `/${tenant}/documents/${favorite.document.id}` });
    };

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative h-24 bg-gradient-to-br from-warning/10 to-warning/5 flex items-center justify-center border-b border-border">
                <FileText className="h-10 w-10 text-warning/70" />
                <div className="absolute top-3 end-3">
                    <DocumentIconToggleButton
                        icon={Star}
                        active
                        pending={isRemoving}
                        onClick={() => removeFavorite(favorite.id)}
                        label={t('favoritesPage.unfavorite')}
                        className="bg-card/80 backdrop-blur-sm"
                    />
                </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                    {favorite.document.title}
                </h3>

                <div className="flex-1">
                    <FavoriteNoteEditor favoriteId={favorite.id} note={favorite.note} onSaved={onChanged} />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                    <span className="text-xs text-muted-foreground">
                        {t('favoritesPage.favoritedOn')} {new Date(favorite.created_at).toLocaleDateString()}
                    </span>
                    <button
                        onClick={handleView}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-xs"
                    >
                        {t('favoritesPage.view')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(FavoriteCard);
