import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Share2, Shield } from 'lucide-react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';
import CreateShareDialog from './document-shares/CreateShareDialog';

interface AccessPerson {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

interface DocumentPermissionsProps {
    people: AccessPerson[];
    documentId: number;
    documentTitle?: string;
    onAddPeople?: () => void;
}

const DocumentPermissions: React.FC<DocumentPermissionsProps> = ({
    people,
    documentId,
    documentTitle,
    onAddPeople,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    const { can } = usePermissions();
    const canShare = can('create_document_shares');
    const [isShareOpen, setIsShareOpen] = useState(false);

    const handleAddPeople = useCallback(() => {
        setIsShareOpen(true);
        onAddPeople?.();
    }, [onAddPeople]);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">{t('documentPermissions.title')}</h3>
                    {canShare && (
                        <Button size="sm" onClick={handleAddPeople}>
                            <Share2 className="me-2 h-4 w-4" /> {t('documentPermissions.addPeople')}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {people.map((person) => (
                    <div
                        key={person.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {person.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{person.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            <Shield className="me-1 h-3 w-3" /> {person.role}
                        </Badge>
                    </div>
                ))}
            </CardContent>

            {canShare && (
                <CreateShareDialog
                    documentId={documentId}
                    documentTitle={documentTitle}
                    open={isShareOpen}
                    onOpenChange={setIsShareOpen}
                />
            )}
        </Card>
    );
};

export default React.memo(DocumentPermissions);
