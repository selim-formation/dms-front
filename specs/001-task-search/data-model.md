# Data Model: Task Search with Filters

**Feature**: [001-task-search](spec.md)  
**Date**: 15 March 2026  
**Status**: Phase 1 - Design Complete

## Overview

Task search and filtering feature defines three primary data models:
1. **Task** - Core entity being searched (from existing system)
2. **TaskSearchParams** - Frontend query representation
3. **TaskSearchResponse** - Backend API response with pagination

## Core Entities

### Task Entity

**Purpose**: Represents a single task that can be searched and filtered.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-----------|-----------|
| `id` | number | ✅ | ID > 0 | Unique task identifier |
| `title` | string | ✅ | 1-200 chars | Task title/summary |
| `description` | string \| null | - | 0-5000 chars | Detailed description (Markdown supported) |
| `status` | TaskStatus | ✅ | enum | One of: TODO, IN_PROGRESS, COMPLETED, BLOCKED |
| `priority` | TaskPriority | ✅ | enum | One of: LOW, MEDIUM, HIGH, URGENT |
| `dueDate` | string \| null | - | ISO8601: YYYY-MM-DD | Target completion date |
| `assignee` | User \| null | - | - | Person responsible for task |
| `creator` | User | ✅ | - | Person who created task |
| `createdAt` | string | ✅ | ISO8601 timestamp | Task creation time |
| `updatedAt` | string | ✅ | ISO8601 timestamp | Last modification time |
| `tags` | string[] | ✅ | 0-10 items, 1-30 chars each | Categorization labels |
| `department` | Department \| null | - | - | Department/team context (type: TBD - see note below) |
| `relatedDocumentsCount` | number | ✅ | >= 0 | Count of associated documents |
| `completedAt` | string \| null | - | ISO8601 timestamp | Completion timestamp (if status=COMPLETED) |

**Note on Department**: 
- Current codebase has `department: string | null`
- Spec suggests `department: { id: number; name: string }`
- Recommendation: **Update to match spec** for consistency with other object fields

**Status Type Definition**:
```typescript
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  'TODO': 'To Do',
  'IN_PROGRESS': 'In Progress',
  'COMPLETED': 'Completed',
  'BLOCKED': 'Blocked',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  'TODO': 'bg-gray-100',
  'IN_PROGRESS': 'bg-blue-100',
  'COMPLETED': 'bg-green-100',
  'BLOCKED': 'bg-red-100',
};
```

**Priority Type Definition**:
```typescript
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  'LOW': 'Low',
  'MEDIUM': 'Medium',
  'HIGH': 'High',
  'URGENT': 'Urgent',
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  'LOW': 'text-gray-600',
  'MEDIUM': 'text-yellow-600',
  'HIGH': 'text-orange-600',
  'URGENT': 'text-red-600',
};
```

### User Entity

**Purpose**: Represents a user (assignee or creator).

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-----------|-----------|
| `id` | number | ✅ | ID > 0 | Unique user identifier |
| `name` | string | ✅ | 1-255 chars | User display name |
| `email` | string | - | Valid email format | User email address (from spec API response) |
| `avatar` | string \| null | - | Valid URL | Profile image URL |

### Department Entity

**Purpose**: Represents a department or team.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-----------|-----------|
| `id` | number | ✅ | ID > 0 | Unique department identifier |
| `name` | string | ✅ | 1-100 chars | Department/team name |

### Tag

**Purpose**: Simple string categorization label for tasks.

**Constraints**:
- Per-task: 0-10 tags maximum
- Each tag: 1-30 characters
- Case-sensitive (suggested: normalize to lowercase for consistency)
- Examples: "urgent", "important", "reviewed"

---

## Query Models (Frontend)

### TaskSearchParams

**Purpose**: Represents all search and filter parameters the user selects. Sent to backend API.

**Fields**:

| Field | Type | Default | Required | Constraints | Description |
|-------|------|---------|----------|-----------|-----------|
| `search` | string | "" | - | 0-500 chars | Full-text search term |
| `status` | string[] | [] | - | Valid TaskStatus values | Filter by one or more statuses |
| `priority` | string[] | [] | - | Valid TaskPriority values | Filter by one or more priorities |
| `task_type` | string | null | - | TBD | Filter by task type (if backend supports) |
| `department_id` | number \| null | null | - | ID > 0 | Filter by department |
| `assignee_id` | number \| null | null | - | ID > 0 | Filter by assignee user |
| `due_date_from` | string \| null | null | - | ISO8601: YYYY-MM-DD | Date range start (inclusive) |
| `due_date_to` | string \| null | null | - | ISO8601: YYYY-MM-DD | Date range end (inclusive) |
| `per_page` | number | 15 | - | 1-100 | Results per page |
| `page` | number | 1 | - | >= 1 | Current page number |
| `sort_by` | string | "created_at" | - | createdAt, updatedAt, dueDate, priority | Sort field |
| `sort_order` | "asc" \| "desc" | "desc" | - | asc, desc | Sort direction |

**Notes**:
- All parameters are optional for API (defaults handled by backend)
- Frontend can selectively send only changed parameters
- Empty arrays for status/priority mean "no filter" (match all)
- Null values mean "not filtering by this"

### TaskFilters (UI State)

**Purpose**: Represents the UI filter selection state (separate from API params).

**Fields**:

```typescript
export interface TaskFilters {
  search: string;                    // Current search input value
  statuses: Set<TaskStatus>;         // Selected status checkboxes
  priorities: Set<TaskPriority>;     // Selected priority checkboxes
  assigneeIds: Set<number>;          // Selected assignees
  departmentIds: Set<number>;        // Selected departments
  dueDateRange: {                     // Date range selection
    from: Date | null;
    to: Date | null;
  };
  sortBy: SortField;                 // Current sort field
  sortOrder: SortDirection;          // Current sort direction
}
```

**Usage**: Builds TaskSearchParams when user submits filters

---

## Response Models (Backend)

### TaskSearchResponse

**Purpose**: API response from `/api/tasks/search` endpoint.

**Structure**:

```typescript
export interface TaskSearchResponse {
  message: string;                   // "Tasks searched successfully"
  status: 'success' | 'error';       // Response status
  code: number;                      // HTTP status code (200, 400, 500, etc.)
  data: Task[];                      // Array of matching tasks
  meta: {
    total: number;                   // Total count (all pages)
    per_page: number;                // Items per page (echoes request)
    current_page: number;            // Current page (1-indexed)
    last_page: number;               // Last page number
    from: number;                    // Index of first item in current page
    to: number;                      // Index of last item in current page
  };
}
```

**Example Response** (15 results, page 1 of 3):
```json
{
  "message": "Tasks searched successfully",
  "status": "success",
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "Update Documentation",
      "description": "Review and update technical docs",
      "status": "TODO",
      "priority": "HIGH",
      "assignee": {
        "id": 5,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "creator": {
        "id": 1,
        "name": "Admin",
        "email": "admin@example.com"
      },
      "document": {
        "id": 10,
        "title": "Technical Manual"
      },
      "department": {
        "id": 3,
        "name": "Engineering"
      },
      "tags": ["important", "urgent"],
      "dueDate": "2026-04-01",
      "completedAt": null,
      "createdAt": "2026-03-15T10:30:00Z",
      "updatedAt": "2026-03-15T10:30:00Z"
    }
    // ... 14 more tasks
  ],
  "meta": {
    "total": 45,
    "per_page": 15,
    "current_page": 1,
    "last_page": 3,
    "from": 1,
    "to": 15
  }
}
```

---

## State Management Pattern

### Frontend Store Shape (React Context or Zustand)

```typescript
export interface TaskSearchState {
  // Current search/filter state
  params: TaskSearchParams;
  filters: TaskFilters;
  
  // API response data
  results: Task[];
  meta: PaginationMeta;
  
  // Loading/error states
  isLoading: boolean;
  error: Error | null;
  
  // User actions
  setSearch: (query: string) => void;
  setFilters: (filters: TaskFilters) => void;
  setPage: (page: number) => void;
  setSortBy: (field: SortField, order: SortDirection) => void;
  reset: () => void;
  
  // Derived
  hasActiveFilters: boolean;
  itemCount: number;
  pageCount: number;
}
```

---

## Validation Rules

### Input Validation (Frontend)

**Search Input**:
- Max 500 characters
- Trim whitespace
- No validation on content (allow special chars)

**Date Inputs**:
- Valid ISO8601 dates (YYYY-MM-DD)
- `due_date_from` <= `due_date_to` (if both set)
- Dates must be valid calendar dates

**Pagination**:
- `per_page`: 1-100 (default 15)
- `page`: >= 1, <= last_page (from meta)
- Prevent page > last_page

**Filters**:
- Status/Priority: Must be valid enum values
- IDs (department, assignee): Must be positive integers
- Empty arrays treated as "no filter"

### Backend Response Validation

**Assumptions**:
- Task IDs are always positive integers
- All timestamps are valid ISO8601
- Due dates are in ISO8601 format (YYYY-MM-DD)
- `meta.total` >= `data.length`
- `meta.from` and `meta.to` are inclusive indices
- `meta.last_page` = ceil(meta.total / meta.per_page)

---

## Relationships & Dependencies

**Entity Relationships**:
```
Task
├── Assignee (User)
├── Creator (User)
├── Department
├── Tags (string[])
└── RelatedDocuments (count only)

User
├── id
├── name
└── email

Department
├── id
└── name
```

**Data Flow**:
```
User Interaction
    ↓
TaskSearchInput (text) / TaskFilterUI (dropdowns)
    ↓
TaskFilters (UI state)
    ↓
TaskSearchParams (API query format)
    ↓
API: GET /api/tasks/search?...
    ↓
TaskSearchResponse (JSON)
    ↓
Task[] (displayed in UI)
```

---

## Pagination Metadata

**Calculation Examples**:

Given: total=45, per_page=15

| Page | from | to | Count | last_page |
|------|------|----|----|-----------|
| 1 | 1 | 15 | 15 | 3 |
| 2 | 16 | 30 | 15 | 3 |
| 3 | 31 | 45 | 15 | 3 |

Formula:
- `last_page` = ceil(total / per_page)
- `from` = (current_page - 1) * per_page + 1
- `to` = min(current_page * per_page, total)
- `data.length` = to - from + 1

---

## Type Safety Strategy

**Recommended**: Use Zod for runtime validation (already in use in codebase)

```typescript
// contracts/search-params.schema.ts
import { z } from 'zod';

const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']);
const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const TaskSearchParamsSchema = z.object({
  search: z.string().max(500).optional().default(''),
  status: z.array(TaskStatusEnum).optional().default([]),
  priority: z.array(TaskPriorityEnum).optional().default([]),
  department_id: z.number().int().positive().nullable().optional(),
  assignee_id: z.number().int().positive().nullable().optional(),
  due_date_from: z.string().date().nullable().optional(),
  due_date_to: z.string().date().nullable().optional(),
  per_page: z.number().int().min(1).max(100).optional().default(15),
  page: z.number().int().min(1).optional().default(1),
  sort_by: z.string().optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TaskSearchParams = z.infer<typeof TaskSearchParamsSchema>;
```

---

**Phase 1a Status**: ✅ COMPLETE - Data model fully defined with validations and relationships.
