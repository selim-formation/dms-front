import { memo, useState } from 'react'
import { cn } from '@/lib/utils'
import { companyInitials } from '../utils/companyPayload'

interface CompanyLogoProps {
    name: string
    /** Signed URL (~2h). Falls back to initials when missing or expired. */
    src: string | null
    className?: string
    muted?: boolean
    /** Signed URLs expire: lets the owner refetch when the <img> fails. */
    onLoadError?: () => void
}

/** Round company logo with an initials avatar when missing or broken. */
function CompanyLogo({ name, src, className, muted, onLoadError }: CompanyLogoProps) {
    // Track which src failed so a refreshed URL gets a fresh attempt.
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const showImage = !!src && failedSrc !== src

    return (
        <div
            className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold',
                muted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn('h-full w-full object-cover', muted && 'opacity-60')}
                    onError={() => {
                        setFailedSrc(src)
                        onLoadError?.()
                    }}
                />
            ) : (
                <span aria-hidden="true">{companyInitials(name)}</span>
            )}
        </div>
    )
}

export default memo(CompanyLogo)
