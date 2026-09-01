/**
 * Types / Entities / Departments — tenant reference-data lookup lists.
 * Read-only (index only, CRUD lives in the Filament admin panel).
 * All three share this exact shape and envelope.
 */

export interface ReferenceItem {
    id: number;
    title: string;
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
