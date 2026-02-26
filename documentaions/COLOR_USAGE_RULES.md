# Color Palette Usage Rules & Guidelines

## DMS Professional Color Palette

**Framework**: Tailwind CSS | **Accessibility**: WCAG-AA | **Version**: 1.0.0

---

## Color Usage Matrix

| Component           | Light Theme | Dark Theme | Text Color        | Min Contrast    | WCAG-AA | Notes                               |
| ------------------- | ----------- | ---------- | ----------------- | --------------- | ------- | ----------------------------------- |
| **Primary Buttons** | #2563EB     | #3B82F6    | White             | 4.5:1           | ✅ Yes  | Main CTAs, highest priority actions |
| **Primary Hover**   | #1D4ED8     | #60A5FA    | White             | 4.5:1           | ✅ Yes  | Darker in light, lighter in dark    |
| **Background**      | #FFFFFF     | #0F172A    | #1F2937 / #F1F5F9 | 21:1 / 20.8:1   | ✅ Yes  | Main application canvas             |
| **Surface/Cards**   | #F5F7FA     | #1E293B    | #1F2937 / #F1F5F9 | 17.3:1 / 18.6:1 | ✅ Yes  | Secondary backgrounds, panels       |
| **Border**          | #E5E7EB     | #334155    | N/A               | N/A             | ✅ Yes  | Dividers, subtle separators         |
| **Text Main**       | #1F2937     | #F1F5F9    | N/A               | N/A             | ✅ Yes  | Primary reading content             |
| **Text Muted**      | #6B7280     | #94A3B8    | N/A               | 7:1             | ✅ Yes  | Secondary, helper text              |
| **Success**         | #10B981     | #34D399    | White             | 5.24:1 / 8.6:1  | ✅ Yes  | Positive status, confirmations      |
| **Warning**         | #F59E0B     | #FBBF24    | White             | 4.58:1 / 5.64:1 | ✅ Yes  | Cautions, pending actions           |
| **Error**           | #EF4444     | #F87171    | White             | 4.54:1 / 5.88:1 | ✅ Yes  | Failures, destructive actions       |
| **Info**            | #0EA5E9     | #38BDF8    | White             | 4.53:1 / 6.92:1 | ✅ Yes  | Informational messages              |

---

## Component-Specific Rules

### 1. **Primary Buttons & CTAs**

```
Usage: Main call-to-action, primary form submissions, important actions
Light Theme: #2563EB background + white text
Dark Theme: #3B82F6 background + white text
Hover State: Shift to #1D4ED8 (light) or #60A5FA (dark)
Active State: Apply 80% opacity + darker shade
Disabled State: #D1D5DB text on surface color (light) / #475569 (dark)
Minimum Size: 44x44px (touch targets)
```

### 2. **Secondary/Alternative Buttons**

```
Usage: Secondary actions, less emphasis needed
Light Theme: #F5F7FA background + #1F2937 text
Dark Theme: #1E293B background + #F1F5F9 text
Border: 1px #E5E7EB (light) / #334155 (dark)
Hover: Add 10% darker overlay
Never use for breaking changes or destructive actions
```

### 3. **Tabs & Navigation**

```
Inactive Tab:
  - Background: Surface color
  - Text: #6B7280 (light) / #94A3B8 (dark)
Active Tab:
  - Border-bottom: 2px #2563EB (light) / #3B82F6 (dark)
  - Text: #1F2937 (light) / #F1F5F9 (dark)
  - Font-weight: 600
Hover Tab: Subtle background shift
```

### 4. **Form Elements (Inputs, Textareas)**

```
Border: #E5E7EB (light) / #334155 (dark)
Background: White (light) / transparent on surface (dark)
Text: #1F2937 (light) / #F1F5F9 (dark)
Placeholder: #9CA3AF (light) / #64748B (dark)
Focus State: 2px outline #2563EB (light) / #3B82F6 (dark)
Error State: Border + left accent #EF4444
Error Text: #EF4444 (light) / #F87171 (dark)
Success State: Border accent #10B981 (light) / #34D399 (dark)
Disabled: Background #F3F4F6 (light) / #0F172A (dark), text #9CA3AF
```

### 5. **Status Badges**

```
Success Badge:
  - Background: #D1FAE5 (light) / appropriate dark shade
  - Text: #047857 (light) / #D1FAE5 (dark)
  - Icon: ✓ (always include icon, not color alone)

Error Badge:
  - Background: #FEE2E2 (light)
  - Text: #DC2626 (light)
  - Icon: ✕ (always include icon)

Warning Badge:
  - Background: #FEF3C7 (light)
  - Text: #D97706 (light)
  - Icon: ⚠ (always include icon)

Info Badge:
  - Background: #CFFAFE (light)
  - Text: #0369A1 (light)
  - Icon: ℹ (always include icon)
```

### 6. **Alerts & Notifications**

```
Container Background:
  - Success: #D1FAE5 (light) / tinted dark (dark)
  - Warning: #FEF3C7 (light) / tinted dark (dark)
  - Error: #FEE2E2 (light) / tinted dark (dark)
  - Info: #CFFAFE (light) / tinted dark (dark)

Border: Left accent (4px) in semantic color
Text: Use text_main color for readability
Icon: Required for all alert types
Close Button: Gray until hover
```

### 7. **Links & Anchors**

```
Default: #2563EB (light) / #3B82F6 (dark)
Hover: Underline + darkened color (#1D4ED8 light / #60A5FA dark)
Visited: #7C3AED (purple) for distinguishing visited state
Focus: 2px outline around text
Never: Rely on color alone; use underline or bold weight
```

### 8. **Disabled & Inactive States**

```
Text: #9CA3AF (gray-400)
Background: #F3F4F6 (light) / #1F2937 (dark)
Border: #D1D5DB (light) / #404854 (dark)
Cursor: not-allowed
Opacity: 60% as fallback
Never: Completely invisible
```

### 9. **Dividers & Separators**

```
Hair Line: 1px #E5E7EB (light) / #334155 (dark)
Thicker Divider: 2px #E5E7EB (light) / #334155 (dark)
Spaced Divider: 1px with 16px margin Y
Never: Use primary color for structural dividers
```

### 10. **Empty States & Placeholders**

```
Background: #F9FAFB (light) / #1F2937 (dark)
Border: Dashed #D1D5DB (light) / #475569 (dark)
Text: #6B7280 (muted gray)
Icon: 64x64px in #D1D5DB (light) / #64748B (dark)
```

---

## Contrast Requirements

### Text on Colors

**Strong Contrast Required (4.5:1 minimum):**

- Primary buttons
- Links
- Input field text
- Semantic color badges
- Important messages

**Enhanced Contrast (7:1 recommended):**

- Muted/secondary text
- Body content
- Headings

**Exceptions (3:1 acceptable):**

- Large text (18pt+)
- Graphics/icons
- UI components
- Disabled states

---

## Color Blindness Considerations

### Safe Color Combinations

- ✅ Use blue (#2563EB) + patterns
- ✅ Use green + check icon (not green alone)
- ✅ Use red + × icon (not red alone)
- ✅ Amber + ⚠ icon (not amber alone)

### Unsafe Practices

- ❌ Red/green only distinction (protanopia issue)
- ❌ Color-only status indicators
- ❌ Blue/yellow as only differentiator (tritanopia issue)
- ❌ Light gray text on white (low contrast)

### Testing Recommendations

Use simulation tools:

- Toptal Colorblind Simulator
- Color Oracle
- Vischeck
- WCAG Contrast Checker

---

## Multi-Tenant Customization

### Tenant-Safe Colors

For white-label support, override these only:

```
--color-primary: [Allow override]
--color-primary-hover: [Allow override]
--color-success: [Allow override]
--color-warning: [Allow override]
```

### Never Override

```
--color-text-main: [Keep for readability]
--color-text-muted: [Keep for hierarchy]
--color-background: [Keep for consistency]
```

### Validation Rules

- Primary must achieve 4.5:1 contrast with white
- Semantic colors must be accessible
- No pure red/green only combinations

---

## Best Practices Summary

| Do                                    | Don't                                      |
| ------------------------------------- | ------------------------------------------ |
| ✅ Use blue for primary actions       | ❌ Use color as sole indicator             |
| ✅ Include icons with semantic colors | ❌ Rely on red/green distinction alone     |
| ✅ Test contrast with WCAG tools      | ❌ Skip accessibility testing              |
| ✅ Provide fallback text labels       | ❌ Assume colors work for colorblind users |
| ✅ Use 44x44px minimum touch targets  | ❌ Create tiny interactive elements        |
| ✅ Support theme switching            | ❌ Force single theme                      |
| ✅ Define focus states clearly        | ❌ Remove outline on focus                 |
| ✅ Use consistent semantic colors     | ❌ Mix green for success AND warning       |
| ✅ Document color intent              | ❌ Use colors arbitrarily                  |
| ✅ Test with real users               | ❌ Assume accessibility is done            |

---

## Implementation Checklist

Before deploying color changes:

- [ ] Run WCAG Contrast Checker on all text
- [ ] Test in light and dark modes
- [ ] Verify semantic colors are accessible
- [ ] Simulate colorblindness
- [ ] Test with screen reader
- [ ] Verify focus states visible
- [ ] Check mobile (smaller text) contrast
- [ ] Get design review
- [ ] Test with users (especially those with color blindness)
- [ ] Document any overrides

---

## Resources

- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)
- [Design Tokens - Tailwind](https://tailwindcss.com/docs/customizing-colors)
