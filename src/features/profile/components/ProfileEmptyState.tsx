import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ProfileEmptyStateProps {
    icon: LucideIcon;
    message: string;
}

function ProfileEmptyState({ icon: Icon, message }: ProfileEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-lg border border-border/50 bg-muted/30">
            <Icon className="h-9 w-9 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground text-center">{message}</p>
        </div>
    );
}

export default memo(ProfileEmptyState);
