/**
 * ColorPaletteAgent Utilities
 * Helper functions and utilities for working with the color palette
 * @version 1.0.0
 */

import type {
  DesignToken,
  SemanticColor,
  ContrastValidationResult,
  AccessibilityCheckResult,
  ColorValidationError,
  TenantColors,
} from "./types";

/**
 * Get a CSS variable value
 * @example getCSSVariable('primary') // returns #2563EB in light mode
 */
export function getCSSVariable(token: DesignToken): string {
  const mapping: Record<DesignToken, string> = {
    background: "--color-background",
    surface: "--color-surface",
    primary: "--color-primary",
    primary_hover: "--color-primary-hover",
    border: "--color-border",
    text_main: "--color-text-main",
    text_muted: "--color-text-muted",
  };

  if (typeof window === "undefined") return "#000000";

  const cssVar = mapping[token];
  return getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
}

/**
 * Get a semantic color value
 * @example getSemanticColor('success') // returns #10B981 in light mode
 */
export function getSemanticColor(color: SemanticColor): string {
  if (typeof window === "undefined") return "#000000";

  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${color}`)
    .trim();
}

/**
 * Convert hex color to RGB
 * @example hexToRgb('#2563EB') // returns [37, 99, 235]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Convert RGB to hex
 * @example rgbToHex(37, 99, 235) // returns '#2563EB'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

/**
 * Calculate relative luminance for contrast ratio
 * Uses WCAG formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getLuminance(hexColor: string): number {
  const [r, g, b] = hexToRgb(hexColor);
  const [rs, gs, bs] = [r, g, b].map((x) => {
    const c = x / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value ≥ 1 (usually 1-21)
 * @example getContrastRatio('#000000', '#FFFFFF') // returns 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate contrast ratio against WCAG standards
 * @example validateContrast('#2563EB', '#FFFFFF')
 */
export function validateContrast(
  foreground: string,
  background: string,
  minRatio: number = 4.5,
): ContrastValidationResult {
  const ratio = getContrastRatio(foreground, background);
  const wcagAA = ratio >= 4.5;
  const wcagAAA = ratio >= 7;

  return {
    foreground,
    background,
    ratio: Math.round(ratio * 100) / 100,
    wcagAA,
    wcagAAA,
    message: wcagAA
      ? `✅ WCAG-AA compliant (${ratio.toFixed(2)}:1)`
      : `❌ WCAG-AA not met (${ratio.toFixed(2)}:1, need ${minRatio}:1)`,
  };
}

/**
 * Check if a color is too light or too dark
 */
export function isColorTooLight(
  hexColor: string,
  threshold: number = 0.7,
): boolean {
  return getLuminance(hexColor) > threshold;
}

export function isColorTooDark(
  hexColor: string,
  threshold: number = 0.3,
): boolean {
  return getLuminance(hexColor) < threshold;
}

/**
 * Get appropriate text color (light or dark) for a background
 */
export function getContrastingTextColor(
  backgroundColor: string,
): "#000000" | "#FFFFFF" {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Lighten a color by a percentage (0-100)
 */
export function lightenColor(hexColor: string, percent: number): string {
  const [r, g, b] = hexToRgb(hexColor);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  const newG = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  const newB = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
  return rgbToHex(newR, newG, newB);
}

/**
 * Darken a color by a percentage (0-100)
 */
export function darkenColor(hexColor: string, percent: number): string {
  const [r, g, b] = hexToRgb(hexColor);
  const factor = 1 - percent / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  return rgbToHex(newR, newG, newB);
}

/**
 * Validate tenant colors for WCAG-AA compliance
 */
export function validateTenantColors(
  colors: TenantColors,
): AccessibilityCheckResult {
  const errors: ColorValidationError[] = [];
  const warnings: string[] = [];

  // Check primary color
  if (colors.primary) {
    const primaryCheck = validateContrast(colors.primary, "#FFFFFF");
    if (!primaryCheck.wcagAA) {
      errors.push({
        color: "primary",
        reason: `Contrast ratio ${primaryCheck.ratio}:1 below WCAG-AA minimum of 4.5:1`,
        suggestion: `Try lightening the color or adjusting the luminance`,
      });
    }
  }

  // Check primary hover color
  if (colors.primaryHover) {
    const hoverCheck = validateContrast(colors.primaryHover, "#FFFFFF");
    if (!hoverCheck.wcagAA) {
      errors.push({
        color: "primaryHover",
        reason: `Hover contrast ratio ${hoverCheck.ratio}:1 below WCAG-AA minimum`,
        suggestion: "Ensure hover state has higher contrast than normal state",
      });
    }
  }

  // Check semantic colors
  const semantics = ["success", "warning", "error", "info"] as const;
  for (const semantic of semantics) {
    if (colors[semantic as keyof typeof colors]) {
      const color = colors[semantic as keyof typeof colors];
      const check = validateContrast(color as string, "#FFFFFF");
      if (!check.wcagAA) {
        errors.push({
          color: semantic,
          reason: `${semantic} color contrast ${check.ratio}:1 below minimum`,
        });
      }
    }
  }

  // Warnings for best practices
  if (colors.primary && colors.error) {
    const ratio = getContrastRatio(colors.primary, colors.error);
    if (ratio < 3) {
      warnings.push(
        "Primary and error colors are too similar for colorblind users. Consider increasing distinction.",
      );
    }
  }

  const score = 100 - errors.length * 20 - warnings.length * 5;
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, Math.min(100, score)),
  };
}

/**
 * Create Tailwind color class from color value
 * @example tailwindColorClass('bg', '#2563EB') // 'bg-[#2563EB]'
 */
export function tailwindColorClass(property: string, color: string): string {
  return `${property}-[${color}]`;
}

/**
 * Get color for different theme modes
 */
export function getThemeColor(
  lightColor: string,
  darkColor: string,
  isDark: boolean = false,
): string {
  return isDark ? darkColor : lightColor;
}

/**
 * Create a color palette string for CSS
 */
export function createColorPaletteString(
  colors: Record<string, string>,
): string {
  return Object.entries(colors)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join("\n  ");
}

/**
 * Get all CSS variables as a record
 */
export function getCSSVariables(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const variables: Record<string, string> = {};

  // Get all CSS variables
  const allProps = Array.from(styles);
  for (const prop of allProps) {
    if (prop.startsWith("--color-")) {
      variables[prop] = styles.getPropertyValue(prop).trim();
    }
  }

  return variables;
}

/**
 * Check if color is in palette
 */
export function isColorInPalette(hexColor: string): boolean {
  const palette = getCSSVariables();
  const normalizedColor = hexColor.toUpperCase();
  return Object.values(palette).some(
    (value) => value.toUpperCase() === normalizedColor,
  );
}

/**
 * Get nearest palette color to a given hex color
 */
export function getNearestPaletteColor(hexColor: string): string | null {
  const palette = getCSSVariables();
  let nearest: { color: string; distance: number } | null = null;

  const [r, g, b] = hexToRgb(hexColor);

  for (const [, paletteColor] of Object.entries(palette)) {
    const [pr, pg, pb] = hexToRgb(paletteColor);
    const distance = Math.sqrt(
      Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2),
    );

    if (!nearest || distance < nearest.distance) {
      nearest = { color: paletteColor, distance };
    }
  }

  return nearest?.color ?? null;
}

/**
 * Create a color contrast grid (for accessibility review)
 */
export function createContrastGrid(
  foregrounds: string[],
  backgrounds: string[],
  minRatio: number = 4.5,
): Record<string, Record<string, boolean>> {
  const grid: Record<string, Record<string, boolean>> = {};

  for (const fg of foregrounds) {
    grid[fg] = {};
    for (const bg of backgrounds) {
      const ratio = getContrastRatio(fg, bg);
      grid[fg][bg] = ratio >= minRatio;
    }
  }

  return grid;
}

/**
 * Log contrast grid to console (useful for testing)
 */
export function logContrastGrid(
  foregrounds: Record<string, string>,
  backgrounds: Record<string, string>,
): void {
  const fgNames = Object.keys(foregrounds);
  const bgNames = Object.keys(backgrounds);

  console.table(
    createContrastGrid(
      Object.values(foregrounds),
      Object.values(backgrounds),
      4.5,
    ),
  );

  console.log("Contrast Ratios:");
  for (const fgName of fgNames) {
    for (const bgName of bgNames) {
      const ratio = getContrastRatio(foregrounds[fgName], backgrounds[bgName]);
      const status = ratio >= 4.5 ? "✅" : "❌";
      console.log(`${status} ${fgName} on ${bgName}: ${ratio.toFixed(2)}:1`);
    }
  }
}

/**
 * Apply temporal theme based on time of day
 */
export function getTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

/**
 * Get accessibility score for color palette (0-100)
 */
export function getAccessibilityScore(
  foreground: string,
  background: string,
): number {
  const ratio = getContrastRatio(foreground, background);

  if (ratio >= 7) return 100; // AAA
  if (ratio >= 4.5) return 80; // AA
  if (ratio >= 3) return 50; // Large text
  return 20; // Not accessible
}
