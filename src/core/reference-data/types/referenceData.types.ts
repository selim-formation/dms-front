/**
 * Types / Entities / Departments — tenant reference-data lookup lists.
 * Read-only (index only, CRUD lives in the Filament admin panel).
 * All three share this exact shape and envelope.
 */

export interface ReferenceItem {
    id: number;
    title: string;
    /** Some lists (e.g. sections) expose `name` instead of / alongside `title`. */
    name?: string;
    /** Sections only: the department they belong to. */
    department_id?: number | null;
    /** Temporary signed Wasabi URL (2h expiry), not a static path — don't persist across sessions. */
    image: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
}

export interface ReferenceListApiResponse {
    data: ReferenceItem[];
    message: string;
}

/** A tenant permission as listed by GET /api/{tenant}/permissions. */
export interface PermissionItem {
    id: number;
    name: string;
}

/** A tenant user as needed by pickers (responsible / cc). Roles and departments are best-effort. */
export interface UserItem {
    id: number;
    name: string;
    roles: string[];
    department_ids: number[];
}
