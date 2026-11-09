import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanyCopyButtonProps {
    value: string
    className?: string
}

/** Copies `value` to the clipboard and confirms for a moment. Fails silently where the clipboard is blocked. */
function CompanyCopyButton({ value, className }: CompanyCopyButtonProps) {
    const { t } = useTranslation('companies')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        const timer = setTimeout(() => setCopied(false), 1500)
        return () => clearTimeout(timer)
    }, [copied])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
        } catch {
            /* clipboard unavailable: nothing to do */
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                className,
            )}
            aria-label={t(copied ? 'actions.copied' : 'actions.copy', { value })}
            title={t(copied ? 'actions.copied' : 'actions.copy', { value })}
        >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    )
}

export default memo(CompanyCopyButton)
