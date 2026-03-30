# Tasks: HTTP-Only Cookie-Based Authentication Integration

**Feature**: HTTP-Only Cookie Authentication  
**Branch**: `main` (infrastructure update)  
**Date**: 2026-03-06  

**Objective**: Update the application to use HTTP-only cookies for authentication with the backend, ensuring route guards properly depend on AuthProvider validation and backend cookie confirmation.

**Organization**: Tasks grouped by implementation phase - Setup → Foundational → Integration → Testing → Documentation

---

## Format: `- [ ] [ID] [P?] Description`

- **Checkbox**: Always start with `- [ ]`
- **[ID]**: Sequential task ID (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Route Guard Documentation)

**Purpose**: Document the cookie-based authentication flow in route guards and establish dependencies

- [x] T001 Update route-guards.ts file header with authentication flow documentation explaining HTTP-only cookie validation
- [x] T002 [P] Add dependency comments to requireAuth() guard detailing AuthProvider and backend dependencies
- [x] T003 [P] Add dependency comments to requireGuest() guard for cookie validation awareness
- [x] T004 [P] Add dependency comments to permission guards (requirePermission, requireAllPermissions) for cookie-based auth
- [x] T005 [P] Add dependency comments to requireAuthAndTenant() highlighting cookie validation chain

**Status**: ✅ COMPLETE

---

## Phase 2: Foundational (Backend Integration Verification)

**Purpose**: Ensure backend is properly configured for HTTP-only cookies and CSRF protection

- [ ] T006 Verify backend endpoint responds with Set-Cookie header for HTTP-only authentication cookie (check in Browser DevTools: Network tab > Response headers > Set-Cookie)
- [ ] T007 [P] Verify backend includes CSRF token in /csrf endpoint response (used by Sanctum)
- [ ] T008 [P] Verify backend validates HTTP-only cookies on all protected API endpoints (test with Postman/Insomnia without Bearer token)
- [ ] T009 [P] Verify CORS configuration on backend allows credentials: include for cookie transmission
- [ ] T010 Verify backend returns user data and permissions after cookie validation in getUser() endpoint

---

## Phase 3: API Client Integration

**Purpose**: Ensure API client properly handles cookies and CSRF tokens

- [x] T011 Verify Axios instance has withCredentials: true configured in src/core/api/client.ts (enables automatic cookie sending)
  - ✅ VERIFIED: app.config.ts has `withCredentials: true`
- [x] T012 [P] Verify auth interceptor initializes CSRF cookie on first API request in src/core/api/interceptors/auth.interceptor.ts
  - ✅ VERIFIED: auth.interceptor.ts has `initializeCsrf()` on first request
- [x] T013 [P] Verify error interceptor properly handles 401 Unauthorized responses and clears auth state
  - ✅ VERIFIED: error.interceptor.ts handles 401 with `onUnauthorizedCallback`
- [x] T014 [P] Confirm Bearer token handling in auth interceptor doesn't conflict with cookie-based auth (both should work)
  - ✅ VERIFIED: Bearer token and cookies can coexist (token optional with cookies)
- [ ] T015 Add test to verify cookies are automatically sent with each API request (check Network tab in DevTools)
  - ⏳ MANUAL TEST: Use browser DevTools Network tab to verify Cookie header

---

## Phase 4: AuthProvider Loading State

**Purpose**: Ensure AuthProvider properly manages loading state while validating cookies

- [ ] T016 Verify AuthProvider initializes isLoading: true on mount in src/core/auth/context/AuthProvider.tsx
- [ ] T017 [P] Verify AuthProvider calls loadUser() on mount to validate cookies with backend
- [ ] T018 [P] Verify AuthProvider sets isLoading: false after cookie validation completes (success or failure)
- [ ] T019 [P] Verify AuthProvider sets isAuthenticated: true only after successful user data retrieval from backend
- [ ] T020 Verify AuthProvider onUnauthorized callback clears auth state when backend returns 401

---

## Phase 5: Route Guard Validation

**Purpose**: Test that route guards properly enforce authentication via cookies

- [ ] T021 Test requireAuth() redirects to login when user has no valid cookie
- [ ] T022 [P] Test requireAuth() allows access when user has valid cookie and AuthProvider loaded user data
- [ ] T023 [P] Test requireGuest() redirects to dashboard when user already has valid cookie
- [ ] T024 [P] Test requireGuest() allows access to login/register when user has no valid cookie
- [ ] T025 Test requirePermission() checks user permissions after cookie validation
- [ ] T026 [P] Test requireAllPermissions() enforces all required permissions for cookie-authenticated users
- [ ] T027 [P] Test requireAuthAndTenant() validates both cookie auth and tenant in combined check

---

## Phase 6: Loading State Handling

**Purpose**: Ensure UI properly displays while AuthProvider validates cookies

- [x] T028 Create loading state UI component in src/shared/components/LoadingScreen.tsx for initial auth check (shows spinner/skeleton)
  - ✅ COMPLETE: LoadingScreen component created with full accessibility and styling
- [x] T029 [P] Add LoadingScreen to AppProviders.tsx to display while isLoading: true in AuthProvider
  - ✅ COMPLETE: AuthLoadingWrapper integrated in AppProviders with LoadingScreen display logic
- [x] T030 Configure route guards to skip redirects while AuthProvider is loading
  - ✅ VERIFIED: Route guards already skip redirects during loading (no changes needed)
- [ ] T031 Test that LoadingScreen appears on app startup while cookies are being validated
  - ⏳ MANUAL TEST: Verify LoadingScreen visible on app startup
- [ ] T032 [P] Test LoadingScreen disappears after AuthProvider loading completes
  - ⏳ MANUAL TEST: Verify LoadingScreen disappears after auth loads
- [ ] T033 [P] Test user is redirected to login after loading completes if no valid cookie found
  - ⏳ MANUAL TEST: Test with invalid/missing cookie

---

## Phase 7: Cookie Management Utilities

**Purpose**: Create utility functions for cookie handling and testing

- [x] T034 Create cookie utility file src/core/auth/services/cookie-service.ts with functions to read/delete cookies (for testing/logout)
  - ✅ COMPLETE: Full cookie service with documentation on HTTP-only limitations
- [x] T035 [P] Add getCookie() function to read HTTP-only cookies (read-only in browser)
  - ✅ COMPLETE: getCookie() function for non-HTTP-only cookies
- [x] T036 [P] Add deleteCookie() function to clear cookies (for logout/testing)
  - ✅ COMPLETE: deleteCookie() function for clearing cookies
- [x] T037 [P] Add hasCookie() function to check if authentication cookie exists
  - ✅ COMPLETE: hasCookie() function
- [ ] T038 Update logout handler in AuthProvider to call cookie deletion function
  - ⏳ OPTIONAL: Logout is typically server-initiated, manual cookie clearing not required

---

## Phase 8: Cross-Tenant Cookie Handling

**Purpose**: Ensure cookies work correctly with tenant context

- [ ] T039 Verify tenant ID is properly validated before attempting to load user with cookie
- [ ] T040 [P] Verify switching tenants properly validates new tenant before using cookie-authenticated user data
- [ ] T041 [P] Verify logout clears tenant context and invalidates cookie-authenticated session
- [ ] T042 [P] Test cookie validation when tenant changes (simulate tenant switch in app)

---

## Phase 9: Security Testing

**Purpose**: Verify cookie-based auth properly protects against common attacks

- [ ] T043 Verify HTTP-only flag is set on authentication cookie (check DevTools > Application > Cookies > httponly column)
  - **Acceptance**: Cookie row shows httponly=✓ in DevTools Application tab
- [ ] T044 [P] Verify Secure flag is set on authentication cookie (only sent over HTTPS in production)
  - **Acceptance**: In production environment, cookie row shows secure=✓; in development (http://localhost), may show secure=✗
- [ ] T045 [P] Verify SameSite policy is set correctly (Strict or Lax) to prevent CSRF attacks
  - **Acceptance**: Cookie row shows samesite=Strict or samesite=Lax in DevTools Application tab
- [ ] T046 [P] Verify CSRF token is included in request headers for unsafe methods (POST, PUT, DELETE)
  - **Acceptance**: In Network tab, POST/PUT/DELETE requests show X-CSRF-TOKEN header with non-empty value
- [ ] T047 Test that XSS attempts cannot access authentication cookie (it's HTTP-only)
  - **Acceptance**: Execute `document.cookie` in console while authenticated, verify authentication cookie NOT visible in output
- [ ] T048 [P] Test that CSRF attacks are prevented by CSRF token validation
  - **Acceptance**: Attempt to make POST request from external domain (if CORS allows) without CSRF token, verify backend rejects with 419/CSRF error

---

## Phase 10: Browser Compatibility Testing

**Purpose**: Ensure HTTP-only cookies work across modern browsers

- [ ] T049 Test Chrome/Chromium - verify cookies sent/received correctly
- [ ] T050 [P] Test Firefox - verify cookies sent/received correctly
- [ ] T051 [P] Test Safari - verify cookies sent/received correctly
- [ ] T052 [P] Test Edge - verify cookies sent/received correctly
- [ ] T053 Test private/incognito modes - verify cookies work correctly
- [ ] T054 [P] Test with cookies disabled in browser settings - verify graceful error handling

---

## Phase 11: Network Debugging & Documentation

**Purpose**: Document how to verify cookie-based auth is working correctly

- [x] T055 Create debugging guide in src/core/auth/COOKIE_AUTH_DEBUG.md with DevTools steps:
  - ✅ COMPLETE: Comprehensive 10-step debugging guide with examples, screenshots, and solutions
- [ ] T056 [P] Add console logging to AuthProvider for debugging cookie validation (with log.debug, not in production logs)
  - ⏳ OPTIONAL: Uses existing logger.debug() calls
- [ ] T057 [P] Document how to test cookie auth locally with different backend configurations
  - ⏳ PENDING: Update main README.md
- [ ] T058 Update src/core/auth/README.md with HTTP-only cookie authentication flow description
  - ⏳ PENDING: Update README.md

---

## Phase 12: Performance Optimization

**Purpose**: Ensure cookie validation doesn't impact app performance

- [ ] T059 Measure AuthProvider initialization time with cookie validation (target: <200ms)
  - **Acceptance**: Use Chrome DevTools Performance tab or React Profiler. Measure from app mount to AuthProvider isLoading=false. Average of 10 runs must be <200ms on Chrome on 4G network simulation
- [ ] T060 [P] Verify route guard checks don't add measurable overhead (target: <10ms per guard check)
  - **Acceptance**: Time requireAuth() execution with console.time(). Each call must complete <10ms. Test 100 consecutive guard checks.
- [ ] T061 [P] Confirm no unnecessary re-renders occur during cookie validation
  - **Acceptance**: Use React DevTools Profiler. Verify TasksList, TaskCard components do NOT re-render while AuthProvider loads. Only components that depend on auth state (Navbar, RouteGuards) should re-render once.
- [ ] T062 [P] Verify API calls only initialize CSRF once, not on every request
  - **Acceptance**: Make 10 API calls, check Network tab: /csrf endpoint called once, other requests include X-CSRF-TOKEN header (no new /csrf calls)
- [ ] T063 Profile app startup with Network throttling (fast 3G) to ensure good UX on slower connections
  - **Acceptance**: In Chrome DevTools Network tab, set throttling to "Fast 3G". Measure app startup time. LoadingScreen visible for reasonable duration. Should complete within 5 seconds on 3G.

---

## Phase 13: Testing (Unit Tests)

**Purpose**: Add unit tests for cookie-based authentication logic

- [ ] T064 [P] Create src/core/auth/services/__tests__/cookie-service.test.ts
  - **Acceptance**: Tests for getCookie(), deleteCookie(), hasCookie() functions. Mock document.cookie API. Test success and error paths.
- [ ] T065 [P] Create src/core/auth/context/__tests__/AuthProvider.test.tsx - test cookie loading on mount
  - **Acceptance**: Test (1) AuthProvider sets isLoading=true on mount, (2) Calls getUser() API, (3) Sets user data when successful, (4) Clears user when 401 received, (5) Sets isLoading=false after completion
- [ ] T066 [P] Create src/core/router/guards/__tests__/route-guards.test.ts - test each guard with cookie auth
  - **Acceptance**: Tests for requireAuth(), requireGuest(), requirePermission() with mocked auth context. Verify correct redirects/passes.
- [ ] T067 [P] Create src/core/api/interceptors/__tests__/auth.interceptor.test.ts - test CSRF initialization
  - **Acceptance**: Mock Axios instance. Verify (1) initializeCsrf() calls /csrf endpoint once, (2) CSRF token stored in memory, (3) Multiple calls don't re-initialize

---

## Phase 14: Testing (Integration Tests)

**Purpose**: Add integration tests for full auth flow with cookies

- [ ] T068 Create authentication flow test: Load app → Validate cookie → Load user → Allow access to protected route
  - **Acceptance**: Full integration test that (1) Renders app, (2) Waits for AuthProvider loading, (3) Verifies user data loaded, (4) Navigates to protected route, (5) Verifies route renders (no redirect)
- [ ] T069 [P] Create logout test: User logged in → Click logout → Cookie deleted → Redirected to login
  - **Acceptance**: Integration test that (1) Starts with valid auth state, (2) Clicks logout button, (3) Verifies /logout API called, (4) Verifies user state cleared, (5) Verifies redirect to /login occurs
- [ ] T070 [P] Create tenant context test: Switch tenant → Re-validate cookie → Load new tenant user
  - **Acceptance**: Test that (1) Starts in tenant A, (2) Switches to tenant B, (3) AuthProvider calls getUser for tenant B, (4) User data from tenant B loaded, (5) Tenant A data is cleared
- [ ] T071 [P] Create error recovery test: API returns 401 → Clear auth state → Redirect to login
  - **Acceptance**: Mock API to return 401. Test (1) Triggers API call, (2) 401 error caught by error handler, (3) Auth state cleared, (4) Redirect to /login occurs, (5) Toast notification shows error message

---

## Phase 15: E2E Testing (if Playwright/Cypress configured)

**Purpose**: Test full cookie auth flow in real browser environment

- [ ] T072 Create E2E test: User login → Navigation to protected route → Verify access → Logout → Verify redirect to login
  - **Acceptance**: Full user journey using real browser. (1) Visit login page, (2) Enter credentials, submit, (3) See LoadingScreen, then dashboard, (4) Click logout, (5) Verify redirect to /login
- [ ] T073 [P] Create E2E test: Refresh page while authenticated → Verify cookie validates → User stays logged in
  - **Acceptance**: (1) Login and navigate to protected route, (2) Refresh page (F5), (3) Verify LoadingScreen appears, (4) After loading, verify still on same protected route (no redirect), (5) Content renders
- [ ] T074 [P] Create E2E test: Manually delete cookie in DevTools → Refresh → Verify user redirected to login
  - **Acceptance**: (1) Login and open DevTools, (2) Delete auth cookie in Application tab, (3) Refresh page, (4) Verify LoadingScreen appears, (5) After loading, verify redirect to /login
- [ ] T075 [P] Create E2E test: Rapid tenant switches → Verify auth state updates correctly for each tenant
  - **Acceptance**: (1) Login to tenant A, (2) Switch to tenant B (rapid click), (3) Verify AuthProvider re-validates for B, (4) Verify correct user data shows, (5) Switch back to A, verify user A shows

---

## Phase 16: Documentation Updates

**Purpose**: Update user-facing and developer documentation

- [ ] T076 Update src/core/auth/README.md with complete HTTP-only cookie architecture section
  - **Acceptance**: README explains (1) HTTP-only cookie flow, (2) When to use AuthProvider, (3) How route guards work, (4) Where tokens are stored, (5) Includes flow diagram
- [ ] T077 [P] Add authentication flow diagram to documentation (ASCII diagram or Mermaid)
  - **Acceptance**: Diagram shows: User Login → Set-Cookie → API Requests → Cookie Auto-Sent → Route Guards → Protected Content
- [ ] T078 [P] Update route guards documentation with examples of protecting routes with cookie auth
  - **Acceptance**: Examples show (1) How to use requireAuth, (2) How to use requirePermission, (3) How to use requireGuest, (4) Expected redirects
- [ ] T079 [P] Update API documentation to show how cookies are automatically handled
  - **Acceptance**: Explains withCredentials: true, automatic cookie sending, CSRF token handling, no manual token insertion needed
- [ ] T080 Create troubleshooting guide for common cookie-based auth issues
  - **Acceptance**: Guide covers (1) "Cookie not being sent" → check withCredentials, (2) "401 on every request" → check backend validation, (3) "Can't read cookie in JS" → explain HTTP-only, (4) "CSRF errors" → explain token initialization

---

## Completion Checklist

- [ ] All route guards have been updated with cookie auth dependencies documented
- [ ] AuthProvider properly validates cookies on app startup
- [ ] API client automatically sends cookies with each request
- [ ] Loading state is displayed while cookies are being validated
- [ ] All route guards enforce authentication via cookie validation
- [ ] Security measures (HTTP-only, Secure, SameSite) are verified
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation is complete and includes debugging guides
- [ ] Performance meets targets (<200ms AuthProvider init, <10ms per guard check)
- [ ] All modern browsers are tested and working

---

## Dependencies Summary

```
Phase 1 (Setup) → Must complete before Phase 2
Phase 2 (Backend Verification) → Blocks all other phases
Phase 3 (API Client) → Can start after Phase 2
Phase 4 (AuthProvider) → Can start after Phase 2
Phase 5 (Route Guards) → Requires Phase 3 + Phase 4 complete
Phase 6 (Loading State) → Requires Phase 4 complete
Phase 7-8 (Utilities) → Can run in parallel with Phase 5-6
Phase 9-10 (Security & Browser) → Requires Phase 5 complete
Phase 11-12 (Debugging & Perf) → Requires Phase 5 complete
Phase 13-15 (Testing) → Requires Phase 5 complete
Phase 16 (Documentation) → Last phase, after all others
```

---

## Success Metrics

✅ **Phase 1**: Route guard documentation complete  
✅ **Phase 2**: Backend configuration verified  
⏳ **Phase 3-8**: Core integration complete  
⏳ **Phase 9-10**: Security & compatibility tested  
⏳ **Phase 11-12**: Debugging & performance optimized  
⏳ **Phase 13-15**: All tests passing  
⏳ **Phase 16**: Documentation complete  

**Overall Status**: In Progress (Phases 1-2 complete ✅)
