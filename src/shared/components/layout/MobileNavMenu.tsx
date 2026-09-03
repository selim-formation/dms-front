import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { navItems } from "./NavbarLinks";

interface MobileNavMenuProps {
  tenantId: string;
}

/**
 * Hamburger + slide-down panel that surfaces the primary nav links
 * below the `md` breakpoint, where NavbarLinks hides itself.
 */
export function MobileNavMenu({ tenantId }: MobileNavMenuProps) {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (to: string) => {
    const target = to.replace("$tenant", tenantId);
    if (target === `/${tenantId}`) {
      return location.pathname === target || location.pathname === `${target}/`;
    }
    return location.pathname.startsWith(target);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 top-[65px] z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <nav className="absolute inset-x-0 top-full z-50 mx-4 mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  params={{ tenant: tenantId }}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-foreground text-card"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
