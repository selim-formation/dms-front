import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { Share2, User, Copy } from 'lucide-react';

interface DocumentEngagementProps {
    views: number;
    comments: number;
    downloads: number;
    onAddCollaborator?: () => void;
    onManageAccess?: () => void;
    onDuplicate?: () => void;
}

const DocumentEngagement: React.FC<DocumentEngagementProps> = ({
    views,
    comments,
    downloads,
    onAddCollaborator,
    onManageAccess,
    onDuplicate,
}) => {
    return (
        <Card>
            <div className="p-6">
                <h3 className="text-base font-semibold text-foreground mb-4">Engagement</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">{views}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">{comments}</p>
                            <p className="text-xs text-muted-foreground">Comments</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">{downloads}</p>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Collaborators</h4>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border-2 border-white">
                                    SC
                                </div>
                                <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                                    JP
                                </div>
                                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold border-2 border-white">
                                    LM
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">+2 more</span>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                            onClick={onAddCollaborator}
                        >
                            <Share2 className="mr-2 h-4 w-4" /> Add Collaborator
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                            onClick={onManageAccess}
                        >
                            <User className="mr-2 h-4 w-4" /> Manage Access
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                            onClick={onDuplicate}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default React.memo(DocumentEngagement);
