import { memo } from 'react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

interface CommentAvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2) ?? '?';
  return initials.toUpperCase();
}

function CommentAvatarComponent({ name, size = 'md' }: CommentAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';

  return (
    <Avatar className={sizeClass}>
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export const CommentAvatar = memo(CommentAvatarComponent);
