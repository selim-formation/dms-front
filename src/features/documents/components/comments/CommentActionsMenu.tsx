import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal, Pencil, Trash2, Reply } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface CommentActionsMenuProps {
  isAuthor: boolean;
  canReply: boolean;
  onReply?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function CommentActionsMenuComponent({
  isAuthor,
  canReply,
  onReply,
  onEdit,
  onDelete,
}: CommentActionsMenuProps) {
  const { t } = useTranslation(['documents', 'common']);

  if (!isAuthor && !canReply) return null;

  return (
    <div className="flex items-center gap-1">
      {canReply && onReply && (
        <button
          type="button"
          onClick={onReply}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Reply size={13} /> {t('common:actions.reply')}
        </button>
      )}

      {isAuthor && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={t('reactions.commentActions')}
              className="p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="me-2 h-3.5 w-3.5" /> {t('common:actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="me-2 h-3.5 w-3.5" /> {t('common:actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export const CommentActionsMenu = memo(CommentActionsMenuComponent);
