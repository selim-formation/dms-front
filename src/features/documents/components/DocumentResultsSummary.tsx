import React from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentResultsSummaryProps {
    title: string;
    count: number;
}

const DocumentResultsSummary: React.FC<DocumentResultsSummaryProps> = ({ title, count }) => {
    const { t } = useTranslation(['documents', 'common']);
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {t('documentResultsSummary.count', { count })}
                </p>
            </div>
        </div>
    );
};

export default React.memo(DocumentResultsSummary);
