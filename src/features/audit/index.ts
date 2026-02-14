/**
 * Audit Feature Module
 *
 * This module handles audit logging and activity tracking including:
 * - Audit log listing and filtering
 * - Activity tracking
 * - Compliance reporting
 * - Log export
 *
 * Structure:
 * - api/: API service functions and query/mutation hooks
 * - components/: React components specific to audit
 * - hooks/: Custom hooks for audit operations
 * - routes/: Route components for audit pages
 * - types/: TypeScript types for audit logs
 * - utils/: Utility functions for audit operations
 */

export const AUDIT_FEATURE = {
  name: "audit",
  description: "Audit logging feature",
  routes: ["/$tenant/audit", "/$tenant/audit/$logId"],
  permissions: ["audit.view", "audit.export"],
} as const;
