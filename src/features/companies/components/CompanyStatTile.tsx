import { memo, type ReactNode } from 'react'

interface CompanyStatTileProps {
    icon: ReactNode
    label: string
    value: number
}

/** One number with its icon and label (members / documents / features). */
function CompanyStatTile({ icon, label, value }: CompanyStatTileProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                {icon}
            </span>
            <div>
                <p className="text-xl font-semibold tabular-nums text-foreground">{new Intl.NumberFormat().format(value)}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    )
}

export default memo(CompanyStatTile)
