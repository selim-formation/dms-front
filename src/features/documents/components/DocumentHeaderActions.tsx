import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Star, Pin, Share2, Download, Pencil, MoreHorizontal } from 'lucide-react';

interface DocumentHeaderActionsProps {
    onStar?: () => void;
    onPin?: () => void;
    onShare?: () => void;
    onDownload?: () => void;
    onEdit?: () => void;
    onMore?: () => void;
}

const DocumentHeaderActions: React.FC<DocumentHeaderActionsProps> = ({
    onStar,
    onPin,
    onShare,
    onDownload,
    onEdit,
    onMore,
}) => {
    return (
        <div className="flex items-center gap-2 flex-shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onStar}
            >
                <Star className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onPin}
            >
                <Pin className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
                variant="outline"
                size="sm"
                onClick={onShare}
            >
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
            >
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button
                size="sm"
                onClick={onEdit}
            >
                <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={onMore}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default React.memo(DocumentHeaderActions);
