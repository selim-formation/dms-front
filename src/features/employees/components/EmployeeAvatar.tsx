import { memo } from 'react'
import { cn } from '@/lib/utils'
import { employeeInitials } from '../utils/employeePayload'

interface EmployeeAvatarProps {
    name: string
    email: string
    className?: string
    muted?: boolean
}

/** Initials badge; no image exists for employees. */
function EmployeeAvatar({ name, email, className, muted }: EmployeeAvatarProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                muted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
                className,
            )}
        >
            {employeeInitials(name, email)}
        </div>
    )
}

export default memo(EmployeeAvatar)
