import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommentAvatar } from './CommentAvatar';
import { CommentReactionsBar } from './CommentReactionsBar';
import { CommentActionsMenu } from './CommentActionsMenu';
import { CommentComposer } from './CommentComposer';
import { useToggleReaction } from '../../hooks/useToggleReaction';
import { formatCommentTime } from '../../utils/commentDate';
import type { DocumentComment } from '../../types/comment.types';

interface CommentItemProps {
  comment: DocumentComment;
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  currentUserId: number | null;
  isReply?: boolean;
  canReply: boolean;
  onReply?: () => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  isEditPending?: boolean;
  isDeletePending?: boolean;
}

function CommentItemComponent({
  comment,
  documentId,
  documentVersionId,
  page = 1,
  perPage = 20,
  currentUserId,
  isReply = false,
  canReply,
  onReply,
  onEdit,
  onDelete,
  isEditPending = false,
  isDeletePending = false,
}: CommentItemProps) {
  const { t } = useTranslation(['documents', 'common']);
  const [isEditing, setIsEditing] = useState(false);

  const { toggleReaction, isPending: isReactionPending, pendingVariables } = useToggleReaction({
    documentId,
    documentVersionId,
    page,
    perPage,
  });

  const isAuthor = currentUserId !== null && comment.user_id === currentUserId;

  const handleToggleReaction = useCallback(
    (type: DocumentComment['reactions'][number]['reaction']) => {
      toggleReaction({ commentId: comment.id, reaction: type });
    },
    [toggleReaction, comment.id],
  );

  const handleSubmitEdit = useCallback(
    (content: string) => {
      onEdit(comment.id, content);
      setIsEditing(false);
    },
    [onEdit, comment.id],
  );

  const handleDelete = useCallback(() => {
    if (window.confirm(t('comments.deleteConfirm'))) onDelete(comment.id);
  }, [onDelete, comment.id, t]);

  if (comment.deleted_at) {
    return (
      <div className="flex gap-3 opacity-60">
        <CommentAvatar name={comment.author.name} size={isReply ? 'sm' : 'md'} />
        <p className="text-sm text-muted-foreground italic py-1.5">{t('comments.deleted')}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <CommentAvatar name={comment.author.name} size={isReply ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground flex-shrink-0">
              {formatCommentTime(comment.created_at)}
            </p>
          </div>
          <CommentActionsMenu
            isAuthor={isAuthor}
            canReply={canReply}
            onReply={onReply}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        </div>

        {isEditing ? (
          <div className="mt-2">
            <CommentComposer
              authorName={comment.author.name}
              initialValue={comment.content}
              submitLabel={t('common:actions.save')}
              isPending={isEditPending}
              autoFocus
              showAvatar={false}
              onSubmit={handleSubmitEdit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="mt-2">
            <CommentReactionsBar
              reactions={comment.reactions}
              currentUserId={currentUserId}
              isPending={isReactionPending}
              pendingType={pendingVariables?.commentId === comment.id ? pendingVariables.reaction : undefined}
              onToggle={handleToggleReaction}
            />
          </div>
        )}

        {isDeletePending && <p className="text-xs text-muted-foreground mt-1">{t('comments.deleting')}</p>}
      </div>
    </div>
  );
}

export const CommentItem = memo(CommentItemComponent);
