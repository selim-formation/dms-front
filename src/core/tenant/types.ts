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

export interface TenantValidation {
  valid: boolean;
  tenant?: Tenant;
  message?: string;
}

export interface TenantContextValue {
  /** Current tenant ID from URL */
  tenantId: string | null;

  /** Full tenant object (if validated) */
  tenant: Tenant | null;

  /** Alias for tenant object (for consistency with architecture) */
  current: Tenant | null;

  /** Whether tenant is being validated */
  isValidating: boolean;

  /** Whether tenant is valid */
  isValid: boolean;

  /** Validation error if any */
  error: Error | null;

  /** Manually set tenant ID (e.g., after URL parsing) */
  setTenantId: (tenantId: string | null) => void;

  /** Refetch tenant data */
  refetch: () => Promise<void>;
}
