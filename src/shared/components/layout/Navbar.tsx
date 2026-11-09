import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

import Logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { NavbarActions } from "./NavbarActions";
import { useSidebar } from "./sidebar.context";

/**
 * Sticky full-width top bar: mobile menu button (inside the shell),
 * the logo and the actions on every screen; the sidebar sits below it.
 */
export default function Navbar() {
  const { t } = useTranslation("common");
  // Read tenant straight off the matched route params: TenantProvider's id is
  // set via an async setState in beforeLoad and can lag one paint behind.
  const { tenant: tenantId } = useParams({ strict: false });
  const sidebar = useSidebar();

  const logo = <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md",
        // Full width: reclaim the column the shell reserved for the sidebar.
        sidebar && "lg:-ms-[var(--sidebar-w)]",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {sidebar && (
            <button
              type="button"
              onClick={sidebar.openMobile}
              aria-label={t("sidebar.open")}
              aria-expanded={sidebar.mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          <div>
            {tenantId ? (
              <Link to="/$tenant" params={{ tenant: tenantId }} className="flex items-center">
                {logo}
              </Link>
            ) : (
              <Link to="/" className="flex items-center">
                {logo}
              </Link>
            )}
          </div>
        </div>

        <NavbarActions />
      </div>
    </header>
  );
}
