import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import palette from "@color-palette";
import {
  THEME_STORAGE_KEY,
  getStoredThemeMode,
  resolveIsDark,
  systemPrefersDark,
} from "./applyInitialTheme";
import type {
  ColorPalette,
  DesignToken,
  SemanticColor,
  ThemeContextType,
  ThemeMode,
} from "./types";

const ThemeContext = createContext<ThemeContextType | null>(null);

const typedPalette = palette as ColorPalette;

function getColorsForMode(isDark: boolean): Record<DesignToken, string> {
  const tokens = isDark
    ? typedPalette.design_tokens.dark_theme
    : typedPalette.design_tokens.light_theme;
  return {
    background: tokens.background.color,
    surface: tokens.surface.color,
    primary: tokens.primary.color,
    primary_hover: tokens.primary_hover.color,
    border: tokens.border.color,
    text_main: tokens.text_main.color,
    text_muted: tokens.text_muted.color,
  };
}

function getSemanticColorsForMode(isDark: boolean): Record<SemanticColor, string> {
  const mode = isDark ? "dark" : "light";
  const { success, warning, error, info } = typedPalette.semantic_colors;
  return {
    success: success[mode],
    warning: warning[mode],
    error: error[mode],
    info: info[mode],
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredThemeMode);
  const [isDark, setIsDark] = useState<boolean>(() => resolveIsDark(theme));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    setIsDark(resolveIsDark(theme));

    if (theme !== "system" || !window.matchMedia) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(systemPrefersDark());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    setThemeState(mode);
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      isDark,
      colors: getColorsForMode(isDark),
      semanticColors: getSemanticColorsForMode(isDark),
    }),
    [theme, setTheme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within a ThemeProvider");
  return ctx;
}
