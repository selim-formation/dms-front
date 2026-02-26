import { Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import DocumentRow from './DocumentRow';

interface GroupedDocument {
    id: string;
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    isNew?: boolean;
}

interface DocumentGroupCardProps {
    typeNameArabic: string;
    typeNameEnglish: string;
    count: number;
    documents: GroupedDocument[];
    onAddNew: () => void;
}

export default function DocumentGroupCard({
    typeNameArabic,
    typeNameEnglish,
    count,
    documents,
    onAddNew,
}: DocumentGroupCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Group Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`}
                        />
                    </button>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{typeNameArabic}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{typeNameEnglish}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full px-3 py-1 border border-gray-200">
                        <span className="text-xs font-semibold text-gray-700">{count} documents</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddNew();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </div>
            </div>

            {/* Group Content */}
            {isExpanded && (
                <div className="divide-y divide-gray-100">
                    {/* Header Row */}
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="w-6">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300"
                                onChange={(e) => {
                                    // Handle select all
                                    console.log('Select all:', e.target.checked);
                                }}
                            />
                        </div>
                        <div className="flex-1">Document Name</div>
                        <div className="w-28">Department</div>
                        <div className="w-28">Entity</div>
                        <div className="w-24">Renewal</div>
                        <div className="w-20">Importance</div>
                        <div className="w-32">Expiry Date</div>
                        <div className="w-20">Status</div>
                        <div className="w-20">Actions</div>
                    </div>

                    {/* Document Rows */}
                    {documents.map((doc) => (
                        <DocumentRow key={doc.id} {...doc} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {isExpanded && documents.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-4xl mb-4">📄</div>
                    <p className="text-gray-500 text-sm mb-4">No documents in this category</p>
                    <button
                        onClick={onAddNew}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        Add Your First Document
                    </button>
                </div>
            )}
        </div>
    );
}
