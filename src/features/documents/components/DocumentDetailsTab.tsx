import React from 'react';

interface DocumentDetailsTabProps {
    mainContent: React.ReactNode;
    sidebar: React.ReactNode;
}

const DocumentDetailsTab: React.FC<DocumentDetailsTabProps> = ({
    mainContent,
    sidebar,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {mainContent}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {sidebar}
            </div>
        </div>
    );
};

export default React.memo(DocumentDetailsTab);
