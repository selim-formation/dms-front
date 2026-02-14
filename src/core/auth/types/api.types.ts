/**
 * Auth API Response Types
 */

import { User } from "@/shared/types/common.types";

/**
 * Login response from /api/login
 */
export interface LoginResponse {
  data: {
    user: User & {
      email_verified_at: string | null;
      avatar: string | null | undefined;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
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
    authorization: {
      token: string;
      type: "bearer";
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
