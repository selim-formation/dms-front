import { memo } from "react";
import { Link } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface SidebarBrandProps {
  tenantId: string;
  /** Icon-rail mode: only the left edge of the logo is shown. */
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarBrand({ tenantId, collapsed, onNavigate }: SidebarBrandProps) {
  return (
    <Link
      to="/$tenant"
      params={{ tenant: tenantId }}
      onClick={onNavigate}
      aria-label="Home"
      className="flex h-16 shrink-0 items-center px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn("block overflow-hidden", collapsed ? "w-10" : "w-full")}>
        <img src={Logo} alt="" className="h-10 w-auto max-w-none object-contain object-left" />
      </span>
    </Link>
  );
}

export default memo(SidebarBrand);
