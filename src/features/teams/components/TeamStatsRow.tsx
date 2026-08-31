import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, UserCheck, Shield } from 'lucide-react'
import TeamStatCard from './TeamStatCard'
import { useTeamStats } from '../hooks/useTeamStats'

/**
 * Independent of search/filter state on purpose — computed server-side
 * over the full visible roster, not whatever's currently filtered below.
 */
function TeamStatsRow() {
    const { t } = useTranslation('teams')
    const { stats, isLoading } = useTeamStats()

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TeamStatCard
                icon={Users}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                value={stats?.total_members ?? null}
                label={t('teamPage.totalMembers')}
                isLoading={isLoading}
            />
            <TeamStatCard
                icon={UserCheck}
                iconBg="bg-success/10"
                iconColor="text-success"
                value={stats?.active_now ?? null}
                label={t('teamPage.activeNow')}
                isLoading={isLoading}
            />
            <TeamStatCard
                icon={Shield}
                iconBg="bg-accent/10"
                iconColor="text-accent"
                value={stats?.administrators ?? null}
                label={t('teamPage.administrators')}
                isLoading={isLoading}
            />
        </div>
    )
}

export default memo(TeamStatsRow)
