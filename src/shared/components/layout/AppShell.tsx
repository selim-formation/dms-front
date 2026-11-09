import type { ReactNode } from "react";
import { useLocation, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/core/auth/hooks/useAuth";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import AppSidebar from "./AppSidebar";
import MobileSidebar from "./MobileSidebar";
import { SidebarProvider } from "./SidebarProvider";
import { useSidebar } from "./sidebar.context";

/** Pushes the page content aside on desktop; follows the rail width. */
function ShellFrame({ tenantId, children }: { tenantId: string; children: ReactNode }) {
  const collapsed = useSidebar()?.collapsed ?? false;
  return (
    <TooltipProvider delayDuration={150}>
      <AppSidebar tenantId={tenantId} />
      <MobileSidebar tenantId={tenantId} />
      {/* --sidebar-w lets the top bar pull itself back over the sidebar column. */}
      <div
        className={cn(
          "min-w-0 transition-[padding] duration-200 lg:ps-[var(--sidebar-w)]",
          collapsed ? "lg:[--sidebar-w:5.25rem]" : "lg:[--sidebar-w:16.75rem]",
        )}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}

/**
 * Tenant layout: sidebar + content. Anonymous visitors and the register page
 * get the bare content (no sidebar, plain top bar).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { tenant } = useParams({ strict: false });
  const pathname = useLocation({ select: (l) => l.pathname });

  if (!isAuthenticated || !tenant || pathname.endsWith("/register")) return <>{children}</>;

  return (
    <SidebarProvider>
      <ShellFrame tenantId={tenant}>{children}</ShellFrame>
    </SidebarProvider>
  );
}
