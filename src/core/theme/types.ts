/**
 * ColorPaletteAgent Type Definitions
 * TypeScript types for working with the DMS color palette
 * @version 1.0.0
 */

/**
 * Supported theme modes
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Core design token keys
 */
export type DesignToken =
  | "background"
  | "surface"
  | "primary"
  | "primary_hover"
  | "border"
  | "text_main"
  | "text_muted";

/**
 * Semantic color keys
 */
export type SemanticColor = "success" | "warning" | "error" | "info";

/**
 * Button variants using palette colors
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "success";

/**
 * Alert/notification types
 */
export type AlertType = "success" | "warning" | "error" | "info";

/**
 * Single color definition with metadata
 */
export interface ColorDefinition {
  color: string;
  rgb: string;
  name: string;
  usage: string;
  contrast_ratio_with_white?: string;
  wcag_aa_compliant?: boolean;
  wcag_aa_large_text?: boolean;
  wcag_aa_normal_text?: boolean;
}

/**
 * Light theme color palette
 */
export interface LightThemePalette {
  background: ColorDefinition;
  surface: ColorDefinition;
  primary: ColorDefinition;
  primary_hover: ColorDefinition;
  border: ColorDefinition;
  text_main: ColorDefinition;
  text_muted: ColorDefinition;
}

/**
 * Dark theme color palette
 */
export interface DarkThemePalette {
  background: ColorDefinition;
  surface: ColorDefinition;
  primary: ColorDefinition;
  primary_hover: ColorDefinition;
  border: ColorDefinition;
  text_main: ColorDefinition;
  text_muted: ColorDefinition;
}

/**
 * Semantic color with light and dark variants
 */
export interface SemanticColorSet {
  light: string;
  dark: string;
  name: string;
  usage: string;
  contrast_light: string;
  contrast_dark: string;
  wcag_aa_compliant: boolean;
  description: string;
}

/**
 * Color usage rule for a specific context
 */
export interface ColorUsageRule {
  context: string;
  light_color: string;
  dark_color: string;
  text_color: string;
  min_contrast: string;
  rule: string;
}

/**
 * Tenant-specific color overrides
 */
export interface TenantColors {
  primary?: string;
  primaryHover?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

/**
 * Complete color palette JSON structure
 */
export interface ColorPalette {
  metadata: {
    name: string;
    version: string;
    product_type: string;
    industry: string;
    brand_tone: string;
    accessibility_standard: string;
    frameworks: string[];
    last_updated: string;
  };
  palette_overview: {
    visual_intention: string;
    emotional_tone: string;
    target_users: string;
    design_philosophy: string;
  };
  design_tokens: {
    light_theme: LightThemePalette;
    dark_theme: DarkThemePalette;
  };
  semantic_colors: {
    success: SemanticColorSet;
    warning: SemanticColorSet;
    error: SemanticColorSet;
    info: SemanticColorSet;
  };
  usage_rules: ColorUsageRule[];
  accessibility: {
    wcag_compliance_level: string;
    text_contrast_requirements: {
      normal_text_minimum: string;
      large_text_minimum: string;
      ui_components_minimum: string;
      graphical_elements_minimum: string;
    };
    color_blindness_support: {
      dichromacy_safe: boolean;
      monochromacy_safe: boolean;
      protanopia_safe: boolean;
      deuteranopia_safe: boolean;
      tritanopia_safe: boolean;
      recommendations: string[];
    };
    implementation_requirements: string[];
    testing_tools_recommended: string[];
  };
  multi_tenant_considerations: {
    scalability: string;
    tenant_override_strategy: string;
    storage_recommendation: string;
    validation_rules: {
      must_have_min_contrast: boolean;
      must_follow_wcag_aa: boolean;
      must_define_light_and_dark: boolean;
      must_include_semantic_colors: boolean;
    };
    recommended_approach: string;
  };
}

/**
 * CSS Variables available in :root
 */
export interface CSSVariables {
  "--color-background": string;
  "--color-surface": string;
  "--color-primary": string;
  "--color-primary-hover": string;
  "--color-border": string;
  "--color-text-main": string;
  "--color-text-muted": string;
  "--color-success": string;
  "--color-success-light": string;
  "--color-success-dark": string;
  "--color-warning": string;
  "--color-warning-light": string;
  "--color-warning-dark": string;
  "--color-error": string;
  "--color-error-light": string;
  "--color-error-dark": string;
  "--color-info": string;
  "--color-info-light": string;
  "--color-info-dark": string;
  "--color-gray-50": string;
  "--color-gray-100": string;
  "--color-gray-200": string;
  "--color-gray-300": string;
  "--color-gray-400": string;
  "--color-gray-500": string;
  "--color-gray-600": string;
  "--color-gray-700": string;
  "--color-gray-800": string;
  "--color-gray-900": string;
}

/**
 * Tailwind color configuration
 */
export interface TailwindColorConfig {
  extend: {
    colors: Record<string, Record<string, string> | string>;
    backgroundImage: Record<string, string>;
  };
}

/**
 * Color contrast validation result
 */
export interface ContrastValidationResult {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  message: string;
}

/**
 * Color validation error
 */
export interface ColorValidationError {
  color: string;
  reason: string;
  suggestion?: string;
}

/**
 * Accessibility compliance check result
 */
export interface AccessibilityCheckResult {
  valid: boolean;
  errors: ColorValidationError[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Theme provider context type
 */
export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  colors: Record<DesignToken, string>;
  semanticColors: Record<SemanticColor, string>;
}

/**
 * Component color props
 */
export interface ComponentColorProps {
  /**
   * Background color from palette
   */
  background?: DesignToken | string;

  /**
   * Text color from palette
   */
  color?: DesignToken | string;

  /**
   * Border color from palette
   */
  borderColor?: DesignToken | string;

  /**
   * Use semantic color
   */
  semantic?: SemanticColor;
}

/**
 * Button component color props
 */
export interface ButtonColorProps {
  /**
   * Button variant
   */
  variant?: ButtonVariant;

  /**
   * Use semantic color for button
   */
  semantic?: SemanticColor;

  /**
   * Custom background color
   */
  bgColor?: string;

  /**
   * Custom text color
   */
  textColor?: string;

  /**
   * Disabled state styling
   */
  disabled?: boolean;
}

/**
 * Alert component color props
 */
export interface AlertColorProps {
  /**
   * Alert type
   */
  type: AlertType;

  /**
   * Custom background color
   */
  backgroundColor?: string;

  /**
   * Custom border color
   */
  borderColor?: string;

  /**
   * Custom text color
   */
  textColor?: string;
}

/**
 * Form field color props
 */
export interface FormFieldColorProps {
  /**
   * Show error state
   */
  error?: boolean;

  /**
   * Show success state
   */
  success?: boolean;

  /**
   * Custom border color
   */
  borderColor?: string;

  /**
   * Error message color
   */
  errorColor?: string;

  /**
   * Success message color
   */
  successColor?: string;
}

/**
 * Utility function to get CSS variable
 */
export type GetCSSVariable = (token: DesignToken) => string;

/**
 * Utility function to get semantic color
 */
export type GetSemanticColor = (color: SemanticColor) => string;

/**
 * Utility function to validate contrast
 */
export type ValidateContrast = (
  foreground: string,
  background: string,
  minRatio?: number,
) => ContrastValidationResult;

/**
 * Utility function to validate colors for WCAG-AA
 */
export type ValidateWCAG_AA = (
  colors: TenantColors,
) => AccessibilityCheckResult;

/**
 * React hook for theme management
 */
export type UseTheme = () => [ThemeMode, (theme: ThemeMode) => void];

/**
 * React hook for theme context
 */
export type UseThemeContext = () => ThemeContextType;

/**
 * React hook for tenant colors
 */
export type UseTenantColors = () => TenantColors;

/**
 * CSS-in-JS style object with color tokens
 */
export type ColorStyles = Partial<{
  [K in keyof React.CSSProperties]:
    | React.CSSProperties[K]
    | DesignToken
    | SemanticColor;
}>;

/**
 * Tailwind class builder for colors
 */
export interface TailwindColorBuilder {
  bg: (token: DesignToken | string) => string;
  text: (token: DesignToken | string) => string;
  border: (token: DesignToken | string) => string;
  focus: (token: DesignToken | string) => string;
  hover: (token: DesignToken | string) => string;
}
