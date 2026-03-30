# HTTP-Only Cookie Authentication Debugging Guide

**Purpose**: Help developers verify and troubleshoot HTTP-only cookie-based authentication in the application.

**Key Principle**: Authentication cookies are HTTP-only, meaning they cannot be accessed from JavaScript. They are automatically sent by the browser with every API request.

---

## How Cookie-Based Auth Works in This App

```
1. User lands on app
   ↓
2. AuthProvider mounts, calls GET /api/me
   ↓
3. Browser automatically sends authentication cookie
   ↓
4. Backend validates cookie, returns user data
   ↓
5. AuthProvider stores user in state
   ↓
6. LoadingScreen disappears, content renders
   ↓
7. Route guards check auth state, allow/deny access
   ↓
8. User makes API calls
   ↓
9. Browser sends cookie + CSRF token automatically
   ↓
10. Backend validates both, processes request
```

---

## Debugging Checklist

### 1. Verify Cookie Exists (Browser DevTools)

**Steps**:
1. Open browser DevTools: `F12` or `Cmd+Option+I` (Mac)
2. Go to **Application** tab (or **Storage** tab in Firefox)
3. Click **Cookies** in the left sidebar
4. Find your application's domain
5. Look for `id_token` cookie (or your configured auth cookie name)

**What to check**:
- ✅ **Name**: Should be `id_token` (or your configured name)
- ✅ **Value**: Long string starting with `eyJ...` (JWT format) or random string
- ✅ **Domain**: Should be your application domain (e.g., `localhost` or `app.example.com`)
- ✅ **Path**: Should be `/` (or path where app is deployed)
- ✅ **Expires**: Should be a future date (not past date, not "Session")
- ✅ **HttpOnly**: **MUST be ✓ checked** (if unchecked, cookie is NOT secure!)
- ✅ **Secure**: Should be ✓ checked in production (HTTPS only). May be unchecked in development (HTTP).
- ✅ **SameSite**: Should be **Strict** or **Lax** (prevents CSRF attacks)

**Screenshots**:
```
Cookie Name     Value                           Domain    Path  HttpOnly  Secure  SameSite
id_token        eyJhbGciOiJIUzI1NiIsInR5cCI...  localhost /     ✓         ☐      Strict
```

**If cookie doesn't exist**:
- ❌ Check backend `/login` endpoint
- ❌ Verify backend returns `Set-Cookie` header
- ❌ Check browser cookie settings (may be disabled)

---

### 2. Verify Set-Cookie Response Header

**Steps**:
1. Open browser DevTools: `F12`
2. Go to **Network** tab
3. Perform login or refresh page
4. Click on API request that sets cookie (usually `POST /login` or `GET /me`)
5. Click **Headers** panel
6. Scroll to **Response Headers** section

**What to check**:
- ✅ **Set-Cookie header present**: `Set-Cookie: id_token=...`
- ✅ **HttpOnly flag**: `;HttpOnly`
- ✅ **Secure flag**: `;Secure` (at least in production)
- ✅ **SameSite flag**: `;SameSite=Strict` or `;SameSite=Lax`
- ✅ **Path flag**: `;Path=/`
- ✅ **Max-Age or Expires**: `;Max-Age=86400` or `;Expires=...`

**Example Response Header**:
```
Set-Cookie: id_token=eyJhbGciOiJIUzI1NiIsInR5cCI...; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**If Set-Cookie header is missing**:
- ❌ Check backend `/login` endpoint implementation
- ❌ Verify backend is using Laravel Sanctum or similar auth system
- ❌ Check backend middleware for cookie configuration

---

### 3. Verify Cookie Sent with API Requests

**Steps**:
1. Open browser DevTools: `F12`
2. Go to **Network** tab
3. Make an API request (e.g., navigate to protected page, load data)
4. Click on any API request (e.g., `GET /api/tasks`)
5. Click **Headers** panel
6. Scroll to **Request Headers** section

**What to check**:
- ✅ **Cookie header present**: `Cookie: id_token=...`
- ✅ **Value matches**: Should match the cookie in Application tab

**Example Request Header**:
```
Cookie: id_token=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

**If Cookie header is missing**:
- ❌ Check Axios configuration: `withCredentials: true` in `src/config/app.config.ts`
- ❌ Check browser console for CORS errors
- ❌ Verify API domain matches cookie domain

---

### 4. Verify CSRF Token in Request Headers

**Steps**:
1. Open browser DevTools: `F12`
2. Go to **Network** tab
3. Make a POST/PUT/DELETE API request
4. Click on the request
5. Click **Headers** panel
6. Scroll to **Request Headers** section

**What to check**:
- ✅ **X-CSRF-TOKEN header present** (for POST/PUT/DELETE)
- ✅ **Value is non-empty**: Long string or UUID format
- ✅ **Not present on GET requests** (typically GET doesn't need CSRF)

**Example Request Header**:
```
X-CSRF-TOKEN: abc123def456ghi789jkl012mno345pqr678stu901vwx
```

**If CSRF token is missing**:
- ❌ Check `/api/csrf` endpoint response (should return CSRF token)
- ❌ Check `src/core/api/interceptors/auth.interceptor.ts`
- ❌ Verify backend is using Laravel Sanctum CSRF protection

---

### 5. Check Loading Screen During App Startup

**Steps**:
1. Open app in browser (fresh load or refresh)
2. Watch for spinning loading screen
3. Verify it appears briefly during startup
4. Verify it disappears after user data loads
5. Verify content renders after LoadingScreen disappears

**What to check**:
- ✅ **LoadingScreen visible**: Shows spinner + "Validating session..." message
- ✅ **Duration**: Appears for 1-3 seconds (depending on API speed)
- ✅ **Blocks navigation**: Cannot click links while loading
- ✅ **Allows other interaction**: Can zoom, open DevTools, etc.

**If LoadingScreen doesn't appear**:
- ❌ Check `src/shared/components/LoadingScreen.tsx` exists
- ❌ Check `src/core/providers/AppProviders.tsx` has LoadingScreen integration
- ❌ Check AuthProvider `isLoading` state is true on mount

---

### 6. Check Authentication State in Console

**Steps**:
1. Open browser DevTools: `F12`
2. Go to **Console** tab
3. Add this code to a route component or run manually:

```javascript
// Get auth context (requires useAuth hook or manual context access)
const { auth } = await import('@/core/auth/context/AuthContext');
console.log('Auth State:', {
  user: auth.user,
  permissions: auth.permissions,
  isAuthenticated: auth.isAuthenticated,
  isLoading: auth.isLoading
});
```

**OR** use React DevTools:
1. Install **React Developer Tools** Chrome extension
2. Inspect **AuthProvider** component
3. Check `props` for auth state values

**What to check**:
- ✅ **user**: Should have `id`, `email`, `name` if authenticated
- ✅ **permissions**: Should be array like `["read:tasks", "create:tasks"]`
- ✅ **isAuthenticated**: Should be `true` after loading
- ✅ **isLoading**: Should be `false` after auth completes

---

### 7. Test Cookie Disabled Scenario

**Steps** (Chrome):
1. Open DevTools: `F12`
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) to open Command Palette
3. Type "Disable cookies"
4. Select "Disable cookies"
5. Refresh page
6. Check error handling

**Expected behavior**:
- ❌ LoadingScreen appears
- ❌ `/api/me` request fails (backend returns 401)
- ❌ Redirects to `/login`
- ❌ Error message shown (or silent redirect)

**If behavior is different**:
- ❌ Check error interceptor handles 401 correctly
- ❌ Verify route guards redirect on auth failure

---

### 8. Test CSRF Token Validation

**Steps**:
1. Open browser DevTools Console: `F12` → **Console**
2. Manually make API request WITHOUT CSRF token:

```javascript
// This should FAIL (401 or 419 CSRF error)
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ title: 'Test' })
}).then(r => r.json()).then(d => console.log('Response:', d));
```

**Expected result**:
- ❌ Response status: `419 Token Mismatch` or `401 Unauthorized`
- ✅ NOT `200 Success` (no CSRF token should succeed)

**If request succeeds**:
- ❌ Backend CSRF validation is NOT enabled
- ❌ Check backend Sanctum middleware configuration

---

### 9. Test Cookie Expiration / Refresh

**Steps**:
1. Login normally
2. Go to DevTools **Application** tab
3. Find `id_token` cookie
4. Edit the value to something invalid (change a few characters)
5. Refresh page
6. Check behavior

**Expected behavior**:
- ❌ LoadingScreen appears (validates cookie)
- ❌ Backend returns 401 (invalid cookie)
- ❌ Page redirects to login
- ❌ Error message shown

**If behavior is different**:
- ❌ Check error interceptor 401 handling
- ❌ Verify route guards redirect on invalid auth

---

### 10. Monitor Network Latency

**Steps**:
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Set throttling: **Network conditions** → Select "Slow 3G"
4. Refresh page
5. Watch API request timing

**Measure**:
- Time from page load to LoadingScreen visible: should be <100ms
- Time for `/api/me` request: should complete <3s on 3G
- Time for LoadingScreen to disappear: should be <500ms after response

**If latency is high**:
- ❌ API is slow (backend optimization needed)
- ❌ Network latency is high (nothing to fix on frontend)
- ✅ Consider showing estimated time remaining to user

---

## Common Issues and Solutions

### Issue: "Cookie not being sent with API requests"

**Symptoms**:
- API requests fail with 401
- Network tab shows NO `Cookie` header
- Cookie exists in DevTools Application tab

**Solutions**:
1. Check `withCredentials: true` in Axios config
2. Verify API domain matches cookie domain
3. Check CORS configuration on backend (must allow credentials)
4. Verify cookie `Secure` flag matches protocol (HTTP vs HTTPS)

---

### Issue: "403 CSRF Token Mismatch errors"

**Symptoms**:
- POST/PUT/DELETE requests fail with 419 or "Token Mismatch"
- GET requests work fine
- Network tab shows NO `X-CSRF-TOKEN` header on POST

**Solutions**:
1. Check `/api/csrf` endpoint returns token
2. Verify `initializeCsrf()` runs before first API request
3. Check `X-CSRF-TOKEN` header is added to unsafe methods
4. Verify backend expects header name `X-CSRF-TOKEN` (not `X-XSRF-TOKEN`)

---

### Issue: "LoadingScreen stays visible forever"

**Symptoms**:
- App boots, LoadingScreen appears
- Spinner still spinning after 5+ seconds
- Content never renders

**Solutions**:
1. Check `/api/me` endpoint is working (test in Postman)
2. Check AuthProvider `setIsLoading(false)` in finally block
3. Check network tab for hanging requests
4. Check browser console for JavaScript errors

---

### Issue: "User gets logged out randomly during session"

**Symptoms**:
- App works fine
- After some time, suddenly redirected to login
- No error message shown

**Solutions**:
1. Check cookie `Max-Age` or `Expires` (may be too short)
2. Check backend session timeout setting
3. Check if cookie is being cleared by server
4. Check error interceptor logs for 401 responses

---

## Console Logging for Debugging

The auth system includes debug logging. Enable it in console:

```javascript
// Show all auth debug logs
localStorage.setItem('debug', 'Auth*');
console.log('Auth debug logging enabled. Refresh page.');

// Or enable only specific modules
localStorage.setItem('debug', 'Auth:*,Auth Interceptor:*,Auth Provider:*');

// To disable
localStorage.removeItem('debug');
```

Then watch console output while testing.

---

## Testing with Postman/Insomnia

To test the API outside the browser:

1. **Disable auto-following redirects**
2. **Send first request to `/login`**: Get Set-Cookie header
3. **Copy cookie value** from response `Set-Cookie` header
4. **Add to next request**: `Cookie: id_token=<value>`
5. **Get CSRF token** from `/api/csrf`
6. **Add CSRF to POST/PUT/DELETE**: Header `X-CSRF-TOKEN: <token>`
7. **Make protected API call** with both cookie and CSRF

---

## Performance Profiling

To measure auth performance:

```javascript
performance.mark('auth-start');
// ... let AuthProvider load ...
performance.mark('auth-end');
performance.measure('auth-init', 'auth-start', 'auth-end');
console.log(performance.getEntriesByName('auth-init')[0].duration + 'ms');
```

Target: <200ms for cookie validation + user load

---

## Summary Checklist

Before going to production, verify:

- [ ] Cookie has `HttpOnly` flag
- [ ] Cookie has `Secure` flag (production)
- [ ] Cookie has `SameSite` policy (Strict or Lax)
- [ ] `Set-Cookie` header present in login response
- [ ] `Cookie` header present in API requests
- [ ] `X-CSRF-TOKEN` header present in unsafe methods
- [ ] `/api/csrf` endpoint working
- [ ] `/api/me` endpoint working  
- [ ] LoadingScreen appears on app startup
- [ ] Error on 401 response redirects to login
- [ ] Works in all supported browsers
- [ ] Works with cookies disabled shows error
- [ ] Performance <200ms for auth init

---

## Support

For issues not covered here:
- Check [src/core/auth/README.md](./README.md) for architecture overview
- Review tests in [__tests__](./services/__tests__/) for examples
- Check application logs in browser console
- Check backend logs for cookie/CSRF errors
