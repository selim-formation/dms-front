import { memo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : (parts[0]?.slice(0, 2) ?? '?').toUpperCase();
}

interface ProfileAvatarProps {
    name: string;
    avatarUrl?: string | null;
    size?: 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<ProfileAvatarProps['size']>, string> = {
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
};

function ProfileAvatar({ name, avatarUrl, size = 'md' }: ProfileAvatarProps) {
    return (
        <Avatar className={SIZE_CLASSES[size]}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
}

export default memo(ProfileAvatar);
