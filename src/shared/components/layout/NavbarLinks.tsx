import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const navItems = [
  { labelKey: "nav.home", to: "/$tenant" as const },
  { labelKey: "nav.documents", to: "/$tenant/documents" as const },
  { labelKey: "nav.tasks", to: "/$tenant/tasks" as const },
  { labelKey: "nav.favorites", to: "/$tenant/favorites" as const },
  { labelKey: "nav.pinnedDocuments", to: "/$tenant/pinned-documents" as const },
  { labelKey: "nav.documentShares", to: "/$tenant/document-shares" as const },
  { labelKey: "nav.teams", to: "/$tenant/teams" as const },
];

interface NavbarLinksProps {
  tenantId: string;
}

/**
 * Primary tenant-scoped navigation links, rendered as a pill tab bar.
 */
export function NavbarLinks({ tenantId }: NavbarLinksProps) {
  const { t } = useTranslation("common");
  const location = useLocation();

  const isActive = (to: string) => {
    const target = to.replace("$tenant", tenantId);
    // The home item's target is the bare tenant root ("/acme") — every
    // other route starts with that same prefix, so it needs an exact
    // match instead of startsWith or it would always show as active.
    if (target === `/${tenantId}`) {
      return location.pathname === target || location.pathname === `${target}/`;
    }
    return location.pathname.startsWith(target);
  };

  return (
    <nav className="hidden md:flex items-center gap-1 rounded-full bg-card px-1.5 py-1.5 border border-border overflow-x-auto scrollbar-hide">
      {navItems.map((item) => {
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            params={{ tenant: tenantId }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-foreground text-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
