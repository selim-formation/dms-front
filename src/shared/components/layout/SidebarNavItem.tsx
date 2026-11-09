import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import type { NavItemConfig } from "./nav.config";

interface SidebarNavItemProps {
  item: NavItemConfig;
  tenantId: string;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

/** One link. Memoised on primitives, so a route change re-renders only the two items whose `active` flipped. */
function SidebarNavItem({ item, tenantId, active, collapsed, onNavigate }: SidebarNavItemProps) {
  const { t, i18n } = useTranslation("common");
  const Icon = item.icon;
  const label = t(item.labelKey);

  const link = (
    <Link
      // Every route here takes only `$tenant`; the pattern strings are config-driven.
      to={item.to as "/$tenant"}
      params={{ tenant: tenantId }}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border py-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        collapsed ? "justify-center px-0" : "px-4",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border/60 text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side={i18n.dir() === "rtl" ? "left" : "right"}>{label}</TooltipContent>
    </Tooltip>
  );
}

export default memo(SidebarNavItem);
