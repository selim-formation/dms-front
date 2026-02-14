# Server Login Integration Guide

This guide explains how the login system now authenticates with your actual API server.

## API Configuration

### Endpoint

- **URL**: `POST http://dms.test/api/login`
- **Base URL**: Configured in `src/config/app.config.ts` via `VITE_API_BASE_URL`

### Request Payload

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Success Response (200)

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmed Hassan",
      "email": "ahmed@gmail.com",
      "email_verified_at": "2026-02-08T09:53:43.000000Z",
      "avatar": null,
      "created_at": "2026-02-08T09:53:43.000000Z",
      "updated_at": "2026-02-08T09:53:43.000000Z",
      "deleted_at": null,
      "tenants": [...]
    },
    "authorization": {
      "token": "1|ikPKk2ZTQ6zJV54L9KIjYFjdKkUMYXTMnAlJfVogfc311dae",
      "type": "bearer"
    },
    "companies": [
      {
        "id": "bisco-misr",
        "name": "bisco-misr",
        "slug": "bisco-misr",
        ...
      }
    ]
  },
  "message": "Successfully logged in"
}
```

### Validation Error Response (422)

```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required"],
    "password": ["The password must be at least 6 characters"]
  }
}
```

## How It Works

### 1. User Enters Credentials

User fills in email and password in the login form.

### 2. Form Validation

Local validation using Zod schema checks email format and password length.

### 3. API Request

Form submits to `loginToGlobalEndpoint()` which:

- Makes POST request to `/api/login`
- Sends email and password

### 4. Token Storage

On success:

- Token is extracted from `data.authorization.token`
- Stored in `localStorage` with key `dms_auth_token`
- Token type stored as "bearer"
- Auto-expiry set to 24 hours

### 5. Bearer Token Injection

Auth interceptor automatically adds token to all subsequent requests:

```
Authorization: Bearer <token>
```

### 6. Navigation

Redirects to first available company/tenant workspace:

```
navigate({ to: `/${company.id}/dashboard` })
```

## File Structure

### New Files Created

- `src/core/auth/types/api.types.ts` - API response type definitions
- `src/core/auth/services/token.service.ts` - Token storage management
- `src/core/auth/services/login-endpoint.service.ts` - Global API login
- `src/features/auth/utils/error-handling.ts` - Error parsing utilities

### Modified Files

- `src/config/api.config.ts` - Added `loginGlobal` endpoint
- `src/core/api/interceptors/auth.interceptor.ts` - Added Bearer token injection
- `src/features/auth/hooks/useLoginForm.ts` - Updated to use new login endpoint
- `src/features/auth/components/LoginForm.tsx` - Fixed CSS variables, improved error handling

## Error Handling

### Validation Errors (422)

Validation errors from the API are:

1. Parsed into field-level errors
2. Set on form fields automatically
3. Displayed under respective input

Supported fields:

- `email` - Invalid email or required
- `password` - Invalid password or too short
- General errors - Shown in alert box

### Other Errors

- **401 Unauthorized** - Token invalid/expired
- **423 Locked Account** - Account locked
- **429 Too Many Requests** - Rate limited
- **500 Server Error** - Server-side issue
- **Network Error** - Connection failed

All errors display user-friendly messages.

## Token Management

### Storage

```typescript
localStorage.setItem(
  "dms_auth_token",
  JSON.stringify({
    token: "1|ikPKk...",
    type: "bearer",
    expiresAt: 1707470000000, // 24 hours from now
  }),
);
```

### Retrieval

Token is automatically injected in requests via auth interceptor.

### Clearing

Token is cleared on:

- Logout
- Login failure
- Token expiration

## Configuration

### Environment Variables

Set in `.env`:

```bash
VITE_API_BASE_URL=http://dms.test
```

### CSRF vs Bearer Token

- **Old System**: Used CSRF cookies (Sanctum)
- **New System**: Uses Bearer tokens
- **Both** are supported for backwards compatibility

## Security Considerations

✅ **Token Storage**: In localStorage (accessible to JavaScript)
✅ **Token Expiry**: Auto-expires after 24 hours
✅ **HTTPS Only**: Set `withCredentials: true` in production
✅ **CORS**: Ensure API allows requests from your frontend domain
✅ **Bearer Token**: Sent in Authorization header (not cookie)

## Testing the Login

1. Update `VITE_API_BASE_URL` to your API server
2. Fill in valid credentials from your API
3. Submit form
4. Should redirect to dashboard with token in localStorage
5. Check Network tab to see `Authorization: Bearer <token>` header

## Troubleshooting

### Token not being sent

- Check localStorage has `dms_auth_token`
- Check network tab shows `Authorization: Bearer...` header
- Verify `VITE_API_BASE_URL` is correct

### 422 Validation Errors

- Check API response format matches expected schema
- Verify field names in errors object
- Check browser console for error details

### 401 Unauthorized

- Token may be expired
- Token may be invalid for the resource
- Server may have revoked the token

### CORS Errors

- Check API CORS configuration
- Ensure frontend domain is whitelisted
- Verify `withCredentials: true` is set if needed

## Next Steps

1. ✅ Login system integrated with API
2. ⬜ Test with your actual API credentials
3. ⬜ Configure tenant dashboard access
4. ⬜ Implement logout functionality
5. ⬜ Add remember me functionality
6. ⬜ Implement password reset flow
