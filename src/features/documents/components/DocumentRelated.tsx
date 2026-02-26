import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';

interface RelatedDocument {
    id: string;
    title: string;
    type: string;
}

interface DocumentRelatedProps {
    documents: RelatedDocument[];
    fileTypeColors: Record<string, string>;
    onDocumentClick?: (id: string) => void;
}

const DocumentRelated: React.FC<DocumentRelatedProps> = ({
    documents,
    fileTypeColors,
    onDocumentClick,
}) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Related Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {documents.map((rd) => (
                    <div
                        key={rd.id}
                        onClick={() => onDocumentClick?.(rd.id)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                        <div className={`h-9 w-9 rounded-lg ${fileTypeColors[rd.type] || 'bg-muted text-muted-foreground'} flex items-center justify-center`}>
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {rd.title}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase">.{rd.type}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentRelated);
