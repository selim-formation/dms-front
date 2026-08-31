/**
 * Authentication-related types
 */

import type { PermissionString } from "@/shared/types/permission.types";
import type { AuthCompany, MeResponse } from "./types/api.types";

/**
 * The authenticated user, as returned by GET /api/me.
 */
export type AuthUser = MeResponse["user"];

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Register data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null;
  permissions: PermissionString[];
  /** Tenants/companies the logged-in user belongs to (from /api/me) */
  companies: AuthCompany[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth context value
 */
export interface AuthContextValue extends AuthState {
  /** Login user. Resolves with the tenants the user can access. */
  login: (credentials: LoginCredentials) => Promise<AuthCompany[]>;

  /** Logout user */
  logout: () => Promise<void>;

  /** Register new user */
  register: (data: RegisterData) => Promise<void>;

  /** Refetch user data */
  refetchUser: () => Promise<void>;

  /** Check if user has permission */
  can: (permission: PermissionString) => boolean;

  /** Check if user has any of the permissions */
  canAny: (permissions: PermissionString[]) => boolean;

  /** Check if user has all permissions */
  canAll: (permissions: PermissionString[]) => boolean;
}
