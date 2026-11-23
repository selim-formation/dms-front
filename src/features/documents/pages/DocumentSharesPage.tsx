import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import DocumentSharesPanel from '../components/document-shares/DocumentSharesPanel';

const DocumentSharesPageHeader = memo(function DocumentSharesPageHeader() {
    const { t } = useTranslation('documents');
    return (
        <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground">{t('documentShares.pageTitle')}</h1>
            <p className="text-muted-foreground text-sm mt-2">{t('documentShares.pageSubtitle')}</p>
        </div>
    );
});

/** Direct route (kept for deep links); the Documents page hosts the same panel. */
export default function DocumentSharesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <DocumentSharesPageHeader />
                <DocumentSharesPanel />
            </main>
        </div>
    );
}
