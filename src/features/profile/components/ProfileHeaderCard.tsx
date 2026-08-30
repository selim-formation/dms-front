import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import ProfileAvatar from './ProfileAvatar';
import type { ProfileUser } from '../types/profile.types';

interface ProfileHeaderCardProps {
    user: ProfileUser;
}

function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
    const { t } = useTranslation('profile');

    return (
        <Card className="border-border rounded-xl">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <ProfileAvatar name={user.name} avatarUrl={user.avatar} size="lg" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div>
                        <h1 className="text-xl font-bold text-foreground truncate">{user.name}</h1>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {user.departments.map((dept) => (
                            <Badge key={dept.id} variant="secondary">
                                {dept.title}
                            </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground">
                            {t('joinedOn')} {new Date(user.joined_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(ProfileHeaderCard);
