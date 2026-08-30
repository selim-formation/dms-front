import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, CheckCircle2, XCircle, Star } from 'lucide-react';
import { ReactionButton } from './ReactionButton';
import type { CommentReaction, ReactionType } from '../../types/comment.types';

interface CommentReactionsBarProps {
  reactions: CommentReaction[];
  currentUserId: number | null;
  isPending: boolean;
  pendingType?: ReactionType;
  onToggle: (type: ReactionType) => void;
}

const REACTION_CONFIG: { type: ReactionType; icon: typeof ThumbsUp; labelKey: string }[] = [
  { type: 'like', icon: ThumbsUp, labelKey: 'reactions.like' },
  { type: 'approve', icon: CheckCircle2, labelKey: 'reactions.approve' },
  { type: 'reject', icon: XCircle, labelKey: 'reactions.reject' },
  { type: 'helpful', icon: Star, labelKey: 'reactions.helpful' },
];

function CommentReactionsBarComponent({
  reactions,
  currentUserId,
  isPending,
  pendingType,
  onToggle,
}: CommentReactionsBarProps) {
  const { t } = useTranslation('documents');

  const counts = useMemo(() => {
    const map = new Map<ReactionType, { count: number; isActive: boolean }>();
    for (const config of REACTION_CONFIG) map.set(config.type, { count: 0, isActive: false });

    for (const reaction of reactions) {
      const entry = map.get(reaction.reaction);
      if (!entry) continue;
      entry.count += 1;
      if (currentUserId !== null && reaction.user_id === currentUserId) entry.isActive = true;
    }

    return map;
  }, [reactions, currentUserId]);

  return (
    <div className="flex items-center gap-1.5">
      {REACTION_CONFIG.map(({ type, icon, labelKey }) => {
        const entry = counts.get(type)!;
        return (
          <ReactionButton
            key={type}
            type={type}
            icon={icon}
            label={t(labelKey)}
            count={entry.count}
            isActive={entry.isActive}
            isPending={isPending && pendingType === type}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}

export const CommentReactionsBar = memo(CommentReactionsBarComponent);
