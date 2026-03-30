/**
 * Common domain types used across the application
 */

export interface AuthPayload {
  user: User;
  permissions: string[];
  roles: string[];
  companies: any[];
}

/**
 * User type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Tenant type
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  settings: TenantSettings;
  status: "active" | "suspended" | "trial";
  created_at: string;
  updated_at: string;
}

/**
 * Tenant settings
 */
export interface TenantSettings {
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
  features: Record<string, boolean>;
  [key: string]: unknown;
}

/**
 * Timestamps interface
 */
export interface Timestamps {
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

/**
 * ID type
 */
export type ID = string | number;

/**
 * Status types
 */
export type Status = "active" | "inactive" | "pending" | "archived";

/**
 * Generic list item
 */
export interface ListItem {
  id: ID;
  name: string;
  [key: string]: unknown;
}

/**
 * Select option
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * File metadata
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Upload progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
