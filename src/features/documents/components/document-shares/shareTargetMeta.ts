import { Building2, Layers, UserRound, type LucideIcon } from 'lucide-react';
import type { DocumentShareTargetType, SelectedShareTarget } from '../../types/documentShare.types';

/** Single source of truth for per-target-type icon + badge color. */
export const SHARE_TARGET_META: Record<
    DocumentShareTargetType,
    { icon: LucideIcon; badgeClass: string }
> = {
    user: { icon: UserRound, badgeClass: 'border-transparent bg-primary/10 text-primary' },
    department: { icon: Building2, badgeClass: 'border-transparent bg-info/10 text-info' },
    section: { icon: Layers, badgeClass: 'border-transparent bg-chart-4/10 text-chart-4' },
};

export const SHARE_TARGET_TYPES: DocumentShareTargetType[] = ['user', 'department', 'section'];

export const targetKey = (target: Pick<SelectedShareTarget, 'type' | 'id'>) => `${target.type}:${target.id}`;
