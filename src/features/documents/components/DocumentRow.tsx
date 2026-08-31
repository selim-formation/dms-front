import { MoreHorizontal, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    Critical: { bg: 'bg-destructive/5', border: 'border-destructive/30', text: 'text-destructive', badge: 'bg-destructive/10' },
    High: { bg: 'bg-warning/5', border: 'border-warning/30', text: 'text-warning', badge: 'bg-warning/10' },
    Medium: { bg: 'bg-info/5', border: 'border-info/30', text: 'text-info', badge: 'bg-info/10' },
};

const renewalStyles = {
    Renewable: 'bg-chart-1/10 text-chart-1',
    'One-Time': 'bg-muted text-muted-foreground',
};

const statusStyles = {
    Expires: 'text-warning',
    Expired: 'text-destructive',
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
    const { t } = useTranslation(['documents', 'common']);
    const importMode = importanceStyles[importance];

    const renewalLabels: Record<DocumentRowProps['renewal'], string> = {
        Renewable: t('documentRow.renewable'),
        'One-Time': t('documentRow.oneTime'),
    };

    const importanceLabels: Record<DocumentRowProps['importance'], string> = {
        Critical: t('common:priority.critical'),
        High: t('common:priority.high'),
        Medium: t('common:priority.medium'),
    };

    const statusLabels: Record<DocumentRowProps['status'], string> = {
        Expires: t('common:status.expires'),
        Expired: t('common:status.expired'),
    };

    return (
        <div
            className={`flex items-center gap-4 px-6 py-4 border-b border-border hover:bg-accent transition-colors group ${importMode.bg
                }`}
        >
            {/* Checkbox */}
            <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />

            {/* Document Name & New Badge */}
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{name}</span>
                    {isNew && (
                        <span className="px-2 py-1 bg-info/10 text-info text-xs font-semibold rounded-full">
                            {t('documentRow.new')}
                        </span>
                    )}
                </div>
            </div>

            {/* Department Label */}
            <div className="w-28">
                <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-xl">
                    {department}
                </span>
            </div>

            {/* Entity Label */}
            <div className="w-28">
                <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-xl">
                    {entity}
                </span>
            </div>

            {/* Renewal Badge */}
            <div className="w-24">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-xl ${renewalStyles[renewal]}`}>
                    {renewalLabels[renewal]}
                </span>
            </div>

            {/* Importance Badge */}
            <div className="w-20">
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl border ${importMode.badge} ${importMode.text}`}
                >
                    {importanceLabels[importance]}
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
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/10 text-warning'
                        }`}
                >
                    {statusLabels[status]}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-primary">
                    <Download size={16} />
                </button>
                <button className="p-1.5 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-primary">
                    <Share2 size={16} />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                        <div className="absolute end-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-20">
                            <button className="w-full text-start px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors">
                                {t('common:actions.pin')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
