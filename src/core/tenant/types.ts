/**
 * Tenant-related types
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  status: "active" | "suspended" | "trial";
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
  features: Record<string, boolean>;
  [key: string]: unknown;
}

/**
 * Outcome of GET /api/tenants/{tenant}/validate. The endpoint only ever
 * confirms existence + access — it doesn't return tenant details, so
 * there's no `Tenant` object here to hydrate `tenant`/`current` with.
 */
export type TenantValidationKind =
  | "valid"
  | "not_found"
  | "access_denied"
  | "unauthenticated"
  | "error";

export interface TenantValidationResult {
  kind: TenantValidationKind;
  tenantExists: boolean;
  hasAccess: boolean;
  message?: string;
}

export interface TenantContextValue {
  /** Current tenant ID (id or slug) from URL */
  tenantId: string | null;

  /** Full tenant object — not returned by /validate, always null today */
  tenant: Tenant | null;

  /** Alias for tenant object (for consistency with architecture) */
  current: Tenant | null;

  /** Whether tenant is being validated */
  isValidating: boolean;

  /** Whether tenant exists AND the current user has access to it */
  isValid: boolean;

  /** Validation error if any */
  error: Error | null;

  /** Manually set tenant ID (e.g., after URL parsing) */
  setTenantId: (tenantId: string | null) => void;

  /** Refetch tenant data */
  refetch: () => Promise<void>;
}
