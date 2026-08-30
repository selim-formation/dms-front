import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ProfileStatTileProps {
    icon: LucideIcon;
    label: string;
    value: number;
}

function ProfileStatTile({ icon: Icon, label, value }: ProfileStatTileProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground truncate">{label}</p>
            </div>
        </div>
    );
}

export default memo(ProfileStatTile);
