import { useMemo } from "react";
import { usePermissions } from "@/core/auth/hooks/usePermissions";
import { navGroups, type NavGroupConfig } from "@/shared/components/layout/nav.config";

/** Groups with only the items the current user may see; empty groups are dropped. */
export function useVisibleNavGroups(): NavGroupConfig[] {
  const { can } = usePermissions();
  return useMemo(
    () =>
      navGroups
        .map((g) => ({ ...g, items: g.items.filter((i) => !i.permission || can(i.permission)) }))
        .filter((g) => g.items.length > 0),
    [can],
  );
}
