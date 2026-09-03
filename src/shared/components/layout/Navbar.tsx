import { Link, useParams } from "@tanstack/react-router";

import Logo from "@/assets/logo.png";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { MobileNavMenu } from "./MobileNavMenu";

export default function Navbar() {
  // Read tenant straight off the matched route params instead of
  // TenantProvider context — the context's tenantId is set via an async
  // setState inside the route's beforeLoad and can lag one paint behind,
  // which was making the nav links flash-missing on first load. The
  // route param is already resolved by the time this renders (every page
  // that mounts Navbar lives under /$tenant/*).
  const { tenant: tenantId } = useParams({ strict: false });

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* Brand */}
        {tenantId ? (
          <Link
            to="/$tenant"
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

        <div className="flex items-center gap-3">
          {tenantId && <MobileNavMenu tenantId={tenantId} />}
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}
