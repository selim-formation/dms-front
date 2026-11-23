import { memo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import SidebarNav from "./SidebarNav";
import { useSidebar } from "./sidebar.context";

const SIDEBAR_WIDTH = "w-60";
const SIDEBAR_RAIL_WIDTH = "w-16";

/** Desktop (≥ lg) fixed sidebar with a persisted collapse-to-icons mode. */
function AppSidebar({ tenantId }: { tenantId: string }) {
  const { t, i18n } = useTranslation("common");
  const sidebar = useSidebar();
  if (!sidebar) return null;
  const { collapsed, toggleCollapsed } = sidebar;
  const label = t(collapsed ? "sidebar.expand" : "sidebar.collapse");

  return (
    <div
      className={cn(
        "fixed bottom-3 top-[4.75rem] start-3 z-20 hidden transition-[width] duration-200 lg:block",
        collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH,
      )}
    >
      <aside className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
        <SidebarNav tenantId={tenantId} collapsed={collapsed} />
      </aside>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={label}
            aria-pressed={collapsed}
            className="group absolute inset-y-6 -end-1.5 z-30 w-3 cursor-pointer focus-visible:outline-none"
          >
            <span className="absolute inset-y-0 start-1/2 w-0.5 -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover:bg-primary/60 group-focus-visible:bg-primary" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={i18n.dir() === "rtl" ? "left" : "right"}>{label}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default memo(AppSidebar);
