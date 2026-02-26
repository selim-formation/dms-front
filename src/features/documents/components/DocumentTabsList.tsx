import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface DocumentTab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface DocumentTabsListProps {
    tabs: DocumentTab[];
    defaultTab?: string;
}

const DocumentTabsList: React.FC<DocumentTabsListProps> = ({ tabs, defaultTab = 'details' }) => {
    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 gap-0 mt-4">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="py-6">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default React.memo(DocumentTabsList);
