import { memo } from 'react'
import { cn } from '@/lib/utils'
import { userInitials } from '../utils/userPayload'

interface UserAvatarProps {
    name: string
    email: string
    /** Signed image URL; falls back to initials when missing or broken. */
    src?: string | null
    className?: string
    muted?: boolean
}

/** Initials badge (the avatar URL is a temporary signed link, so it is never persisted). */
function UserAvatar({ name, email, src, className, muted }: UserAvatarProps) {
    const base = 'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold'

    if (src) {
        return <img src={src} alt="" loading="lazy" className={cn(base, 'object-cover', muted && 'opacity-60', className)} />
    }

    return (
        <div
            aria-hidden="true"
            className={cn(base, muted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary', className)}
        >
            {userInitials(name, email)}
        </div>
    )
}

export default memo(UserAvatar)
