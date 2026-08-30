import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface DocumentIconToggleButtonProps {
    icon: LucideIcon;
    active: boolean;
    pending?: boolean;
    onClick: () => void;
    label: string;
    className?: string;
}

/**
 * Small reusable icon button used to toggle a document's pinned/favorited
 * state directly from a card or header, with a highlighted style when active.
 */
function DocumentIconToggleButton({
    icon: Icon,
    active,
    pending = false,
    onClick,
    label,
    className = '',
}: DocumentIconToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            disabled={pending}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${active
                ? 'text-warning bg-warning/10 hover:bg-warning/20'
                : 'text-muted-foreground hover:bg-card/60'
                } ${className}`}
        >
            <Icon size={16} fill={active ? 'currentColor' : 'none'} />
        </button>
    );
}

export default memo(DocumentIconToggleButton);
