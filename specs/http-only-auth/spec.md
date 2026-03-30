# Feature Specification: HTTP-Only Cookie-Based Authentication

**Feature**: HTTP-Only Cookie-Based Authentication  
**Created**: 2026-03-06  
**Status**: In Progress  
**Objective**: Secure authentication using HTTP-only cookies instead of client-side token storage

## User Scenarios & Requirements

### Scenario 1: User Logs In with Secure Cookie

**Acceptance Criteria**:
1. User submits login credentials (email/password)
2. Backend validates credentials and sets HTTP-only authentication cookie
3. Cookie is automatically included in all subsequent API requests (browser sends automatically)
4. Frontend receives Set-Cookie header and updates auth state
5. User is redirected to dashboard
6. User cannot access or modify the cookie via JavaScript (HTTP-only flag)

**Testing**: Login flow works, cookie appears in DevTools, JavaScript cannot read cookie

---

### Scenario 2: Protected Routes Require Valid Cookie

**Acceptance Criteria**:
1. Route guards check if user is authenticated based on cookie validation
2. User with valid cookie can access protected routes
3. User without valid cookie is redirected to login
4. Loading screen displays full-screen spinner while AuthProvider validates cookie on app startup
   - **Clarification**: LoadingScreen blocks route navigation but allows all non-navigation interactions (e.g., user can still zoom, close DevTools, interact with task bar)
5. Route guards do NOT redirect while AuthProvider `isLoading: true` - instead, LoadingScreen prevents navigation
6. After loading completes: If valid cookie → route guard allows access; If no valid cookie → route guard redirects to login

**Testing**: Navigate to protected route with valid cookie (allows access after loading), without valid cookie (redirects to login after loading), verify LoadingScreen displayed during startup validation

---

### Scenario 3: API Requests Include Cookie Automatically

**Acceptance Criteria**:
1. Axios client configured with `withCredentials: true`
2. Browser automatically includes HTTP-only cookie in all API requests
3. No frontend code needs to manually add token to headers
4. CSRF token is initialized on first API request
5. CSRF token is included in request headers for unsafe methods (POST, PUT, DELETE)

**Testing**: Network tab shows Cookie header in requests, CSRF token in headers, API responses succeed

---

### Scenario 4: CSRF Protection with Sanctum

**Acceptance Criteria**:
1. On first API request, `/csrf` endpoint called to initialize CSRF token
2. CSRF token stored in memory and added to request headers
3. Backend validates CSRF token for unsafe methods
4. CSRF attacks are prevented (malicious sites cannot make requests on behalf of user)

**Testing**: Verify CSRF token in Network tab, attempt CSRF attack fails, Sanctum validation works

---

### Scenario 5: Logout Clears Cookie Session

**Acceptance Criteria**:
1. User clicks logout button
2. Frontend calls `/logout` API endpoint
3. Backend invalidates the authentication cookie
4. Frontend clears auth state
5. Frontend redirects to login page
6. User cannot access protected routes with invalidated cookie

**Testing**: After logout, cookie invalid, protected routes redirect to login

---

### Scenario 6: Multi-Tenant Cookie Validation

**Acceptance Criteria**:
1. User switches to different tenant
2. AuthProvider re-validates cookie for new tenant
3. User data and permissions loaded from correct tenant
4. Protected routes accessible with valid tenant context
5. User data from previous tenant is cleared

**Testing**: Switch tenants, verify user data updates, protected routes work for new tenant

---

### Scenario 7: Security Flags Protect Cookie

**Acceptance Criteria**:
1. Authentication cookie has `HttpOnly` flag (JavaScript cannot access)
2. Authentication cookie has `Secure` flag (only sent over HTTPS in production)
3. Authentication cookie has `SameSite` policy (Strict or Lax to prevent CSRF)
4. Cookie domain is correctly scoped
5. Cookie path is correctly scoped
6. XSS attacks cannot steal the cookie

**Testing**: DevTools shows HTTP-only, Secure, and SameSite flags; XSS payload cannot read cookie

---

### Scenario 8: Browser Compatibility

**Acceptance Criteria**:
1. HTTP-only cookies work in Chrome/Chromium
2. HTTP-only cookies work in Firefox
3. HTTP-only cookies work in Safari
4. HTTP-only cookies work in Edge
5. Private/Incognito modes work correctly (cookies stored per session)
6. Cookie-disabled browsers show appropriate error message

**Testing**: Test all browsers, private mode, cookie-disabled mode

---

### Scenario 9: Error Handling for Invalid Cookie

**Acceptance Criteria**:
1. When backend returns 401 (invalid/expired cookie), auth state is cleared
2. User is redirected to login page with error message
3. Error message format: Toast notification in top-right corner showing "Your session expired. Please log in again."
   - **Clarification**: Toast appears for 5 seconds then auto-dismisses, or user can click X to dismiss
4. If user has unsaved work: No auto-redirect (let page-leave handlers detect state loss)
5. On app restart with invalid cookie: LoadingScreen appears, then redirect to login after loading completes
6. Manual retry: User can click "Try Again" in error message or refresh page to attempt re-validation

**Testing**: (1) Delete cookie in DevTools, trigger API call, verify 401 redirects with toast message. (2) Refresh page with deleted cookie, verify LoadingScreen → redirect to login. (3) Verify toast dismisses after 5 seconds

---

### Scenario 10: Performance: Cookie Validation

**Acceptance Criteria**:
1. AuthProvider cookie validation completes in <200ms
2. Route guard checks complete in <10ms
3. CSRF token initialization doesn't block subsequent requests
4. No unnecessary re-renders during cookie validation
5. Slow network connections (fast 3G) still work smoothly

**Testing**: Profile with Network throttling, measure AuthProvider init time, check re-renders

---

## Functional Requirements

| ID | Requirement | Priority | Status |
|----|----|----------|--------|
| FR-001 | HTTP-only cookie is set by backend with Set-Cookie header | Critical | In Progress |
| FR-002 | Axios client configured with withCredentials: true | Critical | ✅ Complete |
| FR-003 | AuthProvider validates cookie on app mount | Critical | ✅ Complete |
| FR-004 | Loading screen shows while validating cookie | High | ⏳ In Progress |
| FR-005 | Route guards enforce authentication via cookie | Critical | ✅ Complete |
| FR-006 | API client initializes CSRF token on first request | Critical | ✅ Complete |
| FR-007 | CSRF token included in unsafe method headers | Critical | ⏳ In Progress |
| FR-008 | 401 responses trigger auth state clear | High | ✅ Complete |
| FR-009 | Logout invalidates cookie on backend | High | ✅ Complete |
| FR-010 | Cookie recovery on app restart (validate on mount) | High | ✅ Complete |
| FR-011 | Multi-tenant cookie validation works correctly | High | ⏳ In Progress |
| FR-012 | Backend: HTTP-only flag set on Set-Cookie header | Critical | ⏳ Backend Phase 2 |
| FR-013 | Backend: Secure flag set on Set-Cookie header (HTTPS prod) | Critical | ⏳ Backend Phase 2 |
| FR-014 | Backend: SameSite policy set on Set-Cookie header | Critical | ⏳ Backend Phase 2 |
| FR-015 | OWASP XSS protection against cookie access | Critical | In Progress |
| FR-016 | OWASP CSRF protection with Sanctum | Critical | In Progress |

---

## Non-Functional Requirements

### Security
- All authentication credentials must be stored in HTTP-only cookies
- All API requests must include CSRF tokens for unsafe methods
- XSS attacks must not be able to access authentication cookie
- CSRF attacks must not be able to make requests on behalf of user
- Must comply with OWASP Top 10 security standards

### Performance
- AuthProvider cookie validation: <200ms
- Route guard checks: <10ms
- CSRF initialization: one-time on first request
- No blocking during initial page load (show LoadingScreen)
- 60fps animations for UI transitions

### Compatibility
- Chrome/Chromium (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Maintainability
- Clear documentation of cookie auth flow
- Debugging guide for common issues
- Comprehensive test coverage (unit, integration, E2E)
- Code comments explaining cookie/CSRF logic

---

## Implementation Notes

### What's Already Done ✅
- Route guards updated with cookie auth documentation
- AuthProvider designed to validate cookies on init
- API client configured for automatic cookie sending
- CSRF token handling via Sanctum interceptor
- Feature specification and task breakdown complete

### What's Pending ⏳

**Backend (Coordinated with Backend Team)**:
- Set backend `/login` endpoint to return Set-Cookie header with HTTP-only, Secure, SameSite flags
- Set backend `/csrf` endpoint to return CSRF token for Sanctum
- Verify backend `/logout` endpoint invalidates session cookie
- Backend team should complete these BEFORE frontend Phase 2 starts

**Frontend**:
- Backend integration testing - verify Set-Cookie response received (Phase 2 depends on backend)
- Loading state UI - show spinner while validating (Phase 6)
- Security testing - verify HTTP-only, Secure, SameSite flags (Phase 9 verification)
- Browser compatibility testing (Phase 10)
- Performance profiling (Phase 12)
- Comprehensive test coverage (Phases 13-15)
- Debugging guides and documentation (Phase 16)

### Key Files to Verify/Update

**Backend**:
- Ensure `/login` endpoint returns `Set-Cookie` header
- Ensure `/logout` endpoint invalidates cookie
- Ensure all protected endpoints validate cookie + CSRF token

**Frontend**:
- `src/core/auth/context/AuthProvider.tsx` - Cookie validation on mount
- `src/core/api/client.ts` - withCredentials configuration
- `src/core/api/interceptors/auth.interceptor.ts` - CSRF and cookie handling
- `src/core/router/guards/route-guards.ts` - Authentication enforcement

---

## Edge Cases

1. **Cookie expires during session**: Backend returns 401 → Auth state cleared → User redirected to login
2. **Multiple tabs open**: All tabs share same cookie → Logout in one tab affects all tabs ✅
3. **Rapid API requests**: Without proper debouncing → CSRF token race condition (mitigated by Sanctum)
4. **Switch tenants**: Clear auth state, validate cookie for new tenant, load new user data
5. **Slow network (fast 3G)**: LoadingScreen prevents interaction until cookie validates
6. **Private/Incognito mode**: Cookies work per-session (cleared when window closes)
7. **Cookies disabled in browser**: Show error message, cannot authenticate
8. **XSS attack attempts**: HTTP-only flag prevents JavaScript access to cookie ✅

---

## Success Metrics

- ✅ All route guards properly enforce cookie-based authentication
- ✅ API requests automatically include cookies (Network tab shows Cookie header)
- ✅ CSRF protection verified (Network tab shows CSRF token header)
- ✅ Security flags verified (DevTools shows HTTP-only, Secure, SameSite)
- ✅ All browsers tested and working
- ✅ Performance targets met (<200ms AuthProvider init)
- ✅ 100% test coverage for auth logic
- ✅ Debugging guide complete and helpful
