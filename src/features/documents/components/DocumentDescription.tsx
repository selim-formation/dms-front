import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface DocumentDescriptionProps {
    description: string;
}

const DocumentDescription: React.FC<DocumentDescriptionProps> = ({ description }) => {
    const { t } = useTranslation(['documents', 'common']);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{t('documentDescription.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
};

export default React.memo(DocumentDescription);
