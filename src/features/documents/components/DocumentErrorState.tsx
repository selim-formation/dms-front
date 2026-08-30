import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface DocumentErrorStateProps {
    tenantId: string;
}

const DocumentErrorState: React.FC<DocumentErrorStateProps> = ({ tenantId }) => {
    const navigate = useNavigate();
    const { t } = useTranslation(['documents', 'common']);

    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">{t('documentErrorState.title')}</h2>
            <p className="text-muted-foreground">{t('documentErrorState.description')}</p>
            <Button
                variant="outline"
                onClick={() => navigate({ to: `/${tenantId}/documents` })}
            >
                <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" /> {t('documentErrorState.backToDocuments')}
            </Button>
        </div>
    );
};

export default React.memo(DocumentErrorState);
