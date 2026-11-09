import { createContext, useContext } from "react";

export interface SidebarContextValue {
  /** Desktop icon-rail mode (persisted). */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Off-canvas drawer below `lg`. */
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

/** `null` outside the shell (e.g. the anonymous register page): callers fall back to a plain top bar. */
export function useSidebar(): SidebarContextValue | null {
  return useContext(SidebarContext);
}
