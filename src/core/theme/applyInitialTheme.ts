/**
 * Reads/writes the persisted theme mode and applies the `.dark` class to
 * <html> synchronously, before React mounts, so there is no flash of the
 * wrong mode on load. See src/main.tsx (called before createRoot().render)
 * and ThemeProvider.tsx (takes over reactively after mount).
 */
import type { ThemeMode } from "./types";

export const THEME_STORAGE_KEY = "dms-theme-mode";

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveIsDark(mode: ThemeMode): boolean {
  return mode === "system" ? systemPrefersDark() : mode === "dark";
}

export function applyInitialTheme(): void {
  const isDark = resolveIsDark(getStoredThemeMode());
  document.documentElement.classList.toggle("dark", isDark);
}
