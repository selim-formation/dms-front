# ColorPaletteAgent - Quick Reference Card

## Color Values at a Glance

### Light Theme

```
Background:   #FFFFFF (white)
Surface:      #F5F7FA (light gray)
Primary:      #2563EB (corporate blue)
Primary Hover:#1D4ED8 (deep blue)
Border:       #E5E7EB (light gray)
Text Main:    #1F2937 (dark gray)
Text Muted:   #6B7280 (medium gray)
```

### Dark Theme

```
Background:   #0F172A (deep navy)
Surface:      #1E293B (dark slate)
Primary:      #3B82F6 (bright blue)
Primary Hover:#60A5FA (light blue)
Border:       #334155 (dark gray)
Text Main:    #F1F5F9 (almost white)
Text Muted:   #94A3B8 (light gray)
```

### Semantic Colors

```
Success (Light): #10B981  │ Dark: #34D399
Warning (Light): #F59E0B  │ Dark: #FBBF24
Error   (Light): #EF4444  │ Dark: #F87171
Info    (Light): #0EA5E9  │ Dark: #38BDF8
```

---

## Tailwind Class Examples

### Backgrounds

```html
<div class="bg-background">Main background</div>
<div class="bg-surface">Card/panel background</div>
<div class="bg-primary">Primary button</div>
<div class="bg-success">Success state</div>
<div class="bg-error">Error state</div>
<div class="bg-warning">Warning state</div>
<div class="bg-info">Info state</div>
```

### Text Colors

```html
<p class="text-text-main">Primary text</p>
<p class="text-text-muted">Secondary text</p>
<p class="text-primary">Link text</p>
<p class="text-success">Success text</p>
<p class="text-error">Error text</p>
```

### Borders

```html
<div class="border border-border">Default border</div>
<div class="border-l-4 border-error">Error accent</div>
<div class="border-l-4 border-success">Success accent</div>
```

---

## CSS Variables Usage

### In CSS

```css
.button {
  background-color: var(--color-primary);
  color: white;
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.dark .button {
  background-color: var(--color-primary);
}
```

### In React Inline Styles

```typescript
const buttonStyle = {
  backgroundColor: "var(--color-primary)",
  color: "white",
} satisfies React.CSSProperties;
```

---

## Common Component Patterns

### Primary Button

```tsx
<button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
  Action
</button>
```

### Form Input with Error

```tsx
<input
  className="border border-error focus:outline-error rounded-lg px-3 py-2"
  aria-invalid="true"
  aria-describedby="error-msg"
/>
<span id="error-msg" className="text-error text-sm">✕ Required</span>
```

### Success Alert

```tsx
<div className="bg-(--color-success-light) border-l-4 border-success p-4 rounded">
  <span className="text-success">✓</span> Success!
</div>
```

### Disabled State

```tsx
<button disabled className="bg-gray-200 text-gray-400 cursor-not-allowed">
  Disabled
</button>
```

---

## Dark Mode Support

### Automatic (Respects System)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
  }
}
```

### Manual (Class-based)

```html
<html class="dark">
  <!-- All colors automatically switch -->
</html>
```

### React Component

```tsx
function MyComponent() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return <div className={isDark ? "dark" : ""}>{/* Content */}</div>;
}
```

---

## Accessibility Checklist (Per Component)

- [ ] Minimum 4.5:1 contrast ratio tested
- [ ] Focus indicator visible (2px outline)
- [ ] Icon + color (not color alone) for status
- [ ] ARIA labels on interactive elements
- [ ] Minimum 44x44px touch targets
- [ ] Works in dark mode
- [ ] Tested with screen reader
- [ ] Keyboard navigable

---

## Common Mistakes & Fixes

| ❌ Wrong                            | ✅ Correct                                         |
| ----------------------------------- | -------------------------------------------------- |
| `<div class="bg-error">Error</div>` | `<div class="bg-error"><span>✕</span> Error</div>` |
| `style="color: #2563EB"`            | `className="text-primary"`                         |
| `outline: none` on focus            | `focus-visible:outline-2`                          |
| Hardcoded: `#2563EB`                | CSS variable: `var(--color-primary)`               |
| Light mode only                     | Test dark mode too                                 |
| Contrast 3:1                        | Test with WCAG checker                             |
| No theme toggle                     | Implement theme switching                          |

---

## Quick Links

| Document                                                      | Purpose                     |
| ------------------------------------------------------------- | --------------------------- |
| [COLOR_USAGE_RULES.md](../COLOR_USAGE_RULES.md)               | When/how to use each color  |
| [ACCESSIBILITY_COMPLIANCE.md](../ACCESSIBILITY_COMPLIANCE.md) | WCAG-AA details & testing   |
| [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md)         | Step-by-step integration    |
| [color-palette.json](../src/config/color-palette.json)        | Complete palette definition |

---

## Testing Commands

```bash
# Check contrast ratios
# Use: https://webaim.org/resources/contrastchecker/

# Simulate colorblindness
# Use: https://www.toptal.com/designers/colorfilter

# Accessibility audit
npx lighthouse --view

# Dark mode testing (browser DevTools)
# Settings > Rendering > Emulate CSS media feature prefers-color-scheme
```

---

## Reset Your Theme (If Needed)

```typescript
// Clear theme override
localStorage.removeItem("theme");
document.documentElement.classList.remove("dark");
location.reload();
```

---

## Support

**Questions?** Check these files in order:

1. [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) - How to use
2. [COLOR_USAGE_RULES.md](../COLOR_USAGE_RULES.md) - Which color when
3. [ACCESSIBILITY_COMPLIANCE.md](../ACCESSIBILITY_COMPLIANCE.md) - Why colors work

**Not covered?** Reference [color-palette.json](../src/config/color-palette.json) for complete palette data.

---

**Last Updated**: 2026-02-12  
**Status**: ✅ Production Ready
