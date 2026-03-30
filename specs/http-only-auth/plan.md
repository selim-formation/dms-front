# Implementation Plan: HTTP-Only Cookie-Based Authentication

**Feature**: HTTP-Only Cookie-Based Authentication  
**Branch**: `main` (infrastructure update)  
**Date**: 2026-03-06  

## Summary

Update the entire application infrastructure to use HTTP-only cookies for authentication instead of storing tokens in localStorage/sessionStorage. This ensures the backend can validate all API requests via secure cookies that are:
- Not accessible to JavaScript (prevents XSS attacks)
- Automatically sent by the browser with each request
- Protected with HTTP-only, Secure, and SameSite flags
- Validated by the backend on every API call

The route guards and AuthProvider are already updated to depend on cookie validation. This plan outlines the remaining infrastructure verification, integration testing, and security hardening needed.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2  
**Primary Dependencies**: Axios 1.13, TanStack Query 5.90, TanStack Router 1.159  
**Authentication Method**: HTTP-only cookies (Sanctum protocol)  
**CSRF Protection**: Laravel Sanctum CSRF tokens  
**Backend**: Expects Set-Cookie headers with JSESSIONID/authentication-token  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)  
**Performance Goals**: <200ms AuthProvider cookie validation, <10ms per route guard check  
**Security Goals**: OWASP Top 10 compliance, XSS/CSRF protection, secure cookie flags  

## Current Status

✅ **COMPLETE**:
- Route guards updated with cookie auth documentation (Phase 1)
- Feature specification and task breakdown complete
- Data model and requirements fully defined

⏳ **IN PROGRESS**:
- Backend configuration (Set-Cookie headers, CSRF endpoints) - **Coordinate with Backend Team**
- API client integration testing (Phase 2-3)
- AuthProvider cookie validation (Phase 4)
- Cookie loading state UI (Phase 6)

❌ **NOT STARTED**:
- Route guard enforcement verification (Phase 5) - Blocked until Phase 2-4 complete
- Security testing (Phase 9) - Blocked until backend completes Set-Cookie setup
- Browser compatibility testing (Phase 10)
- Performance profiling (Phase 12)
- Test coverage (Phases 13-15)
- Debugging guides (Phase 11, 16)

## Project Structure

### Documentation

```text
specs/http-only-auth/
├── plan.md              # This file
├── spec.md              # Feature specification
├── data-model.md        # Authentication state model
├── contracts/           # API endpoint specifications
└── tasks.md             # Broken-down tasks from this plan
```

### Frontend Responsibilities
- `src/core/auth/context/AuthProvider.tsx` - Validate cookies on mount, load user data
- `src/core/api/client.ts` - Configure withCredentials: true for automatic cookie sending
- `src/core/api/interceptors/auth.interceptor.ts` - Initialize CSRF token (one-time), add CSRF header
- `src/core/router/guards/route-guards.ts` - Enforce authentication via cookie validation
- `src/shared/components/LoadingScreen.tsx` - Show spinner while validating cookies

### Backend Responsibilities (Set-Cookie Headers)
**These are backend setup, not frontend implementation**:
- `/login` endpoint returns `Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict; Path=/`
- `/csrf` endpoint returns CSRF token for Sanctum (Laravel Sanctum standard)
- `/logout` endpoint invalidates the session (clears cookie on backend side)
- All protected endpoints validate cookie + CSRF token before proceeding
- Return 401 if cookie invalid or expired

**Frontend Verification Tasks** (Phase 2, 9, 10):
- T006-T010: Verify backend returns Set-Cookie headers correctly
- T043-T048: Verify HTTP-only, Secure, SameSite flags are present
- T049-T054: Verify cookies work in all browsers

## Key Implementation Details

### HTTP-Only Cookie Flow

1. **App Startup**:
   - AuthProvider mounts
   - Sets `isLoading: true`
   - Calls `getUser()` API endpoint
   - Backend validates HTTP-only cookie from browser
   - Backend returns user data + permissions if valid, or 401 if invalid

2. **API Requests**:
   - Axios configured with `withCredentials: true`
   - Browser automatically includes HTTP-only cookie in request headers
   - First request initializes CSRF token via `/csrf` endpoint
   - CSRF token added to request headers for unsafe methods (POST, PUT, DELETE)
   - Backend validates both cookie and CSRF token

3. **Logout**:
   - Frontend calls `/logout` API endpoint
   - Backend invalidates the cookie on its side
   - Frontend clears auth state
   - Frontend redirects to login

4. **Protected Routes**:
   - Route guards check `auth.isAuthenticated && auth.user`
   - If false, redirect to login
   - User's previously-validated cookie session used for navigation

## Critical Dependencies

```
Backend Cookie Response
    ↓
AuthProvider Validates Cookie (on mount)
    ↓
API Client Sends Cookie Automatically (withCredentials)
    ↓
Route Guards Enforce Auth (based on cookie validation)
    ↓
Protected Routes Only Accessible with Valid Cookie
```

**Breaking any link breaks the entire auth system.**

## Milestones

| Phase | Name | Status | Impact | Blocker |
|-------|------|--------|--------|---------|
| 1 | Route Guard Documentation | ✅ Complete | High | None |
| 2 | Backend Integration Verification | ⏳ In Progress | High | **Requires backend Set-Cookie setup** |
| 3-4 | API Client & AuthProvider Validation | ⏳ In Progress | High | Blocked by Phase 2 |
| 5-8 | Route Guard & Cookie Management | ❌ Not Started | High | Blocked by Phases 3-4 |
| 9-10 | Security & Browser Testing | ❌ Not Started | High | Blocked by Phase 5 |
| 11-12 | Debugging & Performance | ❌ Not Started | Medium | Blocked by Phase 5 |
| 13-15 | Testing (Unit/Integration/E2E) | ❌ Not Started | Medium | Blocked by Phase 5 |
| 16 | Documentation & Guides | ❌ Not Started | Medium | Blocked by all other phases |

## Success Criteria

✅ All route guards properly enforce authentication via cookies  
✅ AuthProvider validates cookies without blocking route navigation  
✅ API requests automatically include cookies (no manual token handling)  
✅ Security measures in place (HTTP-only, Secure, SameSite flags)  
✅ All modern browsers work correctly  
✅ Performance meets targets  
✅ Comprehensive tests cover all scenarios  
✅ Documentation includes debugging guides  

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Backend not returning Set-Cookie header | Critical | Verify backend configuration in Phase 2 |
| Cookies blocked in private/incognito mode | High | Test and document browser limitations |
| CSRF token initialization fails | High | Implement fallback error handling |
| Route guards block while loading | Medium | Show LoadingScreen during validation |
| XSS attacks access cookie | Critical | Verify HTTP-only flag is set |
| CSRF attacks succeed | High | Verify SameSite and token validation |

## Next Steps to Unblock Implementation

1. **Coordinate with Backend Team** (CRITICAL - Blocks all other phases)
   - Confirm backend will/has implement Set-Cookie headers in `/login` endpoint
   - Confirm backend has `/csrf` endpoint ready for Sanctum
   - Confirm backend validates cookies + CSRF tokens on protected endpoints
   - Estimated timeline: Backend should complete before Frontend Phase 2 starts

2. **Start Frontend Phase 1** (Can start immediately - COMPLETE)
   - Route guard documentation: ✅ DONE

3. **Start Frontend Phase 2** (After backend ready)
   - Verify backend returning Set-Cookie (T006-T010)
   - Depends on backend having Set-Cookie implementation

4. **Proceed with Remaining Phases** (After Phase 2 complete)
   - Phases 3-16 can proceed sequentially after Phase 2 verification

**Estimated Total Timeline**: 3-4 weeks
- Phase 1: 1 day (documentation - done)
- Phase 2: 2-3 days (backend coordination + verification)
- Phases 3-8: 1 week (core integration + loading state)
- Phases 9-12: 5-7 days (security, browser, performance testing)
- Phases 13-16: 1 week (comprehensive testing + docs)

## Related Features

- **Authentication System** (src/core/auth/) - Foundation for cookie validation
- **API Client** (src/core/api/) - Handles cookie transmission
- **Route Guards** (src/core/router/guards/) - Enforce authentication
- **TanStack Query** - Automatic token/cookie management via interceptors
- **Tenant System** - Validates cookie for correct tenant
