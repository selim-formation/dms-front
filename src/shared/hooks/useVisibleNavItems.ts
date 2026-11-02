import { useMemo } from "react";
import { usePermissions } from "@/core/auth/hooks/usePermissions";
import { navItems } from "@/shared/components/layout/NavbarLinks";

/** Nav items the current user may see (entries without `permission` are public). */
export function useVisibleNavItems() {
  const { can } = usePermissions();
  return useMemo(
    () =>
      navItems.filter((item) => {
        const permission = (item as { permission?: string }).permission;
        return !permission || can(permission);
      }),
    [can],
  );
}
