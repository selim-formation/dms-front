# Data Model: Modern Tasks Page

**Feature**: 001-tasks-page-design  
**Date**: 2026-02-26  
**Status**: Complete

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the Tasks Page feature. The model supports filtering, sorting, searching, and detailed view requirements from the spec.

---

## Core Entities

### Task

Primary entity representing a work item that can be assigned, tracked, and completed.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | number | ✅ | Unique, positive integer | Primary identifier |
| `title` | string | ✅ | 1-200 characters | Task name/summary |
| `description` | string | ❌ | 0-5000 characters | Detailed task description (Markdown supported) |
| `status` | TaskStatus | ✅ | Enum | Current task state |
| `priority` | TaskPriority | ✅ | Enum | Task urgency level |
| `dueDate` | ISO8601 date | ❌ | Future or null | Target completion date |
| `assignee` | User | ❌ | Valid user or null | Person responsible for task |
| `creator` | User | ✅ | Valid user | Person who created task |
| `createdAt` | ISO8601 datetime | ✅ | Immutable | Task creation timestamp |
| `updatedAt` | ISO8601 datetime | ✅ | >= createdAt | Last modification timestamp |
| `tags` | string[] | ❌ | 0-10 tags, each 1-30 chars | Categorization labels |
| `department` | string | ❌ | 1-100 characters | Associated department/team |
| `relatedDocumentsCount` | number | ❌ | Non-negative integer | Count of linked documents |

**TypeScript Definition**:
```typescript
interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null  // ISO8601 date format: "YYYY-MM-DD"
  assignee: User | null
  creator: User
  createdAt: string  // ISO8601: "YYYY-MM-DDTHH:mm:ssZ"
  updatedAt: string  // ISO8601: "YYYY-MM-DDTHH:mm:ssZ"
  tags: string[]
  department: string | null
  relatedDocumentsCount: number
}
```

**Validation Rules**:
- `title` cannot be empty string (whitespace only = invalid)
- `dueDate` if provided, should be parseable ISO8601 date
- `relatedDocumentsCount` defaults to 0 if not provided
- `updatedAt` must be >= `createdAt`
- At least one of `assignee` or `department` should be populated for filtering purposes

**Indexes** (for future real database):
- Primary: `id`
- Foreign: `assignee.id`, `creator.id`
- Composite: `(status, priority)`, `(dueDate)` for efficient filtering/sorting

---

### TaskStatus (Enum)

Represents the current state of a task in its lifecycle.

**Values**:

| Value | Display | Description | Color Hint |
|-------|---------|-------------|------------|
| `TODO` | To Do | Task not yet started | Gray (neutral) |
| `IN_PROGRESS` | In Progress | Task actively being worked on | Blue (primary) |
| `COMPLETED` | Completed | Task finished successfully | Green (success) |
| `BLOCKED` | Blocked | Task cannot proceed due to dependency | Red (danger) |

**TypeScript Definition**:
```typescript
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'

// Display mapping
const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
}
```

**State Transitions** (for future implementation):
```
TODO → IN_PROGRESS → COMPLETED
  ↓         ↓
BLOCKED   BLOCKED
  ↓         ↓
TODO    IN_PROGRESS
```

**Validation**:
- Only valid enum values accepted
- Case-sensitive (uppercase with underscores)

---

### TaskPriority (Enum)

Represents the urgency level of a task.

**Values**:

| Value | Display | Description | Color Hint |
|-------|---------|-------------|------------|
| `LOW` | Low | Can be done when time permits | Gray |
| `MEDIUM` | Medium | Normal priority | Yellow (warning) |
| `HIGH` | High | Should be completed soon | Orange |
| `URGENT` | Urgent | Requires immediate attention | Red (danger) |

**TypeScript Definition**:
```typescript
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// Numeric weight for sorting
const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
}
```

**Validation**:
- Only valid enum values accepted
- Case-sensitive (uppercase)

---

### User (Nested Entity)

Represents a user referenced in tasks (assignee or creator).

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | number | ✅ | Unique, positive integer | User identifier |
| `name` | string | ✅ | 1-100 characters | User's display name |
| `avatar` | string (URL) | ❌ | Valid URL or null | Profile image URL |

**TypeScript Definition**:
```typescript
interface User {
  id: number
  name: string
  avatar: string | null
}
```

**Validation Rules**:
- `avatar` if provided, should be valid HTTP/HTTPS URL or null
- `name` cannot be empty string

---

## Filter & Sort Models

### TaskFilters

Represents active filter criteria applied to the task list.

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `status` | TaskStatus[] | Filter by one or more statuses (empty = all) |
| `priority` | TaskPriority[] | Filter by one or more priorities (empty = all) |
| `search` | string | Search query for title/description (case-insensitive) |

**TypeScript Definition**:
```typescript
interface TaskFilters {
  status: TaskStatus[]
  priority: TaskPriority[]
  search: string
}

// Default state (no filters)
const DEFAULT_FILTERS: TaskFilters = {
  status: [],
  priority: [],
  search: '',
}
```

**Behavior**:
- Multiple statuses/priorities = OR logic (match any)
- `search` performs case-insensitive substring match on `title` AND `description`
- Empty arrays/string = no filtering on that dimension

---

### SortConfig

Represents sort order applied to the task list.

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `field` | SortField | Field to sort by |
| `direction` | SortDirection | Ascending or descending |

**TypeScript Definition**:
```typescript
type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField
  direction: SortDirection
}

// Default sort (earliest due date first)
const DEFAULT_SORT: SortConfig = {
  field: 'dueDate',
  direction: 'asc',
}
```

**Sort Behavior**:

| Field | ASC | DESC | Null Handling |
|-------|-----|------|---------------|
| `dueDate` | Earliest first | Latest first | Nulls last |
| `priority` | Low → Urgent | Urgent → Low | N/A (required) |
| `createdAt` | Oldest first | Newest first | N/A (required) |
| `title` | A → Z | Z → A | N/A (required) |

---

## API Response Models

### ApiResponse<T>

Standard wrapper for API responses (matches existing pattern in documents feature).

**TypeScript Definition**:
```typescript
interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}
```

**Examples**:

```typescript
// Success response
const successResponse: ApiResponse<Task[]> = {
  data: [/* tasks */],
  success: true,
  meta: { total: 42 }
}

// Error response
const errorResponse: ApiResponse<Task[]> = {
  data: [],
  success: false,
  error: 'Failed to fetch tasks: Network timeout'
}
```

---

## Data Relationships

```
┌─────────────────┐
│      Task       │
│─────────────────│
│ id              │──┐
│ title           │  │
│ status          │  │
│ priority        │  │
│ ...             │  │
└─────────────────┘  │
         │           │
         │           │
         ↓           │
   ┌─────────┐      │
   │  User   │←─────┘ (assignee)
   │─────────│
   │ id      │←─────── (creator)
   │ name    │
   │ avatar  │
   └─────────┘

Related Documents Count: Integer only, no direct link in MVP
```

**Cardinality**:
- Task → assignee: Many-to-One (optional)
- Task → creator: Many-to-One (required)
- Task → documents: Count only (no enforced relationship in MVP)

---

## Mock Data Requirements

**Volume**: 25-30 diverse task examples

**Coverage**:
- All 4 statuses represented (balanced distribution)
- All 4 priorities represented (weighted toward Medium/High)
- Mix of assigned and unassigned tasks
- Mix of tasks with/without due dates
- Past due, upcoming, and far future due dates
- Various departments represented
-Empty/null values for optional fields
- Realistic titles and descriptions

**Example Distribution**:
- TODO: 30% (7-9 tasks)
- IN_PROGRESS: 35% (9-10 tasks)
- COMPLETED: 20% (5-6 tasks)
- BLOCKED: 15% (4-5 tasks)

---

## Validation Summary

**Client-Side Validation**:
- Type checking (TypeScript enforces shape)
- Enum value validation (status, priority)
- Date format validation (ISO8601)
- String length constraints (title, description)
- Array length constraints (tags)

**Server-Side Validation** (future real API):
- All client-side validations
- Business rules (e.g., assignee exists in system)
- Permission checks (tenant scoping)
- Uniqueness constraints (id)

---

## State Management

**Local UI State** (useState in TasksPage):
- `filters: TaskFilters` - Current filter selections
- `sortConfig: SortConfig` - Current sort configuration
- `selectedTaskId: number | null` - ID of task in details panel

**Server State** (TanStack Query):
- `tasks: Task[]` - Cached task list
- Query status: loading, error, success
- Automatic refetch on window focus
- 5-minute stale time

**Derived State** (useMemo):
- Filtered tasks: `tasks + filters → filteredTasks`
- Sorted tasks: `filteredTasks + sortConfig → displayTasks`

---

## Performance Considerations

**Filtering** (Client-Side):
- O(n) time complexity for status/priority filters
- O(n * m) for search (n tasks, m avg title+description length)
- Acceptable for 500 tasks
- Consider server-side for > 1000 tasks

**Sorting**:
- O(n log n) time complexity
- Memoized to prevent re-sort on unrelated state changes
- Pre-compute sort keys where applicable (e.g., priority weight)

**Memory**:
- 25-30 mock tasks: ~15-20KB JSON
- 500 tasks: ~250-300KB JSON (within browser limits)
- Task cards: ~5KB each rendered (React memo reduces re-render cost)

---

## Future Extensions (Out of Scope for MVP)

**Additional Fields**:
- `parentTaskId` for subtasks/hierarchy
- `estimatedHours` for workload planning
- `completedAt` timestamp
- `comments` array for activity feed
- `attachments` array for file uploads
- `watchers` array for notifications

**Additional Entities**:
- TaskComment (for activity feed)
- TaskAttachment (for file uploads)
- TaskActivity (audit log)
- TaskTemplate (for recurring tasks)

**Relationships**:
- Task → Document (direct foreign keys)
- Task → Parent Task (self-referential)
- Task → Project/Epic (grouping)
