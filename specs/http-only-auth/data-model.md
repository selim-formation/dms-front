# Data Model: HTTP-Only Cookie Authentication State

## Authentication State Structure

### AuthContext Value

```typescript
interface AuthContextValue {
  // User Data
  user: User | null;              // Currently authenticated user or null
  permissions: PermissionString[]; // Array of user's permissions

  // Auth Status
  isAuthenticated: boolean;        // true if user is loaded (derived: !!user)
  isLoading: boolean;              // true while AuthProvider validates cookie

  // Auth Actions
  login: (credentials) => Promise<void>;      // Submit login credentials
  logout: () => Promise<void>;                // Clear auth and invalidate cookie
  register: (data) => Promise<void>;          // Register new user
  refetchUser: () => Promise<void>;           // Re-validate cookie and load user

  // Permission Checks
  can: (permission) => boolean;               // Check single permission
  canAny: (permissions) => boolean;           // Check if user has any permission
  canAll: (permissions) => boolean;           // Check if user has all permissions
}
```

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  telephoneNumber?: string;
  department?: string;
  role: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  lastLoginAt?: DateTime;
}
```

### Authentication Flow State

```
State 1: App Startup
├─ AuthProvider mounts
├─ isLoading = true
├─ user = null
└─ isAuthenticated = false

State 2: Cookie Validation
├─ AuthProvider calls getUser() API
├─ Browser sends HTTP-only cookie automatically
├─ isLoading = true (still validating)
└─ Waiting for backend response

State 3a: Valid Cookie → User Authenticated ✅
├─ Backend returns user data + permissions
├─ user = { id, email, name, ... }
├─ permissions = ["read:tasks", "create:tasks", ...]
├─ isLoading = false
├─ isAuthenticated = true
└─ Route guards allow navigation

State 3b: Invalid/Missing Cookie → User Not Authenticated
├─ Backend returns 401 Unauthorized
├─ user = null
├─ permissions = []
├─ isLoading = false
├─ isAuthenticated = false
└─ Route guards redirect to /login

State 4: User Action → Logout
├─ User clicks logout
├─ Frontend calls /logout API
├─ Backend invalidates cookie
├─ user = null
├─ permissions = []
├─ isAuthenticated = false
└─ Redirect to /login
```

## HTTP-Only Cookie Structure

### Cookie Headers

```
Response Header (Server → Browser):
Set-Cookie: id_token=xyz789...abc; 
  Path=/; 
  Domain=.example.com;
  HttpOnly;           ← JavaScript cannot access
  Secure;             ← Only transmitted over HTTPS
  SameSite=Strict;    ← Prevents CSRF attacks
  Max-Age=86400;      ← Expires in 24 hours

Request Header (Browser → Server):
Cookie: id_token=xyz789...abc
        ↕ (Sent automatically by browser)

Browser Storage:
Application tab → Cookies → domain.com → id_token
  Name: id_token
  Value: xyz789...abc
  Domain: .example.com
  Path: /
  Expires: [date]
  HttpOnly: ✓ (JavaScript cannot read)
  Secure: ✓ (HTTPS only)
  SameSite: Strict
```

## CSRF Token Structure

### CSRF Token Flow

```
Request 1: GET /api/csrf
├─ Backend generates unique CSRF token
├─ Response includes token in header: X-CSRF-TOKEN
└─ Frontend stores in memory (not localStorage)

Request 2: POST /api/tasks
├─ Frontend includes: X-CSRF-TOKEN header with value
├─ Browser includes: Cookie header with authentication cookie (automatic)
├─ Backend validates:
│  ├─ Verify CSRF token matches (prevents CSRF attacks)
│  ├─ Verify cookie is valid (prevents unauthenticated access)
│  └─ Verify SameSite policy (additional CSRF protection)
└─ Backend processes request if all validations pass

CSRF Token Storage:
- Stored in React memory (not localStorage) → Cannot be accessed by XSS
- Regenerated on app restart → Limits CSRF attack window
- Included in every unsafe method request (POST, PUT, DELETE, PATCH)
```

## API Request/Response Cycle

### Request With Cookie + CSRF

```javascript
// Frontend Code (happens automatically)
fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': 'abc123xyz789...',  // Frontend adds
  },
  credentials: 'include',  // Tells browser to include cookies (automatic)
  body: JSON.stringify({ title: 'New Task' })
})

// What Actually Gets Sent (HTTP):
POST /api/tasks HTTP/1.1
Host: api.example.com
Cookie: id_token=xyz789...abc                    ← Browser adds (HTTP-only)
X-CSRF-TOKEN: abc123xyz789...                    ← Frontend adds
Content-Type: application/json

{"title":"New Task"}

// Backend Receives:
- Cookie: id_token (validated against session store)
- X-CSRF-TOKEN header (validated against token store)
- Credentials in body
- If both validations pass → Process request
- If either fails → Return 401 or 403
```

## State Transitions & Route Guard Logic

### Route Guard Decision Tree

```
User Accesses Protected Route
│
├─ AuthProvider.isLoading === true?
│  ├─ YES → Show LoadingScreen (waiting for cookie validation)
│  └─ NO → Continue
│
├─ AuthProvider.isAuthenticated === false?
│  ├─ YES (no valid cookie) → Redirect to /login
│  └─ NO (valid cookie) → Continue
│
├─ Route requires specific permission?
│  ├─ YES → Check auth.can(permission)
│  │       ├─ YES → Allow access ✅
│  │       └─ NO → Redirect to /dashboard with error
│  └─ NO → Allow access ✅
│
└─ User accesses protected resource
```

### Route Guard Examples

```typescript
// requireAuth Guard
if (auth.isLoading) {
  // Still validating cookie, show loading screen
  return;
}
if (!auth.isAuthenticated) {
  // No valid cookie found
  redirect('/login');
}
// Valid cookie exists, allow access

// requirePermission Guard
await requireAuth(context);  // First check cookie auth
const has = auth.can('write:tasks');
if (!has) {
  // Valid cookie but insufficient permissions
  redirect('/dashboard?error=insufficient_permissions');
}
// Valid cookie and correct permissions, allow access
```

## Tenant-Aware Cookie Validation

### Multi-Tenant State

```
Tenant Context:
├─ tenantId: string (selected tenant)
├─ isValid: boolean (tenant exists and is active)
└─ current: Tenant | null

Authentication Flow with Tenants:
State 1: User logs in to tenant A
├─ Cookie set
├─ Load user data for tenant A
├─ Set tenantId = A
└─ isAuthenticated = true

State 2: User switches to tenant B
├─ Cookie remains the same (backend validates)
├─ Set tenantId = B
├─ Re-validate cookie for tenant B
├─ Load user data for tenant B
└─ isAuthenticated = true (if valid for tenant B)

State 3: Cookie invalid for current tenant
├─ Backend returns 401
├─ user = null
├─ isAuthenticated = false
├─ Redirect to /login
└─ User must login again
```

## Session Management

### Session Lifecycle

```
Timeline:
T0: User logs in
├─ POST /login with email/password
├─ Backend creates session
├─ Backend returns Set-Cookie with id_token
└─ Browser stores cookie (HTTP-only, auto-sent)

T1: User navigates in app
├─ All API requests include cookie
├─ Backend validates cookie
├─ Backend allows requests
└─ User can access resources

T2: Session expires (e.g., 24 hours later)
├─ Backend considers cookie expired
├─ Next API request returns 401
├─ Frontend clears auth state
├─ User redirected to /login
└─ User must login again

T3: User clicks logout button
├─ Frontend calls POST /logout
├─ Backend invalidates session
├─ Backend may send Set-Cookie with empty value
├─ Browser deletes cookie
├─ Frontend clears auth state
└─ User redirected to /login
```

## Permission Model

### Permission Strings

```typescript
type PermissionString =
  // Task Permissions
  | 'read:tasks'
  | 'create:tasks'
  | 'update:tasks'
  | 'delete:tasks'
  
  // Document Permissions
  | 'read:documents'
  | 'create:documents'
  | 'update:documents'
  | 'delete:documents'
  
  // Team Permissions
  | 'read:teams'
  | 'create:teams'
  | 'update:teams'
  | 'delete:teams'
  | 'manage:team-members'
  
  // Workspace Permissions
  | 'read:workspaces'
  | 'create:workspaces'
  | 'update:workspaces'
  | 'delete:workspaces'
  | 'manage:workspace-members'
  
  // Admin Permissions
  | 'admin:users'
  | 'admin:settings'
  | 'admin:roles';
```

### Permission Check Methods

```typescript
// Single permission
if (auth.can('create:tasks')) {
  // User has this permission
}

// Any permission (OR logic)
if (auth.canAny(['delete:tasks', 'admin:tasks'])) {
  // User has at least one of these permissions
}

// All permissions (AND logic)
if (auth.canAll(['read:tasks', 'update:tasks', 'create:tasks'])) {
  // User has all of these permissions
}
```

## Error States

### Common Error Scenarios

| Scenario | State | User Experience |
|----------|-------|-----------------|
| Invalid credentials (login) | isLoading = false, user = null | "Invalid email or password" message |
| Network error | isLoading = false, user = null | "Network error, please retry" message |
| Expired cookie | isLoading = false, user = null | Redirect to /login |
| Missing permissions | isLoading = false, user = { ... }, permissions = [] | Redirect to /dashboard with error |
| API rate limited | isLoading = false, user = { ... } | "Too many requests, please wait" |
| Session timeout | isLoading = false, user = null | Redirect to /login |

### Error Recovery

```
Error Occurs (e.g., API returns 401)
│
├─ AuthProvider catches error
├─ Sets user = null
├─ Sets permissions = []
├─ Sets isAuthenticated = false
├─ Emits onUnauthorized callback
└─ Route guards detect unauthenticated
   └─ Redirect to /login
      └─ User can login again
```

## Cache & Invalidation

### TanStack Query Cache Keys

```typescript
// Task cache (when user is authenticated)
queryKey: ['tasks']

// User cache
queryKey: ['currentUser', tenantId]

// Permissions cache
queryKey: ['userPermissions', tenantId]

// On logout:
// ✗ Clear all cache
queryClient.invalidateQueries()
// ✗ Clear specific:
queryClient.invalidateQueries({ queryKey: ['tasks'] })
```

## Debugging State

### Console Logging

```typescript
// In AuthProvider with DEBUG flag
if (DEBUG) {
  console.log('[Auth] Cookie validation started');
  console.log('[Auth] isLoading:', auth.isLoading);
  console.log('[Auth] User loaded:', auth.user);
  console.log('[Auth] Permissions:', auth.permissions);
  console.log('[Auth] isAuthenticated:', auth.isAuthenticated);
}

// In DevTools
// Network tab: Shows Cookie header in requests
// Application tab: Cookies section shows id_token
// Console: [Auth] logs show state transitions
```
