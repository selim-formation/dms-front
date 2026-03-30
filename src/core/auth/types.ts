/**
 * Authentication-related types
 */

import type { User } from "@/shared/types/common.types";
import type { PermissionString } from "@/shared/types/permission.types";

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
  user: User | null;
  permissions: PermissionString[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth context value
 */
export interface AuthContextValue extends AuthState {
  /** Login user */
  login: (credentials: LoginCredentials) => Promise<void>;

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
