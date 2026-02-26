import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Share2, Shield } from 'lucide-react';

interface AccessPerson {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

interface DocumentPermissionsProps {
    people: AccessPerson[];
    onAddPeople?: () => void;
}

const DocumentPermissions: React.FC<DocumentPermissionsProps> = ({
    people,
    onAddPeople,
}) => {
    const handleAddPeople = useCallback(() => {
        onAddPeople?.();
    }, [onAddPeople]);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">Access Control</h3>
                    <Button size="sm" onClick={handleAddPeople}>
                        <Share2 className="mr-2 h-4 w-4" /> Add People
                    </Button>
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
                            <Shield className="mr-1 h-3 w-3" /> {person.role}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentPermissions);
