import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { StatusBadge, ImportanceBadge } from './DocumentStatusBadge';

interface DocumentHeaderMetaProps {
    title: string;
    fileIcon: React.ReactNode;
    fileColorClass: string;
    status: string;
    importance: string;
    fileType: string;
    fileSize: string;
}

const DocumentHeaderMeta: React.FC<DocumentHeaderMetaProps> = ({
    title,
    fileIcon,
    fileColorClass,
    status,
    importance,
    fileType,
    fileSize,
}) => {
    return (
        <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 h-14 w-14 rounded-xl ${fileColorClass} flex items-center justify-center shadow-sm`}>
                {fileIcon}
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={status as any} />
                    <ImportanceBadge importance={importance as any} />
                    <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
                        .{fileType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{fileSize}</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DocumentHeaderMeta);
