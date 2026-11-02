import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Landmark, ImageIcon, Trash2 } from 'lucide-react'
import TeamStatCard from '@/features/teams/components/TeamStatCard'
import { useEntityStats } from '../hooks/useEntityStats'

/** Independent of search/filters — counts the whole tenant. */
function EntityStatsRow() {
    const { t } = useTranslation('entities')
    const { stats, isLoading } = useEntityStats()

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TeamStatCard
                icon={Landmark}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                value={stats?.total ?? null}
                label={t('stats.total')}
                isLoading={isLoading}
            />
            <TeamStatCard
                icon={ImageIcon}
                iconBg="bg-success/10"
                iconColor="text-success"
                value={stats?.with_image ?? null}
                label={t('stats.withImage')}
                isLoading={isLoading}
            />
            <TeamStatCard
                icon={Trash2}
                iconBg="bg-destructive/10"
                iconColor="text-destructive"
                value={stats?.trashed ?? null}
                label={t('stats.trashed')}
                isLoading={isLoading}
            />
        </div>
    )
}

export default memo(EntityStatsRow)
