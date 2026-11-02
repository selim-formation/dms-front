import { memo } from 'react'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoleAvatarProps {
    className?: string
    iconClassName?: string
}

/** Round shield tile used by cards and the details dialog. */
function RoleAvatar({ className, iconClassName }: RoleAvatarProps) {
    return (
        <div
            className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10', className)}
            aria-hidden="true"
        >
            <ShieldCheck className={cn('h-6 w-6 text-primary', iconClassName)} />
        </div>
    )
}

export default memo(RoleAvatar)
