/**
 * useAbility Hook
 * CASL-style ability checker (placeholder for future enhancement)
 */

import { useAuth } from "./useAuth";
import type { AbilityAction, AbilitySubject } from "@/shared/types/permission.types";

interface AbilityHook {
  /** Check if user can perform action on subject */
  can: (action: AbilityAction, subject: AbilitySubject) => boolean;

  /** Check if user cannot perform action on subject */
  cannot: (action: AbilityAction, subject: AbilitySubject) => boolean;
}

/**
 * Hook for CASL-style ability checking
 * Currently this is a simplified version - can be enhanced with CASL library
 */
export function useAbility(): AbilityHook {
  const { permissions } = useAuth();

  const can = (action: AbilityAction, subject: AbilitySubject): boolean => {
    // Simple permission check based on naming convention
    // e.g., "view" + "Document" => "documents.view"
    const permissionKey = `${subject.toLowerCase()}s.${action}`;
    return permissions.includes(permissionKey);
  };

  const cannot = (action: AbilityAction, subject: AbilitySubject): boolean => {
    return !can(action, subject);
  };

  return {
    can,
    cannot,
  };
}
