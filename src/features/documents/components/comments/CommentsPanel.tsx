import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { useDocumentComments } from '../../hooks/useDocumentComments';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useUpdateComment } from '../../hooks/useUpdateComment';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import { useUser } from '@/core/auth/hooks/useAuth';
import { CommentComposer } from './CommentComposer';
import { CommentsList } from './CommentsList';
import { CommentsSkeleton } from './CommentsSkeleton';

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;
const LOAD_MORE_STEP = 20;

interface CommentsPanelProps {
  documentId: number;
  documentVersionId?: number;
  className?: string;
}

export function CommentsPanel({ documentId, documentVersionId, className = '' }: CommentsPanelProps) {
  const { t } = useTranslation('documents');
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const user = useUser();
  const currentUserId = user ? Number(user.id) : null;

  const { comments, meta, isLoading, isError, error } = useDocumentComments(documentId, {
    documentVersionId,
    perPage,
  });

  const listVars = { documentId, documentVersionId, page: 1, perPage };

  const { createComment, isPending: isCreatePending } = useCreateComment(listVars);
  const { updateComment, isPending: isUpdatePending } = useUpdateComment(listVars);
  const { deleteComment, isPending: isDeletePending } = useDeleteComment(listVars);

  const handleNewComment = useCallback(
    (content: string) => {
      createComment({ content, document_id: documentId, document_version_id: documentVersionId });
    },
    [createComment, documentId, documentVersionId],
  );

  const handleReply = useCallback(
    (parentId: number, content: string) => {
      createComment({
        content,
        document_id: documentId,
        document_version_id: documentVersionId,
        parent_id: parentId,
      });
    },
    [createComment, documentId, documentVersionId],
  );

  const handleEdit = useCallback(
    (commentId: number, content: string) => {
      updateComment({ commentId, payload: { content } });
    },
    [updateComment],
  );

  const handleDelete = useCallback(
    (commentId: number) => {
      deleteComment(commentId);
    },
    [deleteComment],
  );

  const canLoadMore = !!meta && perPage < Math.min(meta.totalCount, MAX_PER_PAGE);

  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare size={20} />
        {t('comments.title')} {meta ? `(${meta.totalCount})` : ''}
      </h3>

      <div className="mb-6 pb-6 border-b border-border">
        <CommentComposer
          authorName={user?.name ?? t('comments.you')}
          isPending={isCreatePending}
          onSubmit={handleNewComment}
        />
      </div>

      {isLoading && <CommentsSkeleton />}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <AlertTriangle size={16} />
          {error?.message ?? t('comments.failedToLoad')}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <CommentsList
            comments={comments}
            documentId={documentId}
            documentVersionId={documentVersionId}
            page={1}
            perPage={perPage}
            currentUserId={currentUserId}
            currentUserName={user?.name ?? t('comments.you')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReply={handleReply}
            isEditPending={isUpdatePending}
            isDeletePending={isDeletePending}
            isReplyPending={isCreatePending}
          />

          {canLoadMore && (
            <button
              type="button"
              onClick={() => setPerPage((p) => Math.min(p + LOAD_MORE_STEP, MAX_PER_PAGE))}
              className="mt-4 w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
            >
              {t('comments.loadMore')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
