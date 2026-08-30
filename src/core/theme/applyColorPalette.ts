/**
 * Applies the active color palette (swapped via the `@color-palette` alias,
 * see vite.config.ts COLOR_PALETTES / COLOR_PALETTE env var) as the live CSS
 * custom properties consumed by Tailwind (src/index.css `@theme` block).
 *
 * Must run once, synchronously, before the app renders (see src/main.tsx) so
 * there is no flash of the fallback values baked into src/index.css.
 */
import palette from "@color-palette";
import {
  getContrastingTextColor,
  hexToHslString,
  rotateHue,
} from "./colorUtils";
import type { ColorPalette, DarkThemePalette, LightThemePalette } from "./types";

const CHART_HUE_STEPS = [0, 60, 120, 180, 240, 300];

function buildVars(
  tokens: LightThemePalette | DarkThemePalette,
  semantic: ColorPalette["semantic_colors"],
  mode: "light" | "dark",
): Record<string, string> {
  const errorColor = semantic.error[mode];
  const successColor = semantic.success[mode];
  const warningColor = semantic.warning[mode];
  const infoColor = semantic.info[mode];

  const sidebarBase =
    mode === "light" ? tokens.text_main.color : tokens.background.color;

  return {
    "--background": hexToHslString(tokens.background.color),
    "--foreground": hexToHslString(tokens.text_main.color),

    "--card": hexToHslString(tokens.surface.color),
    "--card-foreground": hexToHslString(tokens.text_main.color),
    "--popover": hexToHslString(tokens.surface.color),
    "--popover-foreground": hexToHslString(tokens.text_main.color),

    "--primary": hexToHslString(tokens.primary.color),
    "--primary-foreground": hexToHslString(
      getContrastingTextColor(tokens.primary.color),
    ),

    "--secondary": hexToHslString(tokens.surface.color),
    "--secondary-foreground": hexToHslString(tokens.text_main.color),

    "--muted": hexToHslString(tokens.surface.color),
    "--muted-foreground": hexToHslString(tokens.text_muted.color),

    "--accent": hexToHslString(tokens.primary_hover.color),
    "--accent-foreground": hexToHslString(
      getContrastingTextColor(tokens.primary_hover.color),
    ),

    "--destructive": hexToHslString(errorColor),
    "--destructive-foreground": hexToHslString(
      getContrastingTextColor(errorColor),
    ),
    "--success": hexToHslString(successColor),
    "--success-foreground": hexToHslString(
      getContrastingTextColor(successColor),
    ),
    "--warning": hexToHslString(warningColor),
    "--warning-foreground": hexToHslString(
      getContrastingTextColor(warningColor),
    ),
    "--info": hexToHslString(infoColor),
    "--info-foreground": hexToHslString(getContrastingTextColor(infoColor)),

    "--border": hexToHslString(tokens.border.color),
    "--input": hexToHslString(tokens.border.color),
    "--ring": hexToHslString(tokens.primary.color),

    // Sidebar stays a dark surface in both modes (common dashboard pattern),
    // derived from the theme's own darkest/background token rather than a
    // hand-picked navy.
    "--sidebar-background": hexToHslString(sidebarBase),
    "--sidebar-foreground": hexToHslString(tokens.background.color),
    "--sidebar-primary": hexToHslString(tokens.primary.color),
    "--sidebar-primary-foreground": hexToHslString(
      getContrastingTextColor(tokens.primary.color),
    ),
    "--sidebar-accent": hexToHslString(tokens.primary_hover.color),
    "--sidebar-accent-foreground": hexToHslString(
      getContrastingTextColor(tokens.primary_hover.color),
    ),
    "--sidebar-border": hexToHslString(sidebarBase),
    "--sidebar-ring": hexToHslString(tokens.primary.color),
    "--sidebar-muted": hexToHslString(tokens.text_muted.color),

    // Categorical / chart-legend / tag colors: harmonious hue rotation off
    // the brand primary instead of unrelated hardcoded hex values.
    ...Object.fromEntries(
      CHART_HUE_STEPS.map((deg, i) => [
        `--chart-${i + 1}`,
        hexToHslString(rotateHue(tokens.primary.color, deg)),
      ]),
    ),
  };
}

function toCssBlock(selector: string, vars: Record<string, string>): string {
  const body = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n    ");
  return `${selector} {\n    ${body}\n  }`;
}

export function applyColorPalette(source: ColorPalette = palette as ColorPalette): void {
  const lightVars = buildVars(
    source.design_tokens.light_theme,
    source.semantic_colors,
    "light",
  );
  const darkVars = buildVars(
    source.design_tokens.dark_theme,
    source.semantic_colors,
    "dark",
  );

  const css = [
    toCssBlock(":root", lightVars),
    toCssBlock(".dark", darkVars),
  ].join("\n");

  let styleTag = document.getElementById("active-color-palette");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "active-color-palette";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;
}
