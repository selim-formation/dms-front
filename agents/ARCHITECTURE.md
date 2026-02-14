# Frontend Architecture - Multi-Tenant SaaS DMS

**Version:** 1.0  
**Date:** February 11, 2026  
**Status:** Production-Ready Design  
**Stack:** React 18 + TypeScript + Vite + TanStack Router + TanStack Query + Tailwind + shadcn/ui

---

## 1. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION ENTRY                              │
│                         (Tenant Detection Layer)                         │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         TENANT CONTEXT PROVIDER                          │
│                  (Global tenant state + validation)                      │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          AUTH CONTEXT PROVIDER                           │
│               (Sanctum integration + permission cache)                   │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       TANSTACK QUERY PROVIDER                            │
│          (Tenant-scoped query keys + cache invalidation)                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROUTER (TanStack Router)                         │
│                    /{tenant}/* route tree structure                      │
│                                                                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐    │
│  │  Public Routes  │  │  Auth Routes     │  │  Protected Routes  │    │
│  │  - Landing      │  │  - Login         │  │  - Dashboard       │    │
│  │  - Marketing    │  │  - Register      │  │  - Documents       │    │
│  └─────────────────┘  └──────────────────┘  │  - Settings        │    │
│                                               │  - Admin           │    │
│                                               └────────────────────┘    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌────────────────┐ ┌─────────────────┐
│  FEATURE MODULES│ │  SHARED LAYER  │ │   API LAYER     │
│                 │ │                │ │                 │
│ - Documents     │ │ - Components   │ │ - API Client    │
│ - Workspaces    │ │ - Hooks        │ │ - Query/Mutation│
│ - Users         │ │ - Utils        │ │   Factories     │
│ - Teams         │ │ - Types        │ │ - Error Handler │
│ - Audit         │ │ - Validators   │ │ - Interceptors  │
│                 │ │                │ │   (Tenant/Auth) │
└────────┬────────┘ └────────┬───────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   LARAVEL BACKEND     │
                 │                       │
                 │  - Sanctum Auth       │
                 │  - Tenant Middleware  │
                 │  - Policy Enforcement │
                 └───────────────────────┘
```

### Data Flow Patterns

**1. Tenant Context Flow:**
```
URL (/{tenant}/...) → Tenant Detection → Validation (API call) → 
Context Provider → All child components + API calls
```

**2. Authentication Flow:**
```
User Input → Login API (CSRF + credentials) → Sanctum Cookie → 
Auth Context → Protected Routes/Components
```

**3. Data Fetching Flow:**
```
Component → useQuery Hook → Query Factory → API Client → 
HTTP Client (tenant + auth headers) → Laravel Backend → 
Response → Cache (tenant-scoped) → Component
```

**4. Permission-Based Rendering:**
```
Component Mount → usePermissions hook → Check cache → 
(if stale) API call → Update cache → Component re-render
```

---

## 2. COMPLETE FOLDER STRUCTURE

```
src/
├── main.tsx                          # Application entry point
├── App.tsx                           # Root component with providers
├── router.tsx                        # TanStack Router configuration
│
├── core/                             # Core system functionality (non-feature-specific)
│   ├── api/
│   │   ├── client.ts                 # Axios/fetch wrapper with tenant/auth interceptors
│   │   ├── query-client.ts           # TanStack Query client configuration
│   │   ├── error-handler.ts          # Centralized API error handling
│   │   ├── types.ts                  # API response/request base types
│   │   └── interceptors/
│   │       ├── tenant.interceptor.ts # Injects tenant ID into requests
│   │       ├── auth.interceptor.ts   # Handles CSRF + Sanctum cookies
│   │       └── error.interceptor.ts  # Global error transformation
│   │
│   ├── auth/
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Auth state provider
│   │   │   └── AuthProvider.tsx      # Auth logic container
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth context consumer
│   │   │   ├── usePermissions.ts     # Permission checking hook
│   │   │   └── useAbility.ts         # CASL-style ability checker
│   │   ├── guards/
│   │   │   ├── AuthGuard.tsx         # Protects authenticated routes
│   │   │   ├── GuestGuard.tsx        # Redirects authenticated users
│   │   │   └── PermissionGuard.tsx   # Permission-based route guard
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Login/logout/register API calls
│   │   │   └── sanctum.service.ts    # CSRF token management
│   │   └── types.ts                  # Auth-related types
│   │
│   ├── tenant/
│   │   ├── context/
│   │   │   ├── TenantContext.tsx     # Tenant state provider
│   │   │   └── TenantProvider.tsx    # Tenant detection + validation
│   │   ├── hooks/
│   │   │   ├── useTenant.ts          # Tenant context consumer
│   │   │   └── useTenantValidation.ts# Tenant existence validation
│   │   ├── services/
│   │   │   └── tenant.service.ts     # Tenant-related API calls
│   │   └── types.ts                  # Tenant-related types
│   │
│   ├── router/
│   │   ├── guards/
│   │   │   └── route-guards.ts       # Centralized route guard logic
│   │   ├── hooks/
│   │   │   ├── useNavigate.ts        # Tenant-aware navigation
│   │   │   └── useRouteParams.ts     # Type-safe route params
│   │   └── utils/
│   │       └── route-builder.ts      # Helper to build tenant-aware URLs
│   │
│   └── providers/
│       └── AppProviders.tsx          # Combines all global providers
│
├── features/                         # Feature modules (vertical slices)
│   ├── documents/
│   │   ├── api/
│   │   │   ├── documents.queries.ts  # Query factories
│   │   │   ├── documents.mutations.ts# Mutation factories
│   │   │   └── documents.service.ts  # Raw API functions
│   │   ├── components/
│   │   │   ├── DocumentList/
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   ├── DocumentListItem.tsx
│   │   │   │   └── DocumentListSkeleton.tsx
│   │   │   ├── DocumentViewer/
│   │   │   │   ├── DocumentViewer.tsx
│   │   │   │   └── DocumentControls.tsx
│   │   │   └── DocumentUpload/
│   │   │       └── DocumentUpload.tsx
│   │   ├── hooks/
│   │   │   ├── useDocuments.ts       # List/search documents
│   │   │   ├── useDocument.ts        # Single document operations
│   │   │   ├── useDocumentUpload.ts  # File upload logic
│   │   │   └── useDocumentPermissions.ts
│   │   ├── routes/
│   │   │   └── documents.routes.tsx  # Feature route definitions
│   │   ├── types/
│   │   │   └── document.types.ts     # Feature-specific types
│   │   └── utils/
│   │       ├── document-validators.ts
│   │       └── file-helpers.ts
│   │
│   ├── workspaces/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── users/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── teams/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── audit/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── settings/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── dashboard/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── routes/
│       └── types/
│
├── shared/                           # Shared code (horizontal concerns)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx         # Main authenticated layout
│   │   │   ├── AuthLayout.tsx        # Login/register layout
│   │   │   └── PublicLayout.tsx      # Marketing/landing layout
│   │   ├── feedback/
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── ErrorFallback.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Spinner.tsx
│   │   ├── data-display/
│   │   │   ├── DataTable/            # Reusable table component
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── DataTablePagination.tsx
│   │   │   │   └── DataTableFilters.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── InfoCard.tsx
│   │   └── forms/
│   │       ├── FormField.tsx         # Reusable form field wrapper
│   │       ├── FormError.tsx
│   │       └── FormFieldLabel.tsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useDisclosure.ts          # Modal/drawer open/close state
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── usePagination.ts
│   │   ├── useTable.ts               # Table state management
│   │   └── useToast.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                     # Tailwind class name merger
│   │   ├── format.ts                 # Date/number/currency formatters
│   │   ├── validation.ts             # Common validators (zod schemas)
│   │   ├── constants.ts              # App-wide constants
│   │   ├── logger.ts                 # Console logger wrapper
│   │   └── error-mapper.ts           # Map backend errors to user messages
│   │
│   ├── types/
│   │   ├── api.types.ts              # Shared API types
│   │   ├── common.types.ts           # Common domain types
│   │   ├── pagination.types.ts
│   │   └── permission.types.ts
│   │
│   └── lib/
│       ├── react-query.ts            # Query client + default options
│       ├── axios.ts                  # Axios instance configuration
│       └── zod.ts                    # Zod configuration/extensions
│
├── routes/                           # Route tree (TanStack Router)
│   ├── __root.tsx                    # Root route + layout
│   ├── _public/                      # Public route group
│   │   ├── index.tsx                 # Landing page
│   │   └── about.tsx
│   ├── _auth/                        # Auth route group (tenant-aware)
│   │   ├── $tenant/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   ├── _app/                         # Protected route group (authenticated + tenant)
│   │   └── $tenant/
│   │       ├── dashboard/
│   │       │   └── index.tsx
│   │       ├── documents/
│   │       │   ├── index.tsx
│   │       │   ├── $documentId/
│   │       │   │   ├── index.tsx
│   │       │   │   └── edit.tsx
│   │       │   └── new.tsx
│   │       ├── workspaces/
│   │       │   ├── index.tsx
│   │       │   └── $workspaceId/
│   │       │       └── index.tsx
│   │       ├── users/
│   │       ├── teams/
│   │       ├── audit/
│   │       └── settings/
│   │           ├── index.tsx
│   │           ├── profile.tsx
│   │           ├── security.tsx
│   │           └── preferences.tsx
│
├── assets/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                           # Global styles
│   ├── globals.css                   # Tailwind imports + global styles
│   └── themes/
│       ├── default.css
│       └── dark.css
│
├── config/                           # Configuration files
│   ├── app.config.ts                 # App-wide configuration
│   ├── api.config.ts                 # API endpoints + base URLs
│   ├── permissions.config.ts         # Permission constants
│   └── feature-flags.config.ts       # Feature flag definitions
│
└── tests/                            # Test utilities
    ├── setup.ts                      # Test setup + global mocks
    ├── utils/
    │   ├── test-utils.tsx            # Custom render with providers
    │   ├── mock-data.ts              # Mock data factories
    │   └── mock-api.ts               # MSW handlers
    └── __mocks__/
        └── axios.ts
```

---

## 3. MODULE RESPONSIBILITIES

### Core Modules (`src/core/`)

**Purpose:** System-level functionality that's tenant-aware but feature-agnostic.

#### `core/api/`
- **Responsibility:** HTTP communication layer abstraction
- **Key Components:**
  - `client.ts`: Axios instance with base configuration
  - `query-client.ts`: TanStack Query client with tenant-scoped cache keys
  - `error-handler.ts`: Transforms API errors into user-friendly messages
  - Interceptors: Inject tenant ID, CSRF tokens, handle 401/403
- **Dependencies:** None (foundation layer)
- **Consumed By:** All feature modules

#### `core/auth/`
- **Responsibility:** Authentication state management + Sanctum integration
- **Key Components:**
  - `AuthProvider`: Manages user session, login/logout, permissions cache
  - `useAuth()`: Access auth state anywhere
  - `usePermissions()`: Check user permissions/abilities
  - Route guards: Protect routes based on auth state
- **Dependencies:** `core/api`, `core/tenant`
- **Consumed By:** Router, feature modules, shared components

#### `core/tenant/`
- **Responsibility:** Tenant context management + validation
- **Key Components:**
  - `TenantProvider`: Extracts tenant from URL, validates existence
  - `useTenant()`: Access current tenant anywhere
  - Tenant validation API calls
- **Dependencies:** `core/api`
- **Consumed By:** `core/auth`, `core/api` (interceptors), all features

#### `core/router/`
- **Responsibility:** Routing utilities + tenant-aware navigation
- **Key Components:**
  - Route guards: Centralized beforeLoad logic
  - `useNavigate()`: Wrapper that auto-includes tenant in URLs
  - `routeBuilder`: Helper functions to build tenant-aware routes
- **Dependencies:** `core/tenant`, `core/auth`
- **Consumed By:** All feature modules, components

### Feature Modules (`src/features/`)

**Purpose:** Vertical slices of business functionality (self-contained)

**Structure Pattern (applies to all features):**

```
feature-name/
├── api/               # TanStack Query hooks + raw API calls
├── components/        # Feature-specific UI components
├── hooks/             # Feature-specific business logic hooks
├── routes/            # Route definitions for this feature
├── types/             # TypeScript types for this feature
└── utils/             # Feature-specific utilities
```

**Design Principles:**
1. **High Cohesion:** Everything related to a feature lives in its folder
2. **Low Coupling:** Features don't import from each other (use shared/)
3. **Lazy Loading:** Each feature is code-split at the route level
4. **Testability:** Features can be tested in isolation

**Dependencies:**
- Feature modules → `core/` (allowed)
- Feature modules → `shared/` (allowed)
- Feature modules → other feature modules (❌ NOT allowed)

### Shared Module (`src/shared/`)

**Purpose:** Reusable code used across multiple features

#### `shared/components/`
- **Responsibility:** UI components with no business logic
- **Categories:**
  - `ui/`: shadcn/ui components (design system foundation)
  - `layouts/`: Page layout shells
  - `feedback/`: Loading/error states, toasts
  - `data-display/`: Tables, cards, lists
  - `forms/`: Form field wrappers, validation display
- **Dependencies:** None (except shadcn/ui primitives)
- **Consumed By:** Feature modules, route components

#### `shared/hooks/`
- **Responsibility:** Generic React hooks for common patterns
- **Examples:** useDebounce, useLocalStorage, usePagination
- **Dependencies:** Minimal (React only)
- **Consumed By:** Feature modules, shared components

#### `shared/utils/`
- **Responsibility:** Pure functions for common operations
- **Examples:** Date formatting, validation schemas, string manipulation
- **Dependencies:** Third-party libs only (date-fns, zod, etc.)
- **Consumed By:** Everywhere

#### `shared/types/`
- **Responsibility:** TypeScript types used across features
- **Examples:** Pagination, API response wrappers, permission enums
- **Dependencies:** None
- **Consumed By:** Core modules, feature modules

### Routes Module (`src/routes/`)

**Purpose:** TanStack Router file-based routing structure

**Organization:**
- Route files follow TanStack Router conventions
- Each file exports route definition + component
- Route groups: `_public`, `_auth`, `_app` (with layouts)
- Lazy loading: Import feature components dynamically

**Dependencies:** Feature modules (lazy imports)

---

## 4. KEY ARCHITECTURAL DECISIONS

### Decision 1: Tenant Context Strategy

**Approach:** URL-based tenant detection with React Context + API validation

**Implementation:**
```
Flow: URL (/{tenant}/...) → Router → TenantProvider → Validation API → 
      Context Available → API Client Interceptor → All Requests
```

**Why This Approach:**
- ✅ **SEO-friendly:** Tenant in URL is crawlable
- ✅ **Bookmarkable:** Users can bookmark tenant-specific pages
- ✅ **Explicit:** No ambiguity about which tenant is active
- ✅ **Backend alignment:** Matches Laravel tenant routing
- ✅ **No token dependency:** Tenant detection doesn't require auth

**Technical Details:**
1. **TanStack Router extracts tenant** from URL params on every route
2. **TenantProvider validates** tenant exists via API call (cached)
3. **Context makes tenant available** to all components via `useTenant()`
4. **API interceptor injects** tenant ID into all requests (header or URL)
5. **Query keys are scoped** by tenant to prevent cache leakage

**Cache Strategy:**
- Tenant validation cached for 1 hour (stale-while-revalidate)
- Query keys: `['tenant', tenantId, 'resource', ...]`
- Cache invalidation clears tenant-specific cache on tenant switch

**Alternative Rejected:**
- ❌ Subdomain-based: Requires complex local dev setup
- ❌ Header-only: Not bookmarkable, SEO issues

---

### Decision 2: API Abstraction Layer

**Approach:** Three-layer abstraction (Client → Service → Query/Mutation Factory)

**Layer 1: HTTP Client (`core/api/client.ts`)**
```typescript
// Axios instance with interceptors
- Base URL configuration
- Tenant ID injection (request interceptor)
- CSRF token handling (request interceptor)
- Auth cookie forwarding (Sanctum)
- Error normalization (response interceptor)
- Retry logic for network failures
```

**Layer 2: Service Functions (`features/*/api/*.service.ts`)**
```typescript
// Raw API calls (promise-based)
- Pure functions that return promises
- No React dependencies
- Type-safe request/response
- Easily mockable for testing
```

**Layer 3: Query/Mutation Factories (`features/*/api/*.queries.ts`)**
```typescript
// TanStack Query hooks
- useQuery/useMutation wrappers
- Tenant-scoped cache keys
- Optimistic updates
- Cache invalidation logic
- Loading/error states
```

**Why This Approach:**
- ✅ **Separation of Concerns:** Each layer has single responsibility
- ✅ **Testability:** Service layer testable without React
- ✅ **Reusability:** Service functions used outside React (e.g., middleware)
- ✅ **Type Safety:** Types flow through all layers
- ✅ **Cache Control:** Centralized cache key management

**Example Flow:**
```
Component → useDocuments() → documentsQueries.useList() → 
documentsService.getDocuments() → apiClient.get() → Laravel API
```

**Cache Key Structure:**
```typescript
// Tenant-scoped to prevent cross-tenant data leakage
[tenantId, 'documents', 'list', { filters }]
[tenantId, 'documents', 'detail', documentId]
[tenantId, 'users', 'list', { page }]
```

**Alternative Rejected:**
- ❌ Direct fetch in components: Not DRY, no cache, hard to test
- ❌ Single layer (hook only): Tight coupling, can't reuse logic

---

### Decision 3: Sanctum Authentication Integration

**Approach:** Cookie-based SPA authentication with CSRF protection

**Flow:**
```
1. User visits /{tenant}/login
2. Frontend calls /sanctum/csrf-cookie (Laravel)
3. Laravel sets XSRF-TOKEN cookie
4. Frontend submits login credentials to /{tenant}/login
5. Laravel validates, returns user data, sets session cookie
6. All subsequent requests include session cookie automatically
7. Frontend stores user state in React Context
```

**Technical Implementation:**

**CSRF Handling:**
- Before login: Call `/sanctum/csrf-cookie` endpoint
- Laravel sets `XSRF-TOKEN` cookie (encrypted)
- Axios reads cookie and sends as `X-XSRF-TOKEN` header automatically
- Backend validates CSRF on state-changing requests

**Session Management:**
- Sanctum uses Laravel session (cookie-based)
- Cookie: `laravel_session` (httpOnly, secure, sameSite)
- Frontend never directly handles the cookie (httpOnly prevents XSS)
- Axios `withCredentials: true` to include cookies in CORS requests

**Auth State Management:**
```typescript
AuthContext stores:
- user: User | null (from /api/user endpoint)
- permissions: string[] (from /api/user/permissions)
- loading: boolean
- isAuthenticated: boolean

Methods:
- login(credentials): Logs in + fetches user
- logout(): Invalidates session + clears state
- refetchUser(): Re-fetches user data (after updates)
```

**Permission Caching:**
- Permissions loaded once on app init (if authenticated)
- Cached in AuthContext + React Query
- Refetched after permission changes (via mutation callbacks)
- Used for client-side UI rendering (not security boundary)

**Why This Approach:**
- ✅ **Security:** httpOnly cookies prevent XSS token theft
- ✅ **Simplicity:** No token storage/refresh logic needed
- ✅ **CSRF Protection:** Built-in with Sanctum
- ✅ **Laravel Native:** Uses Laravel's session system
- ✅ **Mobile-ready:** Can switch to token-based for mobile app

**API Endpoints:**
```
GET  /sanctum/csrf-cookie        # Get CSRF token
POST /{tenant}/login             # Login
POST /{tenant}/logout            # Logout
GET  /{tenant}/api/user          # Get authenticated user
GET  /{tenant}/api/user/permissions # Get user permissions
```

**Error Handling:**
- 401 Unauthorized → Redirect to login (clear auth state)
- 403 Forbidden → Show "no permission" message
- 419 CSRF token mismatch → Refetch CSRF + retry

**Alternative Rejected:**
- ❌ Token-based (localStorage): Vulnerable to XSS attacks
- ❌ Token-based (memory only): Lost on page refresh

---

### Decision 4: Permission-Driven UI Rendering

**Approach:** Client-side permission checks for UI + backend enforcement

**Principle:**
> Frontend permissions are for UX only, not security. Backend policies are the source of truth.

**Implementation Layers:**

**1. Permission Data Structure:**
```typescript
// Laravel sends flat permission array
permissions: [
  'documents.view',
  'documents.create',
  'documents.edit.own',
  'documents.delete.own',
  'users.manage',
  'settings.view'
]

// Frontend can optionally structure these for easier checks
```

**2. Permission Checking (Multiple Methods):**

**Method A: Hook-based (simple checks)**
```typescript
const { can, canAny, canAll } = usePermissions();

if (can('documents.create')) {
  // Show create button
}

if (canAny(['documents.edit.own', 'documents.edit.any'])) {
  // Show edit button
}
```

**Method B: Component-based (declarative)**
```typescript
<Can permission="documents.create">
  <CreateDocumentButton />
</Can>

<CanAny permissions={['documents.edit.own', 'documents.edit.any']}>
  <EditButton />
</CanAny>
```

**Method C: CASL-style (advanced, future)**
```typescript
// For complex abilities (subject + action)
const ability = useAbility();

if (ability.can('edit', document)) {
  // Show edit button (checks ownership, status, etc.)
}
```

**3. Route-Level Protection:**
```typescript
// In route definition (TanStack Router)
beforeLoad: async ({ context }) => {
  const { auth } = context;
  
  if (!auth.user) {
    throw redirect({ to: '/$tenant/login' });
  }
  
  if (!auth.can('users.manage')) {
    throw redirect({ to: '/$tenant/dashboard' });
  }
}
```

**4. Backend Policy Enforcement:**
- Every API call checked by Laravel policies
- Frontend permission checks are optimistic (improve UX)
- If user lacks permission, backend returns 403
- Frontend handles 403 gracefully (toast + disable action)

**Why This Approach:**
- ✅ **Better UX:** Don't show actions user can't perform
- ✅ **Security:** Backend policies are enforced regardless
- ✅ **Flexibility:** Multiple check methods for different use cases
- ✅ **Performance:** Permissions cached, minimal overhead
- ✅ **Maintainability:** Permissions defined in one place (backend)

**Permission Cache Strategy:**
- Loaded once on app init
- Stored in AuthContext + React Query
- TTL: 5 minutes (stale-while-revalidate)
- Invalidated on: logout, permission change (admin panel)

**Handling Permission Changes:**
```
Admin grants permission → Backend updates DB → 
Frontend poll (5min) OR WebSocket push → Refetch permissions → 
UI updates automatically
```

**Alternative Rejected:**
- ❌ No client-side checks: Poor UX (show everything, fail on click)
- ❌ Role-based only: Not granular enough for enterprise

---

### Decision 5: Route Organization with TanStack Router

**Approach:** File-based routing with route groups and lazy loading

**Route Structure Philosophy:**
```
/{tenant}/           # Root tenant route
├─ login            # Auth route (no auth required)
├─ register
├─ dashboard        # Protected route (auth required)
├─ documents/       # Protected + permission-gated
│  ├─ list
│  ├─ create
│  └─ [id]/
│     ├─ view
│     └─ edit
```

**File Organization Pattern:**
```
routes/
├── __root.tsx                    # Root layout + error boundary
├── _public/                      # Public route group (layout: landing)
│   └── index.tsx                 # Landing page (no tenant)
├── _auth/                        # Auth route group (layout: centered form)
│   └── $tenant/
│       ├── login.tsx
│       └── register.tsx
└── _app/                         # Protected routes (layout: sidebar + nav)
    └── $tenant/
        ├── dashboard/
        ├── documents/
        └── settings/
```

**Route Group Benefits:**
1. **Shared Layouts:** `_app` group shares AppLayout with sidebar
2. **Shared Loaders:** Preload tenant/auth data at group level
3. **Shared Guards:** Auth guards applied to entire group
4. **Code Splitting:** Each group is separate bundle

**Route Definition Example:**
```typescript
// routes/_app/$tenant/documents/index.tsx
export const Route = createFileRoute('/_app/$tenant/documents/')({
  // Preload data before rendering
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { tenant } = params;
    
    // Prefetch documents list
    await queryClient.ensureQueryData(
      documentsQueries.list(tenant)
    );
  },
  
  // Route-level guard
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    if (!auth.can('documents.view')) {
      throw redirect({ to: '/$tenant/dashboard' });
    }
  },
  
  // Lazy load component
  component: lazyRouteComponent(() => 
    import('@/features/documents/routes/DocumentsListPage')
  ),
  
  // Error boundary
  errorComponent: DocumentsErrorFallback,
  
  // Pending component
  pendingComponent: DocumentsListSkeleton,
});
```

**Tenant Parameter Handling:**
```typescript
// Tenant is always available in route params
const { tenant } = Route.useParams();

// Or via hook
const { tenantId } = useTenant();
```

**Navigation Utilities:**
```typescript
// Tenant-aware navigation helper
const navigate = useNavigate();

// Automatically includes current tenant
navigate({ to: '/documents/$documentId', params: { documentId: '123' } });
// Resolves to: /{currentTenant}/documents/123
```

**Search Params + Filters:**
```typescript
// Type-safe search params
export const Route = createFileRoute('/_app/$tenant/documents/')({
  validateSearch: (search) => 
    z.object({
      page: z.number().default(1),
      q: z.string().optional(),
      status: z.enum(['active', 'archived']).optional(),
    }).parse(search),
});

// Usage in component
const { page, q, status } = Route.useSearch();
```

**Lazy Loading Strategy:**
```typescript
// Route component
component: lazyRouteComponent(() => 
  import('@/features/documents/routes/DocumentsPage')
),

// Feature routes are code-split automatically
// Bundle: documents.{hash}.js loaded only when route accessed
```

**Why This Approach:**
- ✅ **Type Safety:** Route params + search params fully typed
- ✅ **Colocation:** Route logic near route definition
- ✅ **Performance:** Automatic code splitting per route
- ✅ **Preloading:** Data loads before component renders (no flash)
- ✅ **DX:** File system matches URL structure

**Alternative Rejected:**
- ❌ React Router: Less type-safe, manual code splitting
- ❌ Next.js: Overkill for SPA, SEO not needed (tenant portal)

---

### Decision 6: State Management Strategy

**Approach:** Server state (TanStack Query) + Local UI state (React hooks/context)

**Principle:**
> Don't duplicate server data in global state. Use TanStack Query as the single source of truth for server data.

**State Categories:**

**1. Server State (TanStack Query)**
- **What:** Data from API (documents, users, settings)
- **Storage:** TanStack Query cache
- **Access:** `useQuery`, `useMutation` hooks
- **Examples:**
  - Document list
  - User profile
  - Workspace settings
  - Audit logs

**2. Auth State (React Context)**
- **What:** Current user + permissions
- **Storage:** AuthContext + TanStack Query
- **Access:** `useAuth()` hook
- **Why Context:** Needs to be globally accessible + sync with TanStack Query

**3. Tenant State (React Context)**
- **What:** Current tenant metadata
- **Storage:** TenantContext + TanStack Query
- **Access:** `useTenant()` hook
- **Why Context:** Derived from URL params + validation

**4. UI State (Component State or Context)**
- **What:** Modal open/close, sidebar collapsed, selected items
- **Storage:** Component `useState` or closest parent context
- **Access:** Props or nearest context
- **Examples:**
  - Modal visibility
  - Drawer open state
  - Selected table rows
  - Form draft data
  - Sidebar expanded/collapsed

**5. Form State (React Hook Form)**
- **What:** Form inputs, validation, submission
- **Storage:** React Hook Form internal state
- **Access:** `useForm()` hook
- **Why:** Optimized for forms (less re-renders)

**When to Use Global Context:**
```
Use Context when:
- Data needed by many disconnected components
- Data changes infrequently
- Performance isn't critical

Examples:
- Theme preference
- Locale/language
- Feature flags
```

**When to Use TanStack Query:**
```
Use TanStack Query when:
- Data comes from API
- Data should be cached
- Data may be stale
- Multiple components need same data

Examples:
- All CRUD operations
- User profiles
- Settings
- Lists/collections
```

**When to Use Component State:**
```
Use useState when:
- Data is local to component tree
- Data doesn't need to persist
- Simple UI interactions

Examples:
- Modal visibility
- Accordion open/close
- Hover states
- Search input value (before debounce)
```

**State Update Patterns:**

**Optimistic Updates (TanStack Query):**
```typescript
// When editing document
useMutation({
  mutationFn: updateDocument,
  onMutate: async (newData) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries(['documents', id]);
    
    // Snapshot current data
    const previous = queryClient.getQueryData(['documents', id]);
    
    // Optimistically update
    queryClient.setQueryData(['documents', id], newData);
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['documents', id], context.previous);
  },
  onSettled: () => {
    // Refetch to sync with server
    queryClient.invalidateQueries(['documents', id]);
  },
});
```

**Why This Approach:**
- ✅ **Simplicity:** No Redux/MobX complexity
- ✅ **Performance:** Automatic caching + deduplication
- ✅ **DX:** Less boilerplate, easier to reason about
- ✅ **Type Safety:** Full TypeScript support
- ✅ **Testing:** Easier to mock (just mock API)

**Alternative Rejected:**
- ❌ Redux: Overkill, too much boilerplate
- ❌ Zustand: Still duplicates server data in store
- ❌ Jotai/Recoil: Unnecessary for this use case

---

### Decision 7: Error Boundary and Loading Patterns

**Approach:** Multi-level error boundaries + skeleton loading states

**Error Boundary Strategy:**

**Level 1: Root Error Boundary (Global)**
```typescript
// Catches uncaught errors anywhere in app
<ErrorBoundary fallback={<GlobalErrorPage />}>
  <App />
</ErrorBoundary>

// Shows: Full-page error with "Reload App" button
// Logs: Error to monitoring service (Sentry)
```

**Level 2: Route Error Boundaries**
```typescript
// Catches errors in route loaders + components
export const Route = createFileRoute('/_app/$tenant/documents/')({
  errorComponent: DocumentsErrorFallback,
});

// Shows: Error within app layout (keeps sidebar/nav)
// Allows: User to navigate away without full reload
```

**Level 3: Component Error Boundaries**
```typescript
// Catches errors in specific feature components
<ErrorBoundary fallback={<DocumentListError />}>
  <DocumentList />
</ErrorBoundary>

// Shows: Error in component area only
// Preserves: Rest of page remains functional
```

**Level 4: Query Error Handling (TanStack Query)**
```typescript
// Per-query error handling
const { data, error, isError } = useQuery({
  queryKey: ['documents'],
  queryFn: fetchDocuments,
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <DocumentListError error={error} />;
}
```

**Error Classification:**

```typescript
// Error types with different handling
type AppError =
  | { type: 'network'; message: string; retryable: true }
  | { type: 'validation'; errors: Record<string, string[]> }
  | { type: 'auth'; code: 401 | 403; redirect: string }
  | { type: 'notFound'; resource: string }
  | { type: 'server'; message: string; statusCode: 500 }
  | { type: 'tenant'; message: 'invalid_tenant' | 'tenant_suspended' }
  | { type: 'unknown'; originalError: Error };

// Error handler transforms backend errors
function transformError(error: AxiosError): AppError {
  if (error.response?.status === 401) {
    return { type: 'auth', code: 401, redirect: '/login' };
  }
  // ... other transformations
}
```

**Loading State Patterns:**

**Pattern 1: Skeleton Loaders (Preferred)**
```typescript
// Shows placeholder that matches final UI structure
{isLoading && <DocumentListSkeleton />}
{data && <DocumentList data={data} />}

// Benefits:
// - Reduces perceived loading time
// - Prevents layout shift
// - Better UX than spinners
```

**Pattern 2: Suspense + Streaming (Future)**
```typescript
// Using React 18+ Suspense
<Suspense fallback={<DocumentListSkeleton />}>
  <DocumentList />
</Suspense>

// Note: TanStack Query + TanStack Router support Suspense
```

**Pattern 3: Route-Level Loading**
```typescript
// TanStack Router shows loading state during navigation
export const Route = createFileRoute('/_app/$tenant/documents/')({
  pendingComponent: DocumentsPageSkeleton,
});
```

**Pattern 4: Mutation Loading States**
```typescript
// Button shows loading state during mutation
const { mutate, isPending } = useMutation({
  mutationFn: createDocument,
});

<Button
  onClick={() => mutate(data)}
  disabled={isPending}
>
  {isPending ? 'Creating...' : 'Create Document'}
</Button>
```

**Global Loading Indicator:**
```typescript
// Show progress bar for route transitions
<Router>
  <NavigationProgress /> {/* Shows at top of page */}
</Router>
```

**Why This Approach:**
- ✅ **Resilience:** Errors contained to smallest scope
- ✅ **UX:** Graceful degradation (rest of app works)
- ✅ **Feedback:** Users always know what's happening
- ✅ **Performance:** Skeletons perceived faster than spinners
- ✅ **Monitoring:** Errors logged at appropriate level

**Error Recovery Actions:**

```typescript
// User options on error
- Retry button (re-trigger query)
- Go back (navigate to previous page)
- Reload app (hard refresh)
- Contact support (with error ID)
```

**Alternative Rejected:**
- ❌ Single global error boundary: Crashes entire app
- ❌ No error boundaries: White screen of death
- ❌ Alert/modal for all errors: Intrusive UX

---

### Decision 8: Type Safety Approach

**Approach:** End-to-end type safety from API to UI

**Type Generation Strategy:**

**Backend → Frontend Types:**
```
Laravel API → OpenAPI spec → TypeScript types (codegen)

Tools:
- openapi-typescript
- laravel-data (PHP side for structured responses)
```

**Why Not Manual Types:**
- ❌ Drift between backend and frontend
- ❌ Manual updates error-prone
- ❌ Doesn't scale with API growth

**Type Organization:**

**1. Generated API Types (`src/types/generated/`)**
```typescript
// Auto-generated from OpenAPI spec
// DO NOT EDIT MANUALLY

export interface Document {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  owner: User;
  permissions: DocumentPermissions;
}

export interface DocumentPermissions {
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
}
```

**2. Domain Types (`src/shared/types/` + `src/features/*/types/`)**
```typescript
// Frontend-specific types that extend or transform API types

// Transform API date strings to Date objects
export type DocumentWithDates = Omit<Document, 'created_at' | 'updated_at'> & {
  created_at: Date;
  updated_at: Date;
};

// Form data types (before sending to API)
export type CreateDocumentInput = Pick<Document, 'title' | 'content'> & {
  workspace_id: string;
  tags?: string[];
};
```

**3. Component Prop Types**
```typescript
// Explicit prop types (never use 'any')
interface DocumentListProps {
  documents: Document[];
  onSelect: (document: Document) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// Use discriminated unions for variant props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}
```

**Type-Safe API Client:**

```typescript
// Service functions fully typed
async function getDocument(id: string): Promise<Document> {
  const response = await apiClient.get<Document>(`/documents/${id}`);
  return response.data;
}

// Query hooks fully typed
function useDocument(id: string) {
  return useQuery({
    queryKey: ['documents', id] as const,
    queryFn: () => getDocument(id),
  });
}

// Component receives typed data
function DocumentDetail() {
  const { id } = Route.useParams();
  const { data: document, isLoading } = useDocument(id);
  
  // 'document' is type Document | undefined
  // TypeScript ensures null checks before access
}
```

**Type-Safe Routing:**

```typescript
// TanStack Router provides type-safe params
export const Route = createFileRoute('/_app/$tenant/documents/$documentId')({
  // params automatically typed
  loader: async ({ params }) => {
    const { tenant, documentId } = params; // both strings
  },
});

// Type-safe navigation
navigate({
  to: '/documents/$documentId',
  params: { documentId: '123' }, // TypeScript error if wrong param name
});
```

**Type-Safe Forms (React Hook Form + Zod):**

```typescript
// Define schema with Zod
const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title required').max(255),
  content: z.string().min(1, 'Content required'),
  workspace_id: z.string().uuid(),
  tags: z.array(z.string()).optional(),
});

// Infer TypeScript type from schema
type CreateDocumentForm = z.infer<typeof createDocumentSchema>;

// Form is fully typed
const form = useForm<CreateDocumentForm>({
  resolver: zodResolver(createDocumentSchema),
});

// Submission handler is typed
const onSubmit = (data: CreateDocumentForm) => {
  createDocumentMutation.mutate(data); // Type-safe
};
```

**Type Guards:**

```typescript
// Runtime type checking when needed
function isDocument(value: unknown): value is Document {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  );
}

// Usage
if (isDocument(data)) {
  // TypeScript knows 'data' is Document here
  console.log(data.title);
}
```

**Utility Types:**

```typescript
// Common utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

// API response wrapper
type ApiResponse<T> = {
  data: T;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

// Pagination helper
type Paginated<T> = {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
```

**Strict TypeScript Config:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Why This Approach:**
- ✅ **Catch Errors Early:** TypeScript errors at compile time
- ✅ **Self-Documenting:** Types serve as documentation
- ✅ **IDE Support:** Autocomplete, refactoring, jump-to-definition
- ✅ **Refactor Confidence:** Breaking changes caught immediately
- ✅ **API Contract:** Generated types enforce backend contract

**Type Safety Checklist:**
- ☑ No `any` types (use `unknown` if truly unknown)
- ☑ All API responses typed
- ☑ All component props typed
- ☑ All route params typed
- ☑ All form data typed
- ☑ Enable strict mode in tsconfig.json

**Alternative Rejected:**
- ❌ JavaScript: No type safety
- ❌ Manual type maintenance: Prone to drift
- ❌ Loose TypeScript config: Doesn't catch errors

---

## 5. RISKS & SCALABILITY CONSIDERATIONS

### Risk 1: Tenant Cache Leakage

**Problem:** User switches tenants, sees cached data from previous tenant

**Mitigation:**
1. **Tenant-scoped cache keys:** All queries prefixed with tenant ID
2. **Cache invalidation on tenant switch:** Clear all queries when tenant changes
3. **Query key factory pattern:** Enforce consistent key structure
4. **Unit tests:** Test cache isolation between tenants

**Implementation:**
```typescript
// Query key factory enforces tenant scope
const queryKeys = {
  documents: {
    all: (tenantId: string) => [tenantId, 'documents'] as const,
    list: (tenantId: string, filters: Filters) => 
      [...queryKeys.documents.all(tenantId), 'list', filters] as const,
    detail: (tenantId: string, id: string) => 
      [...queryKeys.documents.all(tenantId), 'detail', id] as const,
  },
};

// On tenant switch
queryClient.cancelQueries();
queryClient.clear();
```

**Remaining Risk:** Low (mitigated with code patterns)

---

### Risk 2: Permission Stale Data

**Problem:** Admin changes user permissions, user still sees old permissions

**Mitigation:**
1. **Permission TTL:** Cache permissions for 5 minutes max
2. **Stale-while-revalidate:** Show old permissions while fetching new
3. **WebSocket push (future):** Real-time permission updates
4. **Backend enforcement:** All API calls checked regardless

**Implementation:**
```typescript
// Permission query with revalidation
const { data: permissions } = useQuery({
  queryKey: ['permissions'],
  queryFn: fetchPermissions,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});
```

**Remaining Risk:** Medium (5-minute delay acceptable for UX, backend enforces)

---

### Risk 3: Bundle Size Growth

**Problem:** As features grow, initial bundle becomes too large

**Mitigation:**
1. **Route-based code splitting:** Each route is separate chunk
2. **Lazy import feature modules:** Features loaded on-demand
3. **Component lazy loading:** Heavy components (editors, charts) loaded when needed
4. **Bundle analysis:** Regular audits with webpack-bundle-analyzer
5. **Tree shaking:** Remove unused code (ensure imports are ESM)

**Implementation:**
```typescript
// Route-level splitting
component: lazyRouteComponent(() => 
  import('@/features/documents/routes/DocumentsPage')
),

// Component-level splitting
const DocumentEditor = lazy(() => 
  import('@/features/documents/components/DocumentEditor')
);

// Target: < 200KB initial bundle (gzipped)
```

**Monitoring:**
- Measure bundle size in CI/CD
- Alert if initial bundle > 250KB gzipped
- Use dynamic imports for non-critical features

**Remaining Risk:** Low (mitigated with lazy loading + monitoring)

---

### Risk 4: API Response Time → UI Slowness

**Problem:** Slow backend responses cause poor UX

**Mitigation:**
1. **Optimistic updates:** Show changes immediately, rollback on error
2. **Skeleton loaders:** Reduce perceived loading time
3. **Prefetching:** Load data before user navigates (route loaders)
4. **Infinite scroll/pagination:** Don't load all data at once
5. **Debounced search:** Reduce API calls on user input
6. **Request deduplication:** TanStack Query prevents duplicate requests

**Implementation:**
```typescript
// Prefetch next page on hover
const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: ['documents', 'list', { page: currentPage + 1 }],
    queryFn: () => fetchDocuments({ page: currentPage + 1 }),
  });
};

// Debounced search
const debouncedSearch = useDebounce(searchQuery, 500);
useQuery({
  queryKey: ['documents', 'search', debouncedSearch],
  queryFn: () => searchDocuments(debouncedSearch),
  enabled: debouncedSearch.length > 0,
});
```

**Remaining Risk:** Medium (dependent on backend performance)

---

### Risk 5: Memory Leaks (React Query Cache)

**Problem:** Unused cache data accumulates in memory

**Mitigation:**
1. **Cache time limits:** Old data garbage collected after 5 minutes
2. **Query invalidation:** Remove stale data explicitly
3. **Cache size monitoring:** Alert if cache exceeds threshold
4. **Selective prefetching:** Only prefetch likely-needed data

**Implementation:**
```typescript
// Query client config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 60 * 1000, // 1 minute
      refetchOnMount: 'always',
    },
  },
});

// Manual cleanup on component unmount
useEffect(() => {
  return () => {
    queryClient.removeQueries(['temp-data']);
  };
}, []);
```

**Remaining Risk:** Low (React Query handles this well)

---

### Risk 6: CSRF Token Expiration

**Problem:** Long-running session, CSRF token expires, subsequent requests fail

**Mitigation:**
1. **Token refresh on 419:** Retry request after refetching CSRF token
2. **Periodic token refresh:** Refresh every 30 minutes in background
3. **Error handling:** Graceful fallback (prompt re-login if needed)

**Implementation:**
```typescript
// Axios interceptor handles 419
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 419) {
      // Refresh CSRF token
      await sanctumService.getCsrfToken();
      
      // Retry original request
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Remaining Risk:** Low (handled automatically)

---

### Risk 7: Mobile Responsiveness Edge Cases

**Problem:** Complex tables/layouts break on mobile

**Mitigation:**
1. **Mobile-first design:** Start with mobile, enhance for desktop
2. **Responsive components:** shadcn/ui components are responsive
3. **Mobile-specific views:** Alternative layouts for small screens
4. **Regular testing:** Test on actual devices, not just DevTools

**Implementation:**
```typescript
// Responsive table (stack on mobile)
const isMobile = useMediaQuery('(max-width: 768px)');

return isMobile ? (
  <DocumentCardList documents={documents} />
) : (
  <DocumentTable documents={documents} />
);
```

**Remaining Risk:** Medium (requires ongoing testing)

---

### Risk 8: Type Safety Drift (API Changes)

**Problem:** Backend changes API, frontend types become stale

**Mitigation:**
1. **Automated type generation:** OpenAPI spec → TypeScript types
2. **CI/CD integration:** Type generation in build pipeline
3. **Contract testing:** Test API responses match types
4. **Version control:** Types committed, changes reviewed

**Implementation:**
```bash
# CI/CD pipeline
1. Backend generates OpenAPI spec
2. Frontend downloads spec
3. Generate TypeScript types
4. Run type check (fails if types changed)
5. Commit updated types (requires PR)
```

**Remaining Risk:** Low (with CI/CD automation)

---

### Scalability Consideration 1: Team Growth

**Challenge:** Multiple developers working on same codebase

**Architecture Support:**
- ✅ **Feature modules:** Teams can own features independently
- ✅ **Clear boundaries:** Core/shared/features separation
- ✅ **Type safety:** Prevents breaking changes
- ✅ **Code ownership:** CODEOWNERS file per feature
- ✅ **Parallel work:** Low coupling enables parallel development

**Recommendations:**
- Assign teams to features (not layers)
- Use feature flags for incomplete features
- Establish code review process per team
- Document cross-feature dependencies

---

### Scalability Consideration 2: Feature Growth

**Challenge:** Adding 50+ features over time

**Architecture Support:**
- ✅ **Lazy loading:** New features don't increase initial bundle
- ✅ **Consistent patterns:** New features follow same structure
- ✅ **Code splitting:** Each feature is separate chunk
- ✅ **Shared utilities:** DRY code across features

**Recommendations:**
- Audit bundle size quarterly
- Extract common patterns to shared/
- Use feature flags to toggle features
- Consider micro-frontend architecture if > 100 features

---

### Scalability Consideration 3: Internationalization (i18n)

**Future Need:** Support multiple languages

**Architecture Readiness:**
- ✅ **Text extraction:** All text in components (not hardcoded)
- ✅ **Lazy loading:** Load translations per route
- ✅ **Type safety:** Typed translation keys

**Migration Path:**
```typescript
// Add i18n library (react-i18next)
// Wrap text in translation function
<h1>{t('documents.title')}</h1>

// Load translations per route
loader: async () => {
  await i18n.loadNamespaces('documents');
}
```

**Effort:** Medium (with current architecture, straightforward to add)

---

### Scalability Consideration 4: Real-Time Features

**Future Need:** WebSocket-based real-time updates (collaborative editing, notifications)

**Architecture Readiness:**
- ✅ **TanStack Query:** Can be updated from external sources
- ✅ **Event-driven:** Components react to data changes
- ⚠️ **WebSocket layer:** Not yet designed

**Migration Path:**
```typescript
// Add WebSocket service (core/websockets/)
// Subscribe to channels per feature
useEffect(() => {
  const channel = websocketService.subscribe(`tenant.${tenantId}.documents`);
  
  channel.on('document.updated', (data) => {
    queryClient.setQueryData(['documents', data.id], data);
  });
  
  return () => channel.unsubscribe();
}, [tenantId]);
```

**Effort:** Medium (requires new WebSocket layer + Laravel Echo integration)

---

### Scalability Consideration 5: Analytics & Monitoring

**Future Need:** Track user behavior, performance metrics

**Architecture Readiness:**
- ✅ **Error tracking:** Error boundaries log to console (ready for Sentry)
- ✅ **API logging:** Interceptors can log requests
- ⚠️ **User tracking:** Not yet designed

**Migration Path:**
```typescript
// Add analytics service (core/analytics/)
// Track page views
useEffect(() => {
  analytics.pageView(location.pathname);
}, [location]);

// Track user actions
const handleDocumentCreate = () => {
  analytics.track('document.created', { documentId });
  createDocument();
};
```

**Tools:**
- Sentry (error tracking)
- PostHog or Mixpanel (product analytics)
- Web Vitals (performance metrics)

**Effort:** Low (add analytics service + integrate)

---

### Scalability Consideration 6: Offline Support

**Future Need:** App works offline (PWA)

**Architecture Readiness:**
- ⚠️ **Service Worker:** Not yet designed
- ⚠️ **Offline storage:** TanStack Query doesn't persist by default
- ✅ **Optimistic updates:** Already support offline-first UX pattern

**Migration Path:**
```typescript
// Add service worker (vite-plugin-pwa)
// Persist TanStack Query cache (persistQueryClient)
// Handle offline state
const isOnline = useOnlineStatus();

if (!isOnline) {
  return <OfflineBanner />;
}
```

**Effort:** High (requires significant architecture changes)

---

### Performance Optimization Opportunities

**1. Image Optimization**
- Use next-gen formats (WebP, AVIF)
- Lazy load images (IntersectionObserver)
- CDN for static assets
- Responsive images (srcset)

**2. Code Splitting Granularity**
- Split large feature modules into sub-features
- Lazy load heavy dependencies (chart libraries, PDF viewers)
- Use dynamic imports strategically

**3. API Optimization**
- Request batching (GraphQL-style)
- Response compression (gzip/brotli)
- HTTP/2 multiplexing
- CDN caching for public data

**4. Rendering Optimization**
- Virtual scrolling for large lists (react-virtual)
- Memoization (React.memo, useMemo)
- Debounce expensive computations
- Web Workers for heavy processing

**5. Caching Strategy**
- Aggressive stale-while-revalidate
- Prefetch predictable navigation
- Service Worker for repeated requests
- LocalStorage for user preferences

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- ✅ Vite + React + TypeScript setup
- ☐ TanStack Router configuration
- ☐ TanStack Query setup
- ☐ Tailwind + shadcn/ui integration
- ☐ Core API client + interceptors
- ☐ Tenant context provider + validation
- ☐ Auth context provider + Sanctum integration
- ☐ Route structure + guards
- ☐ Error boundaries + loading patterns

### Phase 2: First Feature (Week 3)
- ☐ Documents feature (full vertical slice)
  - List, view, create, edit, delete
  - API layer (service + queries)
  - Components + hooks
  - Routes + guards
- ☐ Permission-based UI rendering
- ☐ Form handling (React Hook Form + Zod)
- ☐ File upload implementation

### Phase 3: Core Features (Week 4-6)
- ☐ Workspaces feature
- ☐ Users feature
- ☐ Teams feature
- ☐ Settings feature
- ☐ Dashboard (overview)

### Phase 4: Polish & Optimization (Week 7-8)
- ☐ Performance audit
- ☐ Bundle size optimization
- ☐ Error handling refinement
- ☐ Loading state improvements
- ☐ Accessibility audit
- ☐ Mobile responsiveness testing
- ☐ Type safety validation
- ☐ Unit + integration tests

### Phase 5: Production Readiness (Week 9-10)
- ☐ CI/CD pipeline setup
- ☐ Monitoring integration (Sentry)
- ☐ Analytics integration
- ☐ Documentation
- ☐ Deployment scripts
- ☐ Performance monitoring
- ☐ Security audit

---

## DEVELOPER EXPERIENCE (DX) CONSIDERATIONS

### IDE Setup
- VS Code extensions: ESLint, Prettier, TypeScript, Tailwind CSS IntelliSense
- Shared configurations (committed to repo)
- Auto-format on save

### Development Scripts
```bash
bun run dev              # Start dev server
bun run build            # Production build
bun run preview          # Preview production build
bun run type-check       # TypeScript validation
bun run lint             # ESLint check
bun run format           # Prettier format
bun run test             # Run tests
bun run test:ui          # Vitest UI
```

### Code Generation
```bash
bun run generate:feature # Scaffold new feature module
bun run generate:api     # Generate API types from OpenAPI
bun run generate:component # Create new component with template
```

### Documentation
- Architecture decision records (ADRs)
- Feature module READMEs
- Component Storybook (future)
- API documentation (automated from types)

---

## CONCLUSION

This architecture is designed for:
- ✅ **Scale:** Handle 100+ features, 50+ developers
- ✅ **Maintainability:** Clear boundaries, consistent patterns
- ✅ **Performance:** Code splitting, lazy loading, caching
- ✅ **Type Safety:** End-to-end TypeScript, generated API types
- ✅ **Security:** Sanctum integration, CSRF protection, httpOnly cookies
- ✅ **Developer Experience:** Clear structure, reusable code, powerful tools
- ✅ **Enterprise-Ready:** Multi-tenancy, permissions, audit trail support

**Key Principles:**
1. **Separation of Concerns:** Core/Features/Shared boundaries
2. **Type Safety First:** Never compromise on types
3. **Performance by Default:** Lazy loading, code splitting, caching
4. **Developer Productivity:** Consistent patterns, powerful abstractions
5. **Maintainability:** Clear ownership, testable code, documented decisions

**Next Steps:**
1. Review and approve this architecture
2. Set up development environment
3. Implement Phase 1 (Foundation)
4. Build first feature (Documents) as reference implementation
5. Iterate based on learnings

---

**Document Version:** 1.0  
**Last Updated:** February 11, 2026  
**Author:** Senior Frontend Architect  
**Status:** Ready for Implementation
