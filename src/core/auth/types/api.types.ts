/**
 * Auth API Response Types
 */

import type { User } from "@/shared/types/common.types";

/**
 * Login response from /api/login
 * Uses HTTP-only cookies for authentication (no Bearer token)
 */
export interface LoginResponse {
  data: {
    user: User & {
      id: number;
      email_verified_at: string | null;
      avatar: string | null | undefined;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      socialite_provider: string | null;
      socialite_id: string | null;
      socialite_token: string | null;
      socialite_refresh_token: string | null;
      socialite_token_expires_at: string | null;
      social_only: number;
      tenants: Array<{
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
      }>;
    };
    companies: Array<{
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
    }>;
  };
  message: string;
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
