/**
 * Team Types
 * Matches the backend contract for GET /{tenant}/teams and /teams/stats.
 */

export interface TeamDepartment {
    id: number;
    title: string;
}

/**
 * Real Spatie roles on this backend (App\Enum\UserRolesEnum). `role` can
 * also be any other string, or null if the user has no role assigned —
 * never hardcode a fixed enum against it, always fall back gracefully.
 */
export type KnownTeamRole = 'admin' | 'manager' | 'head' | 'key_user';

export type TeamMemberStatus = 'active' | 'inactive';

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    departments: TeamDepartment[];
    role: string | null;
    /** Tenant-membership flag, NOT live online presence — no realtime presence exists on this backend. */
    status: TeamMemberStatus;
    documents_count: number;
    shared_count: number;
}

export interface TeamListParams {
    search?: string;
    department_id?: number;
    section_id?: number;
    per_page?: number;
    page?: number;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface TeamMembersPaginatedData {
    data: TeamMember[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface GetTeamMembersApiResponse {
    data: TeamMembersPaginatedData;
    message: string;
}

export interface TeamStats {
    total_members: number;
    active_now: number;
    administrators: number;
}

export interface GetTeamStatsApiResponse {
    data: TeamStats;
    message: string;
}

export interface GetDepartmentsApiResponse {
    data: TeamDepartment[];
    message: string;
}
