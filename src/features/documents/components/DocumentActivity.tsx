import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface Activity {
    id: string;
    user: string;
    action: string;
    date: string;
    icon: React.ReactNode;
}

interface DocumentActivityProps {
    activities: Activity[];
}

const DocumentActivity: React.FC<DocumentActivityProps> = ({ activities }) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="relative space-y-0">
                    {activities.map((activity, i) => (
                        <div key={activity.id} className="flex gap-4 pb-6 relative">
                            {i < activities.length - 1 && (
                                <div className="absolute start-[17px] top-10 bottom-0 w-px bg-border" />
                            )}
                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-muted flex items-center justify-center z-10">
                                {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <p className="text-sm text-foreground">
                                    <span className="font-medium">{activity.user}</span>{' '}
                                    <span className="text-muted-foreground">{activity.action}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentActivity);
