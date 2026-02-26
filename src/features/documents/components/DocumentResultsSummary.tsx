import React from 'react';

interface DocumentResultsSummaryProps {
    title: string;
    count: number;
}

const DocumentResultsSummary: React.FC<DocumentResultsSummaryProps> = ({ title, count }) => {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {count} document{count !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
};

export default React.memo(DocumentResultsSummary);
