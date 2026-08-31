/**
 * Auth API Response Types
 */

import type { User } from "@/shared/types/common.types";

/**
 * A tenant/company the user belongs to, as returned by /api/login and /api/me.
 * Backend calls this "companies" (user.tenants relation).
 */
export interface AuthCompany {
  id: string;
  name: string;
  slug: string;
  logo: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  data: unknown;
  pivot: {
    user_id: number;
    tenant_id: string;
    status: "active" | "inactive";
  };
}

/**
 * Login response from POST /api/login
 * Note: no bearer token in the body — auth is an httpOnly `access_token`
 * cookie set directly by the server (not readable/storable from JS).
 */
export interface LoginResponse {
  data: {
    user: User & {
      email_verified_at: string | null;
      avatar: string | null | undefined;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    companies: AuthCompany[];
  };
  message: string;
}

/**
 * GET /api/me response — bootstraps the session on app load.
 */
export interface MeResponse {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  permissions: string[];
  roles: string[];
  companies: AuthCompany[];
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Token storage structure
 */
export interface StoredAuth {
  token: string;
  type: "bearer";
  expiresAt?: number;
}
