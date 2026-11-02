import { memo } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SHARE_TARGET_META, targetKey } from './shareTargetMeta';
import type { SelectedShareTarget } from '../../types/documentShare.types';

interface SelectedTargetChipsProps {
    targets: SelectedShareTarget[];
    onRemove: (target: SelectedShareTarget) => void;
    disabled?: boolean;
}

/** Removable chips for every target picked so far, regardless of the active tab. */
function SelectedTargetChips({ targets, onRemove, disabled }: SelectedTargetChipsProps) {
    const { t } = useTranslation('documents');

    if (targets.length === 0) return null;

    return (
        <ul className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto" aria-label={t('documentShares.form.selectedTargets')}>
            {targets.map((target) => {
                const { icon: Icon, badgeClass } = SHARE_TARGET_META[target.type];
                return (
                    <li
                        key={targetKey(target)}
                        className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                    >
                        <Icon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{target.name}</span>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onRemove(target)}
                            aria-label={t('documentShares.form.removeTarget', { name: target.name })}
                            className="rounded-full p-0.5 hover:bg-foreground/10 disabled:opacity-50"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

export default memo(SelectedTargetChips);
