# API Specification: Tasks Feature

**Feature**: 001-tasks-page-design  
**Date**: 2026-02-26  
**Version**: 1.0.0 (MVP)

## Overview

This document specifies the API contract for the Tasks feature. Currently implemented with mock data, designed for easy migration to real backend API.

**Base Path** (future): `/api/v1/:tenant/tasks`  
**Authentication**: Bearer token (inherited from existing API client)  
**Content-Type**: `application/json`

---

## Endpoints

### GET /tasks

Retrieve a list of tasks with optional filtering.

**URL**: `GET /api/v1/:tenant/tasks`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tenant` | string | ✅ | Tenant identifier |

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | string[] | ❌ | Filter by status (comma-separated) | `TODO,IN_PROGRESS` |
| `priority` | string[] | ❌ | Filter by priority (comma-separated) | `HIGH,URGENT` |
| `search` | string | ❌ | Search in title/description | `budget review` |
| `sortBy` | string | ❌ | Sort field | `dueDate` (default) |
| `sortDir` | string | ❌ | Sort direction | `asc` (default) or `desc` |
| `page` | number | ❌ | Page number (1-indexed) | `1` (default) |
| `pageSize` | number | ❌ | Items per page | `50` (default) |

**Request Example**:
```http
GET /api/v1/acme-corp/tasks?status=TODO,IN_PROGRESS&priority=HIGH&search=budget&sortBy=dueDate&sortDir=asc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Review Q4 Budget",
      "description": "Complete quarterly budget review and submit recommendations",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-03-15",
      "assignee": {
        "id": 1,
        "name": "Sarah Chen",
        "avatar": "https://example.com/avatars/sarah.jpg"
      },
      "creator": {
        "id": 2,
        "name": "James Park",
        "avatar": null
      },
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-02-25T14:30:00Z",
      "tags": ["finance", "quarterly"],
      "department": "Finance",
      "relatedDocumentsCount": 3
    },
    {
      "id": 2,
      "title": "Update API Documentation",
      "description": null,
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": null,
      "assignee": null,
      "creator": {
        "id": 3,
        "name": "Lisa Müller",
        "avatar": "https://example.com/avatars/lisa.jpg"
      },
      "createdAt": "2026-02-22T09:00:00Z",
      "updatedAt": "2026-02-22T09:00:00Z",
      "tags": ["documentation", "engineering"],
      "department": "Engineering",
      "relatedDocumentsCount": 0
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 50
  }
}
```

**Error Responses**:

**400 Bad Request** - Invalid parameters:
```json
{
  "success": false,
  "error": "Invalid status value: INVALID_STATUS. Must be one of: TODO, IN_PROGRESS, COMPLETED, BLOCKED",
  "data": []
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or expired token",
  "data": []
}
```

**403 Forbidden** - Insufficient permissions:
```json
{
  "success": false,
  "error": "Forbidden: You do not have permission to access tasks for this tenant",
  "data": []
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "error": "Internal server error: Database connection failed",
  "data": []
}
```

---

### GET /tasks/:id

Retrieve a single task by ID.

**URL**: `GET /api/v1/:tenant/tasks/:id`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tenant` | string | ✅ | Tenant identifier |
| `id` | number | ✅ | Task ID |

**Request Example**:
```http
GET /api/v1/acme-corp/tasks/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Review Q4 Budget",
    "description": "Complete quarterly budget review and submit recommendations",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2026-03-15",
    "assignee": {
      "id": 1,
      "name": "Sarah Chen",
      "avatar": "https://example.com/avatars/sarah.jpg"
    },
    "creator": {
      "id": 2,
      "name": "James Park",
      "avatar": null
    },
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-25T14:30:00Z",
    "tags": ["finance", "quarterly"],
    "department": "Finance",
    "relatedDocumentsCount": 3
  }
}
```

**Error Responses**:

**404 Not Found** - Task doesn't exist:
```json
{
  "success": false,
  "error": "Task with ID 999 not found",
  "data": null
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or expired token",
  "data": null
}
```

---

## Data Models

See [types.ts](./types.ts) for complete TypeScript definitions.

### Task Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | ✅ | Unique task identifier |
| `title` | string | ✅ | Task title (1-200 chars) |
| `description` | string \| null | ❌ | Detailed description (0-5000 chars) |
| `status` | TaskStatus | ✅ | Current status (enum) |
| `priority` | TaskPriority | ✅ | Priority level (enum) |
| `dueDate` | string \| null | ❌ | ISO8601 date (YYYY-MM-DD) |
| `assignee` | User \| null | ❌ | Assigned user object |
| `creator` | User | ✅ | Creator user object |
| `createdAt` | string | ✅ | ISO8601 datetime |
| `updatedAt` | string | ✅ | ISO8601 datetime |
| `tags` | string[] | ✅ | Array of tags (0-10 items) |
| `department` | string \| null | ❌ | Department name |
| `relatedDocumentsCount` | number | ✅ | Count of linked documents |

### Enums

**TaskStatus**: `TODO` | `IN_PROGRESS` | `COMPLETED` | `BLOCKED`

**TaskPriority**: `LOW` | `MEDIUM` | `HIGH` | `URGENT`

---

## Filtering Logic

**Status Filter**:
- Multiple values: OR logic (match any)
- Empty array: No filtering (all statuses)
- Example: `status=TODO,IN_PROGRESS` → Returns tasks with status TODO OR IN_PROGRESS

**Priority Filter**:
- Multiple values: OR logic (match any)
- Empty array: No filtering (all priorities)
- Example: `priority=HIGH,URGENT` → Returns tasks with priority HIGH OR URGENT

**Search**:
- Case-insensitive substring match
- Searches in both `title` AND `description` fields
- Empty string: No filtering
- Example: `search=budget` → Returns tasks where "budget" appears in title or description

---

## Sorting Logic

**Supported Sort Fields**:
- `dueDate`: Sort by due date (nulls last)
- `priority`: Sort by priority weight (LOW=1, MEDIUM=2, HIGH=3, URGENT=4)
- `createdAt`: Sort by creation timestamp
- `title`: Sort alphabetically by title

**Sort Direction**:
- `asc`: Ascending order
- `desc`: Descending order

**Default Sort**: `sortBy=dueDate&sortDir=asc` (earliest due date first, nulls last)

---

## Pagination

**Parameters**:
- `page`: Page number (1-indexed, default: 1)
- `pageSize`: Items per page (default: 50, max: 100)

**Response Metadata**:
```json
{
  "meta": {
    "total": 142,      // Total number of tasks matching filters
    "page": 2,         // Current page number
    "pageSize": 50     // Items per page
  }
}
```

**Note**: Pagination is optional for MVP (all tasks returned in single response). Implement when >500 tasks expected.

---

## Rate Limiting

**Limits** (future implementation):
- 100 requests per minute per user
- 429 Too Many Requests response when exceeded

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1709136000
```

---

## Caching

**Client-Side** (TanStack Query):
- Stale time: 5 minutes
- Cache time: 10 minutes
- Automatic refetch on window focus
- Manual refetch available

**Server-Side** (future):
- ETags for conditional requests
- Cache-Control headers
- Last-Modified timestamps

**Example Cache Headers**:
```
Cache-Control: private, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 26 Feb 2026 14:30:00 GMT
```

---

## Error Handling

**Error Response Format**:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "data": [] // or null for single resource endpoints
}
```

**HTTP Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid parameters or validation error
- `401 Unauthorized`: Missing/invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Temporary outage

---

## Security

**Authentication**:
- Bearer token in Authorization header
- Token inherited from existing API client configuration

**Tenant Isolation**:
- Tasks scoped to tenant in URL path
- Server validates user has access to requested tenant
- Cross-tenant requests return 403 Forbidden

**Input Validation**:
- All query parameters validated server-side
- SQL injection protection (parameterized queries)
- XSS protection (output escaping)
- Maximum lengths enforced (title, description, tags)

---

## Mock Implementation

**Current State** (MVP):
- Mock data in `taskApi.ts` with 25-30 example tasks
- 800ms simulated delay for realistic loading states
- Client-side filtering and sorting
- No actual HTTP requests

**Migration Path**:
1. Replace mock functions with axios calls to real API
2. Use existing `@/core/api/client` configured with base URL and interceptors
3. Keep TypeScript interfaces unchanged
4. Add error boundary for network failures
5. Consider moving filtering/sorting to server for >500 tasks

**Example Migration**:
```typescript
// Before (mock)
export async function getTasks(tenant: string, filters: TaskFilters) {
  await delay(800)
  return { data: MOCK_TASKS.filter(/* ... */), success: true }
}

// After (real API)
export async function getTasks(tenant: string, filters: TaskFilters) {
  const { data } = await apiClient.get<GetTasksResponse>(
    `/api/v1/${tenant}/tasks`,
    { params: buildQueryParams(filters) }
  )
  return data
}
```

---

## Future Endpoints (Out of Scope for MVP)

**POST /tasks** - Create new task  
**PATCH /tasks/:id** - Update task  
**DELETE /tasks/:id** - Delete task  
**POST /tasks/:id/comments** - Add comment  
**GET /tasks/:id/comments** - Get task comments  
**POST /tasks/:id/attachments** - Upload attachment  
**GET /tasks/:id/activity** - Get task activity log  

---

## Versioning

**Current Version**: v1.0.0 (MVP - Read-only)

**Version Strategy**:
- URL-based versioning: `/api/v1/...`
- Breaking changes increment major version
- New optional fields increment minor version
- Bug fixes increment patch version

**Backward Compatibility**:
- v1 endpoints maintained during v2 development
- Deprecation warnings in response headers
- 6-month sunset period for deprecated versions

---

## Testing Checklist

**Unit Tests**:
- ✅ Type definitions compile without errors
- ✅ Type guards correctly validate enums
- ✅ Constants have correct values

**Integration Tests**:
- ✅ GET /tasks returns expected data structure
- ✅ Filtering works for all combinations
- ✅ Sorting works for all fields and directions
- ✅ Search performs case-insensitive matching
- ✅ Error responses have correct format
- ✅ Authentication headers are required
- ✅ Tenant scoping enforced

**Performance Tests**:
- ✅ Response time <800ms for 500 tasks
- ✅ Filtering/sorting <200ms client-side
- ✅ No memory leaks with repeated requests
