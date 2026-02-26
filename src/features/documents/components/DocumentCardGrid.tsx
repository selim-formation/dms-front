import { Download, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface DocumentCardGridProps {
    id: string;
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    icon?: string;
}

const importanceStyles = {
    Critical: {
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-700',
        dotColor: 'bg-red-500',
    },
    High: {
        bg: 'bg-orange-50',
        badge: 'bg-orange-100 text-orange-700',
        dotColor: 'bg-orange-500',
    },
    Medium: {
        bg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-700',
        dotColor: 'bg-blue-500',
    },
};

const renewalStyles = {
    Renewable: 'bg-purple-100 text-purple-700',
    'One-Time': 'bg-gray-100 text-gray-700',
};

const statusStyles = {
    Expires: 'text-amber-600',
    Expired: 'text-red-600',
};

export default function DocumentCardGrid({
    id,
    name,
    department,
    entity,
    renewal,
    importance,
    expiryDate,
    status,
    icon = '📄',
}: DocumentCardGridProps) {
    const [showMenu, setShowMenu] = useState(false);
    const importanceMode = importanceStyles[importance];
    const navigate = useNavigate();

    return (
        <div
            className={`rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300 ${importanceMode.bg}`}
        >
            {/* Card Header */}
            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
                <div className="text-6xl opacity-50">{icon}</div>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                >
                    <MoreVertical size={16} className="text-gray-500" />
                </button>
                {showMenu && (
                    <div className="absolute top-10 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Preview
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Share
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>

                {/* Department & Entity */}
                <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg">
                        {department}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg">
                        {entity}
                    </span>
                </div>

                {/* Renewal & Importance */}
                <div className="flex gap-2">
                    <span
                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-lg ${renewalStyles[renewal]}`}
                    >
                        {renewal}
                    </span>
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg ${importanceMode.badge}`}>
                        {importance}
                    </span>
                </div>

                {/* Expiry & Status */}
                <div className="pt-1 space-y-1.5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Expiry</span>
                        <span className={`text-xs font-medium ${statusStyles[status]}`}>{expiryDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Status</span>
                        <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-lg ${status === 'Expired'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                    <button onClick={() => navigate({ to: `/asd/documents/${id}` })} className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
                        View
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-1.5">
                        <Download size={14} />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
