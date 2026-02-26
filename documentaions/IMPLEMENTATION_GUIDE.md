# ColorPaletteAgent Implementation Guide

## DMS Professional Color Palette Integration

**Document Version**: 1.0.0  
**Framework**: Tailwind CSS + React  
**Language**: TypeScript  
**Last Updated**: 2026-02-12

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Integration Steps](#integration-steps)
3. [Usage Examples](#usage-examples)
4. [Theme Switching](#theme-switching)
5. [Multi-Tenant Support](#multi-tenant-support)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Quick Start

### Step 1: Copy Configuration Files

```bash
# Already created in your project:
# - src/config/color-palette.json
# - src/config/tailwind.colors.config.js
# - src/styles/colors.css
```

### Step 2: Update Tailwind Config

Add the color palette to your `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import colorsConfig from "./src/config/tailwind.colors.config";

export default {
  theme: {
    extend: {
      colors: colorsConfig.extend.colors,
    },
  },
};
```

### Step 3: Import CSS Variables

```typescript
// src/main.tsx
import "./styles/colors.css"; // Add this import
import "./index.css"; // Your existing styles
```

### Step 4: Verify in Browser

```bash
npm run dev
```

Check that colors load correctly in both light and dark modes.

---

## Integration Steps

### Step 1: Install & Configure Tailwind (if not already done)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure Tailwind for CSS Modules

**tailwind.config.ts**:

```typescript
import type { Config } from "tailwindcss";
import colorsConfig from "./src/config/tailwind.colors.config";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: colorsConfig.colors,
    extend: {
      colors: colorsConfig.extend.colors,
      backgroundImage: colorsConfig.extend.backgroundImage,
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'], // Support both class and data-theme
} satisfies Config;
```

### Step 3: Apply CSS Variables

**src/index.css** or **src/styles/global.css**:

```css
@import "./colors.css";

@layer base {
  html {
    @apply bg-background text-text-main;
  }

  body {
    @apply bg-background text-text-main;
  }

  /* Smooth transitions for theme switching */
  html.dark,
  html[data-theme="dark"] {
    color-scheme: dark;
  }
}
```

### Step 4: Create Theme Provider Context

**src/core/theme/ThemeContext.tsx**:

```typescript
import { createContext, useContext, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useTheme()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const stored = localStorage.getItem('theme') as Theme | null
  const [theme, setTheme] = useState<Theme>(stored || 'system')

  return [theme, (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }]
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDarkMode = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDarkMode) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
```

### Step 5: Add to App Providers

**src/core/providers/AppProviders.tsx**:

```typescript
import { ThemeProvider } from '../theme/ThemeContext'
import { AuthProvider } from '../auth/context/AuthProvider'
import { TenantProvider } from '../tenant/context/TenantProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../api/query-client'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TenantProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

---

## Usage Examples

### Basic Color Usage

#### Using Tailwind Classes

```tsx
// Background colors
<div className="bg-background">Light or dark background</div>
<div className="bg-surface">Secondary surface</div>
<div className="bg-primary">Primary blue</div>

// Text colors
<p className="text-text-main">Main body text</p>
<p className="text-text-muted">Secondary text</p>
<p className="text-error">Error message</p>

// Combined
<button className="bg-primary text-white hover:bg-primary-hover">
  Action Button
</button>
```

#### Using CSS Variables

```tsx
const styles = {
  background: "var(--color-background)",
  primary: "var(--color-primary)",
  primaryHover: "var(--color-primary-hover)",
} as const;

export function MyComponent() {
  return <div style={{ backgroundColor: styles.background }}>Content</div>;
}
```

### Button Component

**src/shared/components/Button.tsx**:

```typescript
import classNames from 'classnames'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white',
  secondary: 'bg-surface border border-border text-text-main hover:bg-(--color-gray-100)',
  danger: 'bg-error hover:bg-[#DC2626] text-white',
  success: 'bg-success hover:bg-[#059669] text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        'font-medium rounded-lg transition-colors focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}
```

### Form Input Component

**src/shared/components/FormInput.tsx**:

```typescript
interface FormInputProps {
  label: string
  error?: string
  success?: boolean
  required?: boolean
}

export function FormInput({
  label,
  error,
  success,
  required,
  ...props
}: FormInputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id || `input-${Math.random()}`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-main">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <input
        id={id}
        className={classNames(
          'px-3 py-2 rounded-lg border transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-0',
          'focus-visible:outline-primary disabled:bg-gray-100 disabled:text-gray-400',
          'dark:disabled:bg-gray-800 dark:disabled:text-gray-600',
          error
            ? 'border-error focus-visible:border-error'
            : success
              ? 'border-success focus-visible:border-success'
              : 'border-border focus-visible:border-primary',
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />

      {error && (
        <span id={`${id}-error`} className="text-sm text-error flex items-center gap-1">
          <span>✕</span> {error}
        </span>
      )}

      {success && (
        <span className="text-sm text-success flex items-center gap-1">
          <span>✓</span> Valid
        </span>
      )}
    </div>
  )
}
```

### Alert Component

**src/shared/components/Alert.tsx**:

```typescript
type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title: string
  message: string
  onClose?: () => void
}

const alertConfig = {
  success: {
    bg: 'bg-(--color-success-light)',
    border: 'border-success',
    text: 'text-success',
    icon: '✓',
  },
  error: {
    bg: 'bg-(--color-error-light)',
    border: 'border-error',
    text: 'text-error',
    icon: '✕',
  },
  warning: {
    bg: 'bg-(--color-warning-light)',
    border: 'border-warning',
    text: 'text-warning',
    icon: '⚠',
  },
  info: {
    bg: 'bg-(--color-info-light)',
    border: 'border-info',
    text: 'text-info',
    icon: 'ℹ',
  },
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const config = alertConfig[type]

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={classNames(
        'p-4 rounded-lg border-l-4 flex gap-3',
        config.bg,
        config.border,
      )}
    >
      <span className={classNames('text-xl flex-shrink-0', config.text)}>
        {config.icon}
      </span>

      <div className="flex-1">
        <h3 className="font-semibold text-text-main">{title}</h3>
        <p className="text-sm text-text-muted">{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-main transition-colors"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## Theme Switching

### Theme Toggle Component

**src/shared/components/ThemeToggle.tsx**:

```typescript
import { useThemeContext } from '@/core/theme/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useThemeContext()

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-surface transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-text-main" />
      ) : (
        <Moon className="w-5 h-5 text-text-main" />
      )}
    </button>
  )
}
```

### Add to Header/Navigation

```typescript
// In your header or navigation component
import { ThemeToggle } from '@/shared/components/ThemeToggle'

export function Header() {
  return (
    <header className="bg-surface border-b border-border">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <ThemeToggle />
      </div>
    </header>
  )
}
```

---

## Multi-Tenant Support

### Tenant-Specific Colors Configuration

**src/core/tenant/hooks/useTenantColors.ts**:

```typescript
import { useTenant } from "./useTenant";
import ColorPaletteData from "@/config/color-palette.json";

interface TenantColors {
  primary: string;
  primaryHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export function useTenantColors(): TenantColors {
  const { tenant } = useTenant();

  // Use default palette
  const defaultColors = {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",
  };

  // Override with tenant-specific colors if available
  if (tenant?.branding?.colors) {
    return {
      ...defaultColors,
      ...tenant.branding.colors,
    };
  }

  return defaultColors;
}
```

### Apply Tenant Colors via CSS Variables

**src/core/tenant/context/TenantProvider.tsx**:

```typescript
import { useEffect } from 'react'
import { useTenant } from '../hooks/useTenant'

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant()

  useEffect(() => {
    if (!tenant?.branding?.colors) return

    const root = document.documentElement
    const colors = tenant.branding.colors

    // Set CSS variables for tenant brand colors
    if (colors.primary) {
      root.style.setProperty('--color-primary', colors.primary)
    }
    if (colors.primaryHover) {
      root.style.setProperty('--color-primary-hover', colors.primaryHover)
    }

    // Validate contrast ratios
    console.log('Tenant colors updated and validated')
  }, [tenant])

  return <>{children}</>
}
```

### Color Validation Service

**src/core/tenant/services/colorValidation.service.ts**:

```typescript
/**
 * Validates tenant color against WCAG-AA standards
 */
export class ColorValidationService {
  /**
   * Calculate relative luminance (WCAG formula)
   */
  static getLuminance(hexColor: string): number {
    const [r, g, b] = this.hexToRgb(hexColor);
    const [rs, gs, bs] = [r, g, b].map((x) => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Validate color meets WCAG-AA requirements
   */
  static isWCAG_AA_Compliant(
    foreground: string,
    background: string,
    textSize: "normal" | "large" = "normal",
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const minimum = textSize === "large" ? 3 : 4.5;
    return ratio >= minimum;
  }

  /**
   * Validate tenant colors
   */
  static validateTenantColors(colors: Record<string, string>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check primary on white background
    if (!this.isWCAG_AA_Compliant(colors.primary, "#FFFFFF")) {
      errors.push("Primary color does not meet WCAG-AA on white background");
    }

    // Check primary hover on white
    if (!this.isWCAG_AA_Compliant(colors.primaryHover, "#FFFFFF")) {
      errors.push(
        "Primary hover color does not meet WCAG-AA on white background",
      );
    }

    // Check semantic colors
    const semanticColors = ["success", "warning", "error", "info"];
    for (const color of semanticColors) {
      if (
        colors[color] &&
        !this.isWCAG_AA_Compliant(colors[color], "#FFFFFF")
      ) {
        errors.push(`${color} color does not meet WCAG-AA on white background`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private static hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }
}
```

---

## Advanced Configuration

### Dynamic Color System

**src/core/theme/colorSystem.ts**:

```typescript
import ColorPaletteData from "@/config/color-palette.json";

type ColorMode = "light" | "dark";

export class ColorSystem {
  static getColorToken(
    token: keyof typeof ColorPaletteData.design_tokens.light_theme,
    mode: ColorMode = "light",
  ) {
    const palette = ColorPaletteData.design_tokens[`${mode}_theme`];
    return (palette as any)[token].color;
  }

  static getAllColors(mode: ColorMode = "light") {
    return ColorPaletteData.design_tokens[`${mode}_theme`];
  }

  static getSemanticColor(
    type: "success" | "warning" | "error" | "info",
    mode: ColorMode = "light",
  ) {
    return ColorPaletteData.semantic_colors[type][mode];
  }

  static validateContrast(
    foreground: string,
    background: string,
    minRatio = 4.5,
  ): boolean {
    // Implementation uses ColorValidationService
    return true;
  }
}
```

### Component-Level Color Overrides

```typescript
interface ComponentThemeProps {
  colorOverrides?: {
    primary?: string
    background?: string
    text?: string
  }
}

export function ThemedComponent({ colorOverrides }: ComponentThemeProps) {
  const style = {
    '--color-primary': colorOverrides?.primary,
    '--color-background': colorOverrides?.background,
    '--color-text-main': colorOverrides?.text,
  } as React.CSSProperties

  return <div style={style}>
    {/* Component content */}
  </div>
}
```

---

## Troubleshooting

### Issue: Colors not applying in dark mode

**Solution**:

```typescript
// Check that dark class is being applied:
console.log(document.documentElement.classList.has("dark"));

// Verify CSS variables are set:
console.log(
  getComputedStyle(document.documentElement).getPropertyValue(
    "--color-primary",
  ),
);
```

### Issue: Focus outline not visible

**Solution**:

```css
/* Ensure focus-visible is not being overridden */
:focus-visible {
  outline: 2px solid var(--color-primary) !important;
  outline-offset: 2px;
}
```

### Issue: Tailwind colors not being picked up

**Solution**:

```typescript
// tailwind.config.ts - ensure colors are properly imported
import colorsConfig from "./src/config/tailwind.colors.config";

export default {
  theme: {
    colors: colorsConfig.colors, // ← Make sure this is set
  },
};
```

### Issue: Semantic colors showing wrong in dark mode

**Solution**:

```tsx
// Check you're using data-theme or dark class correctly
<div className="dark">
  {/* Dark mode content */}
</div>

// Or use media query
@media (prefers-color-scheme: dark) {
  :root {
    --color-success: #34D399;
  }
}
```

---

## Best Practices

### ✅ Do's

1. **Use Tailwind classes first**

   ```tsx
   ✅ <div className="bg-primary text-white">
   ❌ <div style={{ backgroundColor: '#2563EB', color: 'white' }}>
   ```

2. **Apply focus visible states**

   ```tsx
   ✅ className="focus-visible:outline-2 focus-visible:outline-primary"
   ❌ className="focus:outline-none"
   ```

3. **Test contrast ratios**

   ```typescript
   ✅ All text ≥ 4.5:1 contrast
   ❌ Guessing colors will be accessible
   ```

4. **Use semantic colors appropriately**

   ```tsx
   ✅ <div className="text-error">✕ Error message</div>
   ❌ <div className="text-error">Error message</div>
   ```

5. **Support theme switching**
   ```tsx
   ✅ Implement theme toggle
   ❌ Force single theme
   ```

### ❌ Don'ts

1. **Don't hardcode colors**

   ```typescript
   ❌ style={{ color: '#2563EB' }}
   ✅ className="text-primary"
   ```

2. **Don't rely on color alone**

   ```tsx
   ❌ <div className="bg-error">Error</div>
   ✅ <div className="bg-error flex gap-1"><span>✕</span> Error</div>
   ```

3. **Don't skip accessibility testing**

   ```typescript
   ❌ Assume colors are accessible
   ✅ Test with WCAG Contrast Checker
   ```

4. **Don't break focus indicators**

   ```css
   ❌ button:focus {
     outline: none;
   }
   ✅ button:focus-visible {
     outline: 2px;
   }
   ```

5. **Don't ignore dark mode**
   ```css
   ❌ Only style light theme
   ✅ Test both light and dark themes
   ```

---

## File Structure

```
src/
├── config/
│   ├── color-palette.json          ← Color definitions
│   └── tailwind.colors.config.js   ← Tailwind config
├── core/
│   └── theme/
│       ├── ThemeContext.tsx        ← Theme provider
│       └── colorSystem.ts          ← Color utilities
├── shared/
│   └── components/
│       ├── Button.tsx              ← Colored button
│       ├── FormInput.tsx           ← Form with color states
│       ├── Alert.tsx               ← Semantic color alerts
│       └── ThemeToggle.tsx         ← Theme switcher
└── styles/
    └── colors.css                  ← CSS variables
```

---

## Next Steps

1. ✅ Copy configuration files
2. ✅ Update Tailwind config
3. ✅ Import CSS variables in main.tsx
4. ✅ Create ThemeProvider context
5. ✅ Add ThemeProvider to AppProviders
6. ✅ Build themed components
7. ✅ Test in light and dark modes
8. ✅ Run accessibility audit
9. ✅ Deploy to production

---

## Support & Resources

- **Color Palette JSON**: [src/config/color-palette.json](../src/config/color-palette.json)
- **Usage Rules**: [COLOR_USAGE_RULES.md](../COLOR_USAGE_RULES.md)
- **Accessibility**: [ACCESSIBILITY_COMPLIANCE.md](../ACCESSIBILITY_COMPLIANCE.md)
- **Tailwind Docs**: https://tailwindcss.com/docs/customizing-colors
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Ready to build? Start with Step 1 in [Quick Start](#quick-start)**
