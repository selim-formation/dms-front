import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import { useUpdateFavorite } from '../../hooks/useUpdateFavorite';

interface FavoriteNoteEditorProps {
    favoriteId: number;
    note: string | null;
    /** Called after a successful save — lets embedding pages invalidate their own queries. */
    onSaved?: () => void;
}

/**
 * Inline-editable note under a favorite card.
 * Click to edit, Save persists via PUT /favorites/{id}, Cancel discards local edits.
 */
function FavoriteNoteEditor({ favoriteId, note, onSaved }: FavoriteNoteEditorProps) {
    const { t } = useTranslation(['documents', 'common']);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(note ?? '');
    const { mutate: saveNote, isPending } = useUpdateFavorite({
        onSuccess: () => {
            setIsEditing(false);
            onSaved?.();
        },
    });

    const startEditing = () => {
        setDraft(note ?? '');
        setIsEditing(true);
    };

    const handleSave = () => {
        saveNote(favoriteId, draft.trim());
    };

    if (isEditing) {
        return (
            <div className="space-y-2">
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={1000}
                    rows={2}
                    autoFocus
                    placeholder={t('favoritesPage.notePlaceholder')}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? t('favoritesPage.noteSaving') : t('favoritesPage.noteSave')}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        disabled={isPending}
                        className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        {t('favoritesPage.noteCancel')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={startEditing}
            className="w-full text-start group/note flex items-start gap-1.5 rounded-lg px-2 py-1.5 -mx-2 hover:bg-muted transition-colors"
            aria-label={t('favoritesPage.noteEdit')}
        >
            <Pencil size={12} className="mt-0.5 shrink-0 text-muted-foreground opacity-0 group-hover/note:opacity-100 transition-opacity" />
            <p className={`text-xs line-clamp-2 ${note ? 'text-muted-foreground' : 'text-muted-foreground/60 italic'}`}>
                {note || t('favoritesPage.noteEmpty')}
            </p>
        </button>
    );
}

export default memo(FavoriteNoteEditor);
