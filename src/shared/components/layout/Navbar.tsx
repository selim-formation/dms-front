import { Link } from "@tanstack/react-router";

import Logo from "@/assets/logo.png";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";

export default function Navbar() {
  const { tenantId } = useTenant();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* Brand */}
        {tenantId ? (
          <Link
            to="/$tenant/dashboard"
            params={{ tenant: tenantId }}
            className="flex items-center gap-2"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        )}

        {tenantId && <NavbarLinks tenantId={tenantId} />}

        <NavbarActions />
      </div>
    </header>
  );
}
