import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Star, Pin, ListChecks } from 'lucide-react';
import ProfileStatTile from './ProfileStatTile';
import type { ProfileStats } from '../types/profile.types';

interface ProfileStatsRowProps {
    stats: ProfileStats;
}

function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
    const { t } = useTranslation('profile');

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ProfileStatTile icon={FileText} label={t('stats.documents')} value={stats.documents_count} />
            <ProfileStatTile icon={Star} label={t('stats.favorites')} value={stats.favorites_count} />
            <ProfileStatTile icon={Pin} label={t('stats.pinned')} value={stats.pinned_documents_count} />
            <ProfileStatTile icon={ListChecks} label={t('stats.tasks')} value={stats.tasks_count} />
        </div>
    );
}

export default memo(ProfileStatsRow);
