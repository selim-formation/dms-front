import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import SidebarNav from "./SidebarNav";
import { useSidebar } from "./sidebar.context";

const SIDEBAR_WIDTH = "w-64";
const SIDEBAR_RAIL_WIDTH = "w-[4.5rem]";

/** Desktop (≥ lg) fixed sidebar with a persisted collapse-to-icons mode. */
function AppSidebar({ tenantId }: { tenantId: string }) {
  const { t, i18n } = useTranslation("common");
  const sidebar = useSidebar();
  if (!sidebar) return null;
  const { collapsed, toggleCollapsed } = sidebar;
  const label = t(collapsed ? "sidebar.expand" : "sidebar.collapse");

  return (
    <aside
      className={cn(
        "fixed bottom-3 top-[4.75rem] start-3 z-20 hidden flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[width] duration-200 lg:flex",
        collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH,
      )}
    >
      <SidebarNav tenantId={tenantId} collapsed={collapsed} />

      <div className="border-t border-border p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={label}
              aria-pressed={collapsed}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border border-border/60 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed ? "justify-center" : "px-4",
              )}
            >
              <ChevronsLeft
                className={cn("h-[18px] w-[18px] shrink-0 transition-transform rtl:rotate-180", collapsed && "rotate-180 rtl:rotate-0")}
                aria-hidden="true"
              />
              <span className={cn(collapsed && "sr-only")}>{label}</span>
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side={i18n.dir() === "rtl" ? "left" : "right"}>{label}</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
}

export default memo(AppSidebar);
