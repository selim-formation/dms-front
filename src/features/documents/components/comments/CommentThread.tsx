import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommentItem } from './CommentItem';
import { CommentComposer } from './CommentComposer';
import type { DocumentComment } from '../../types/comment.types';

interface CommentThreadProps {
  comment: DocumentComment;
  documentId: number;
  documentVersionId?: number;
  page?: number;
  perPage?: number;
  currentUserId: number | null;
  currentUserName: string;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (parentId: number, content: string) => void;
  isEditPending?: boolean;
  isDeletePending?: boolean;
  isReplyPending?: boolean;
}

function CommentThreadComponent({
  comment,
  documentId,
  documentVersionId,
  page,
  perPage,
  currentUserId,
  currentUserName,
  onEdit,
  onDelete,
  onReply,
  isEditPending,
  isDeletePending,
  isReplyPending,
}: CommentThreadProps) {
  const { t } = useTranslation(['documents', 'common']);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleOpenReply = useCallback(() => setIsReplyOpen(true), []);
  const handleCancelReply = useCallback(() => setIsReplyOpen(false), []);
  const handleSubmitReply = useCallback(
    (content: string) => {
      onReply(comment.id, content);
      setIsReplyOpen(false);
    },
    [onReply, comment.id],
  );

  const itemProps = {
    documentId,
    documentVersionId,
    page,
    perPage,
    currentUserId,
    canReply: true,
    onReply: handleOpenReply,
    onEdit,
    onDelete,
    isEditPending,
    isDeletePending,
  };

  return (
    <div className="space-y-3">
      <CommentItem comment={comment} {...itemProps} />

      {comment.replies.length > 0 && (
        <div className="ms-11 space-y-3 border-s-2 border-border ps-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply {...itemProps} />
          ))}
        </div>
      )}

      {isReplyOpen && (
        <div className="ms-11 ps-4">
          <CommentComposer
            authorName={currentUserName}
            placeholder={t('comments.replyPlaceholder')}
            submitLabel={t('common:actions.reply')}
            isPending={isReplyPending}
            autoFocus
            showAvatar={false}
            onSubmit={handleSubmitReply}
            onCancel={handleCancelReply}
          />
        </div>
      )}
    </div>
  );
}

export const CommentThread = memo(CommentThreadComponent);
