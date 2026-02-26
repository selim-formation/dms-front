import { MoreHorizontal, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

interface DocumentRowProps {
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    expiryDate: string;
    status: 'Expires' | 'Expired';
    isNew?: boolean;
}

const importanceStyles = {
    Critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' },
    High: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100' },
    Medium: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
};

const renewalStyles = {
    Renewable: 'bg-purple-100 text-purple-700',
    'One-Time': 'bg-gray-100 text-gray-700',
};

const statusStyles = {
    Expires: 'text-amber-600',
    Expired: 'text-red-600',
};

export default function DocumentRow({
    name,
    department,
    entity,
    renewal,
    importance,
    expiryDate,
    status,
    isNew,
}: DocumentRowProps) {
    const [showMenu, setShowMenu] = useState(false);
    const importMode = importanceStyles[importance];

    return (
        <div
            className={`flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${importMode.bg
                }`}
        >
            {/* Checkbox */}
            <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />

            {/* Document Name & New Badge */}
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{name}</span>
                    {isNew && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            New
                        </span>
                    )}
                </div>
            </div>

            {/* Department Label */}
            <div className="w-28">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-xl">
                    {department}
                </span>
            </div>

            {/* Entity Label */}
            <div className="w-28">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-xl">
                    {entity}
                </span>
            </div>

            {/* Renewal Badge */}
            <div className="w-24">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-xl ${renewalStyles[renewal]}`}>
                    {renewal}
                </span>
            </div>

            {/* Importance Badge */}
            <div className="w-20">
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl border ${importMode.badge} ${importMode.text}`}
                >
                    {importance}
                </span>
            </div>

            {/* Expiry Date */}
            <div className="w-32">
                <span className={`text-xs font-medium ${statusStyles[status]}`}>{expiryDate}</span>
            </div>

            {/* Status */}
            <div className="w-20">
                <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-lg ${status === 'Expired'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                >
                    {status}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-blue-600">
                    <Download size={16} />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-blue-600">
                    <Share2 size={16} />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Preview
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Edit Details
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100">
                                Duplicate
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
