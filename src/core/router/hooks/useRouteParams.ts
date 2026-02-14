/**
 * Type-safe route params hook
 * Re-export of TanStack Router's useParams with type helpers
 */

import { useParams } from "@tanstack/react-router";

export { useParams };

/**
 * Get tenant from route params
 */
export function useTenantParam(): string {
  const params = useParams({ strict: false });
  return (params as any).tenant || "";
}

/**
 * Get document ID from route params
 */
export function useDocumentIdParam(): string {
  const params = useParams({ strict: false });
  return (params as any).documentId || "";
}

/**
 * Get workspace ID from route params
 */
export function useWorkspaceIdParam(): string {
  const params = useParams({ strict: false });
  return (params as any).workspaceId || "";
}

/**
 * Get user ID from route params
 */
export function useUserIdParam(): string {
  const params = useParams({ strict: false });
  return (params as any).userId || "";
}

/**
 * Get team ID from route params
 */
export function useTeamIdParam(): string {
  const params = useParams({ strict: false });
  return (params as any).teamId || "";
}
