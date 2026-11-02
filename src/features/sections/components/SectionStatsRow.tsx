import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, ImageIcon } from 'lucide-react'
import TeamStatCard from '@/features/teams/components/TeamStatCard'
import { useSectionStats } from '../hooks/useSectionStats'

/** Independent of search/filters — counts the whole tenant. */
function SectionStatsRow() {
    const { t } = useTranslation('sections')
    const { stats, isLoading } = useSectionStats()

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TeamStatCard
                icon={Layers}
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
        </div>
    )
}

export default memo(SectionStatsRow)
