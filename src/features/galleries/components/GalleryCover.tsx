import { memo, useState } from 'react'
import { ImageOff, Images } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryCoverProps {
    /** Temporary link: used as-is, never stored. */
    src: string | null
    alt: string
    className?: string
    /** Empty galleries show the "images" glyph; a broken / expired link shows the broken-image one. */
    onError?: () => void
}

/** Lazy thumbnail with a neutral placeholder when there is no cover or the link fails. */
function GalleryCover({ src, alt, className, onError }: GalleryCoverProps) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const failed = !!src && failedSrc === src

    return (
        <div className={cn('flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground', className)}>
            {src && !failed ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={() => { setFailedSrc(src); onError?.() }}
                />
            ) : failed ? (
                <ImageOff className="h-5 w-5" aria-label={alt} />
            ) : (
                <Images className="h-5 w-5" aria-hidden="true" />
            )}
        </div>
    )
}

export default memo(GalleryCover)
