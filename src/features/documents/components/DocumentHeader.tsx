import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { StatusBadge, ImportanceBadge } from './DocumentStatusBadge';
import { Badge } from '@/shared/components/ui/badge';
import type { DocumentStatus, Importance } from '../types/index';

interface DocumentHeaderProps {
    title: string;
    fileIcon: React.ReactNode;
    fileColorClass: string;
    status: DocumentStatus;
    importance: Importance;
    fileType: string;
    fileSize: string;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
    title,
    fileIcon,
    fileColorClass,
    status,
    importance,
    fileType,
    fileSize,
}) => {
    return (
        <Card className="overflow-hidden border-border/60">
            <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-6 pb-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 h-14 w-14 rounded-xl ${fileColorClass} flex items-center justify-center shadow-sm`}>
                            {fileIcon}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={status} />
                                <ImportanceBadge importance={importance} />
                                <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
                                    .{fileType}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{fileSize}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default React.memo(DocumentHeader);
