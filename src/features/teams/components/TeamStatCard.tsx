import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'

interface TeamStatCardProps {
    icon: LucideIcon
    iconBg: string
    iconColor: string
    value: number | null
    label: string
    isLoading: boolean
}

function TeamStatCard({ icon: Icon, iconBg, iconColor, value, label, isLoading }: TeamStatCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
                {isLoading ? (
                    <Skeleton className="h-8 w-10" />
                ) : (
                    <p className="text-2xl font-bold text-foreground">{value ?? 0}</p>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    )
}

export default memo(TeamStatCard)
