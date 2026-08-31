/**
 * Role/status → label & color mapping for team member badges.
 * `role` is a free string from Spatie (or null) — only a fixed known set
 * maps to a styled badge; anything else falls back to a neutral badge
 * showing the raw value instead of crashing on a missing color entry.
 */
import type { KnownTeamRole, TeamMemberStatus } from '../types/team.types'

const KNOWN_ROLES: readonly KnownTeamRole[] = ['admin', 'manager', 'head', 'key_user']

const ROLE_COLOR: Record<KnownTeamRole, string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    manager: 'bg-accent/10 text-accent border-accent/20',
    head: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    key_user: 'bg-muted text-muted-foreground border-border',
}

const NEUTRAL_ROLE_COLOR = 'bg-muted text-muted-foreground border-border'

function isKnownRole(role: string): role is KnownTeamRole {
    return (KNOWN_ROLES as readonly string[]).includes(role)
}

export function roleBadgeColor(role: string | null): string {
    if (role && isKnownRole(role)) return ROLE_COLOR[role]
    return NEUTRAL_ROLE_COLOR
}

/**
 * Resolves the display label for a role badge. Known roles go through
 * i18n; an unrecognized-but-present role shows its raw value as-is
 * (nothing to translate); no role shows the "no role" copy.
 */
export function roleLabel(role: string | null, t: (key: string) => string): string {
    if (role && isKnownRole(role)) return t(`teams:teamPage.role.${role}`)
    if (role) return role
    return t('teams:teamPage.role.none')
}

export const STATUS_DOT_COLOR: Record<TeamMemberStatus, string> = {
    active: 'bg-success',
    inactive: 'bg-muted-foreground/40',
}
