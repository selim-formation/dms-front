import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListChecks } from 'lucide-react';
import ProfileTaskCard from './ProfileTaskCard';
import ProfileEmptyState from './ProfileEmptyState';
import type { ProfileTask } from '../types/profile.types';

interface ProfileTasksTabProps {
    tasks: ProfileTask[];
}

function ProfileTasksTab({ tasks }: ProfileTasksTabProps) {
    const { t } = useTranslation('profile');

    if (tasks.length === 0) {
        return <ProfileEmptyState icon={ListChecks} message={t('empty.tasks')} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.map((task) => (
                <ProfileTaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}

export default memo(ProfileTasksTab);
