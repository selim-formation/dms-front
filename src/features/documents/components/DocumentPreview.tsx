import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

interface DocumentPreviewProps {
    icon: React.ReactNode;
    colorClass: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
    icon,
    colorClass,
}) => {
    const { t } = useTranslation(['documents', 'common']);
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <div className={`h-16 w-16 rounded-2xl ${colorClass} flex items-center justify-center`}>
                    {icon}
                </div>
                <p className="text-muted-foreground text-sm">{t('documentPreview.label')}</p>
                <Button variant="outline" size="sm">
                    <ExternalLink className="me-2 h-4 w-4" /> {t('documentPreview.openInViewer')}
                </Button>
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentPreview);
