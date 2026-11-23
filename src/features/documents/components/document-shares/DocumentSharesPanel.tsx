import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import DocumentSharesList from './DocumentSharesList';

/** Given / received shares, without a page shell, so any page can host it. */
function DocumentSharesPanel() {
    const { t } = useTranslation('documents');

    return (
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
    );
}

export default memo(DocumentSharesPanel);
