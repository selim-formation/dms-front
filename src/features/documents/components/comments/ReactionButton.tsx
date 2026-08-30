import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ReactionType } from '../../types/comment.types';

interface ReactionButtonProps {
  type: ReactionType;
  icon: LucideIcon;
  label: string;
  count: number;
  isActive: boolean;
  isPending: boolean;
  onToggle: (type: ReactionType) => void;
}

function ReactionButtonComponent({
  type,
  icon: Icon,
  label,
  count,
  isActive,
  isPending,
  onToggle,
}: ReactionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-pressed={isActive}
      disabled={isPending}
      onClick={() => onToggle(type)}
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
    >
      <Icon size={13} className={isActive ? 'fill-primary/20' : ''} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

export const ReactionButton = memo(ReactionButtonComponent);
