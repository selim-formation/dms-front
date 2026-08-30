import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { CommentThread } from './CommentThread';
import type { DocumentComment } from '../../types/comment.types';

interface CommentsListProps {
  comments: DocumentComment[];
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

function CommentsListComponent({
  comments,
  onEdit,
  onDelete,
  onReply,
  ...threadProps
}: CommentsListProps) {
  const { t } = useTranslation('documents');

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('comments.noComments')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          {...threadProps}
        />
      ))}
    </div>
  );
}

export const CommentsList = memo(CommentsListComponent);
