import { memo } from 'react';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { ProfileTask } from '../types/profile.types';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    todo: 'outline',
    in_progress: 'secondary',
    completed: 'default',
    blocked: 'destructive',
};

const PRIORITY_CLASS: Record<string, string> = {
    low: 'bg-secondary text-secondary-foreground',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-warning/20 text-warning',
    urgent: 'bg-destructive/10 text-destructive',
};

interface ProfileTaskCardProps {
    task: ProfileTask;
}

function ProfileTaskCard({ task }: ProfileTaskCardProps) {
    const statusKey = task.status?.toLowerCase() ?? '';
    const priorityKey = task.priority?.toLowerCase() ?? '';

    return (
        <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-foreground flex-1 break-words">{task.title}</h3>
                <Badge variant={STATUS_VARIANT[statusKey] ?? 'outline'} className="capitalize shrink-0">
                    {task.status?.replace(/_/g, ' ')}
                </Badge>
            </div>

            {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_CLASS[priorityKey] ?? 'bg-secondary text-secondary-foreground'}`}
                >
                    {task.priority}
                </span>
                {task.department && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                        {task.department.name}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                {task.assignee && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{task.assignee.name}</span>
                    </div>
                )}
                {task.due_date && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(ProfileTaskCard);
