import { memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import { useSidebar } from "./sidebar.context";

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Off-canvas drawer below `lg`: overlay, Esc, scroll lock, closes on navigate and when resized to desktop. */
function MobileSidebar({ tenantId }: { tenantId: string }) {
  const { t } = useTranslation("common");
  const sidebar = useSidebar();
  const open = sidebar?.mobileOpen ?? false;
  const closeMobile = sidebar?.closeMobile;
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open || !closeMobile) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => e.matches && closeMobile();
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onChange);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onChange);
    };
  }, [open, closeMobile]);

  if (!open || !closeMobile) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 animate-in bg-background/70 backdrop-blur-sm fade-in duration-200"
        onClick={closeMobile}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("sidebar.label")}
        tabIndex={-1}
        className="absolute inset-y-3 start-3 flex w-72 max-w-[85vw] overflow-hidden rounded-3xl animate-in flex-col border border-border bg-card shadow-xl outline-none duration-200 slide-in-from-left rtl:slide-in-from-right"
      >
        <div className="flex items-center justify-between pe-3">
          <SidebarBrand tenantId={tenantId} onNavigate={closeMobile} />
          <button
            type="button"
            onClick={closeMobile}
            aria-label={t("sidebar.close")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <SidebarNav tenantId={tenantId} collapsed={false} onNavigate={closeMobile} />
      </aside>
    </div>
  );
}

export default memo(MobileSidebar);
