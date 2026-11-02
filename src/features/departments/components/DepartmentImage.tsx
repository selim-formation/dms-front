import { memo, useState } from 'react'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepartmentImageProps {
    src: string | null
    alt: string
    className?: string
    iconClassName?: string
    /** Signed URLs expire (~2h): lets the owner refetch when the <img> fails. */
    onLoadError?: () => void
}

/** Round department image with a placeholder avatar when missing or expired. */
function DepartmentImage({ src, alt, className, iconClassName, onLoadError }: DepartmentImageProps) {
    // Track which src failed so a refreshed URL gets a fresh attempt.
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const showImage = !!src && failedSrc !== src

    return (
        <div
            className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary',
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={() => {
                        setFailedSrc(src)
                        onLoadError?.()
                    }}
                />
            ) : (
                <Building2 className={cn('h-6 w-6', iconClassName)} aria-hidden="true" />
            )}
        </div>
    )
}

export default memo(DepartmentImage)
