import { memo } from 'react';
import { Check } from 'lucide-react';
import { SHARE_TARGET_META } from './shareTargetMeta';
import type { SelectedShareTarget } from '../../types/documentShare.types';

interface ShareTargetRowProps {
    target: SelectedShareTarget;
    selected: boolean;
    disabled?: boolean;
    onToggle: (target: SelectedShareTarget) => void;
}

/** One selectable recipient row (user, department or section). */
function ShareTargetRow({ target, selected, disabled, onToggle }: ShareTargetRowProps) {
    const { icon: Icon } = SHARE_TARGET_META[target.type];

    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onToggle(target)}
            className={`flex w-full items-center gap-3 px-3 py-2 text-sm text-start transition-colors hover:bg-accent disabled:opacity-50 ${
                selected ? 'bg-primary/5' : ''
            }`}
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{target.name}</span>
                {target.description && (
                    <span className="block truncate text-xs text-muted-foreground">{target.description}</span>
                )}
            </span>
            <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    selected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                }`}
            >
                {selected && <Check className="h-3.5 w-3.5" />}
            </span>
        </button>
    );
}

export default memo(ShareTargetRow);
