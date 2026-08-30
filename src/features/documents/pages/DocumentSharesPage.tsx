import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/shared/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import DocumentSharesList from '../components/document-shares/DocumentSharesList';

const DocumentSharesPageHeader = memo(function DocumentSharesPageHeader() {
    const { t } = useTranslation('documents');
    return (
        <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground">{t('documentShares.pageTitle')}</h1>
            <p className="text-muted-foreground text-sm mt-2">{t('documentShares.pageSubtitle')}</p>
        </div>
    );
});

export default function DocumentSharesPage() {
    const { t } = useTranslation('documents');

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <DocumentSharesPageHeader />

                <Tabs defaultValue="given">
                    <TabsList>
                        <TabsTrigger value="given">{t('documentShares.tabs.given')}</TabsTrigger>
                        <TabsTrigger value="received">{t('documentShares.tabs.received')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="given" className="mt-6">
                        <DocumentSharesList direction="given" />
                    </TabsContent>

                    <TabsContent value="received" className="mt-6">
                        <DocumentSharesList direction="received" />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
