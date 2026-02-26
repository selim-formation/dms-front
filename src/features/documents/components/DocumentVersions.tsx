import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';

interface Version {
    id: string;
    version: number;
    note: string;
    user: string;
    date: string;
    size: string;
}

interface DocumentVersionsProps {
    versions: Version[];
}

const DocumentVersions: React.FC<DocumentVersionsProps> = ({ versions }) => {
    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                {versions.map((v, i) => (
                    <div
                        key={v.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                    >
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                            v{v.version}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{v.note}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {v.user} · {v.date} · {v.size}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {i === 0 && (
                                <Badge className="bg-primary/10 text-primary border-0">Current</Badge>
                            )}
                            <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentVersions);
