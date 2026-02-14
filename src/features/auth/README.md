# Auth Feature

Professional login page with light and dark theme support for DMS application.

## Features

✅ **Login Form Component** - Email and password authentication with validation  
✅ **Login Page Component** - Full page layout with left form and right background image  
✅ **Dark Mode Support** - Automatic light/dark theme switching using CSS variables  
✅ **Form Validation** - Zod schema validation with react-hook-form  
✅ **Password Toggle** - Show/hide password functionality  
✅ **Remember Me** - Optional remember me checkbox  
✅ **Loading States** - Animated loading button state  
✅ **Error Handling** - User-friendly error messages  
✅ **Responsive** - Mobile-friendly responsive design  
✅ **Accessibility** - Proper labels, ARIA attributes, and keyboard navigation

## Structure

```
src/features/auth/
├── api/              # API hooks and mutations
├── components/       # React components
│   ├── LoginForm.tsx      # Form component
│   └── LoginPage.tsx      # Full page component
├── hooks/            # Custom React hooks
│   └── useLoginForm.ts    # Login form state hook
├── types/            # TypeScript types
├── utils/            # Utility functions
└── index.ts          # Barrel export
```

## Usage

### Import Login Page

```typescript
import { LoginPage } from "@/features/auth";

export function MyLoginRoute() {
  return (
    <LoginPage
      backgroundImage="https://example.com/image.jpg"
      showNavigation={true}
    />
  );
}
```

### Use Login Form Separately

```typescript
import { LoginForm } from "@/features/auth";

export function MyForm() {
  return (
    <LoginForm
      onSuccess={() => console.log("Login successful!")}
    />
  );
}
```

## Form Data

The login form accepts and validates:

```typescript
interface LoginFormData {
  email: string; // Required, valid email format
  password: string; // Required, min 6 characters
  remember?: boolean; // Optional remember me
}
```

## Color Palette Integration

The login page automatically uses color variables from the color palette system:

- `--color-background` - Page background
- `--color-surface` - Form input background
- `--color-primary` - Primary action button
- `--color-primary-hover` - Button hover state
- `--color-text-main` - Main text
- `--color-text-muted` - Muted text
- `--color-border` - Border colors
- `--color-error` - Error states

## Dark Mode

The login page automatically responds to system dark mode preference via CSS media queries. No additional setup required!

## Customization

### Change Background Image

```typescript
<LoginPage backgroundImage="your-image-url" />
```

### Hide Navigation

```typescript
<LoginPage showNavigation={false} />
```

### Custom Logo

```typescript
<LoginPage logoSrc="your-logo-url" />
```

## API Integration

The form integrates with the existing auth service:

```typescript
// src/core/auth/services/auth.service.ts
await login(tenantId, {
  email: "user@example.com",
  password: "password123",
  remember: true,
});
```

After successful login, the user is redirected to `/tenant/dashboard`.

## Error Handling

Errors from the API are automatically caught and displayed to the user in a red alert box. Common errors:

- Invalid credentials
- User not found
- Account locked
- Server errors

## Validation Rules

**Email**

- Required
- Must be valid email format (abc@example.com)

**Password**

- Required
- Minimum 6 characters
- Can contain any characters

## Next Steps

1. ✅ Login page is ready to use
2. ⬜ Configure API endpoint in `src/config/api.config.ts`
3. ⬜ Test with your backend
4. ⬜ Customize styling as needed
5. ⬜ Add 2FA if required
