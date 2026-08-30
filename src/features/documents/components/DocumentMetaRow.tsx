import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';

interface DocumentMetaRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
    highlight?: boolean;
    showSeparator?: boolean;
}

const DocumentMetaRow: React.FC<DocumentMetaRowProps> = ({
    icon: Icon,
    label,
    value,
    highlight = false,
    showSeparator = false,
}) => {
    return (
        <>
            <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {label}
                    </p>
                    <p className={`text-sm font-medium truncate ${highlight ? 'text-warning' : 'text-foreground'}`}>
                        {value}
                    </p>
                </div>
            </div>
            {showSeparator && <Separator />}
        </>
    );
};

export default React.memo(DocumentMetaRow);
