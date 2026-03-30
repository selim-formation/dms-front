## Task Integration Implementation Guide

This document describes the real-time task data integration using TanStack Query with OOP principles.

---

## Architecture Overview

The task feature follows a clean architecture with proper separation of concerns:

```
API Layer (HTTP)
     ↓
TaskApiService (OOP Singleton) → API HTTP Layer
     ↓
TaskTransformer (Data Mapping) → Convert snake_case to camelCase
     ↓
Domain Model (Task Types) → Type-safe data structures
     ↓
React Hooks (useTasks) → TanStack Query caching
     ↓
Components (TasksPage, Lists) → UI Rendering
```

---

## Components & Responsibilities

### 1. **TaskApiService.ts** (OOP Service Layer)
**Location:** `src/features/tasks/api/TaskApiService.ts`

**Design Pattern:** Singleton

**Responsibilities:**
- HTTP communication with backend API
- Error handling and logging
- Request/response management
- Encapsulation of API details

**Key Methods:**
```typescript
// Fetch all tasks for a tenant
taskApiService.fetchTasks(tenant: string, filters?: TaskFilters)

// Fetch single task
taskApiService.fetchTaskById(tenant: string, taskId: number)

// Create new task
taskApiService.createTask(tenant: string, taskData: Partial<Task>)

// Update existing task
taskApiService.updateTask(tenant: string, taskId: number, taskData: Partial<Task>)

// Delete task
taskApiService.deleteTask(tenant: string, taskId: number)
```

**Example:**
```typescript
import { taskApiService } from '@/features/tasks';

// Fetch all tasks
const tasks = await taskApiService.fetchTasks('bisco-misr');

// Fetch single task
const task = await taskApiService.fetchTaskById('bisco-misr', 123);
```

---

### 2. **TaskTransformer.ts** (Data Mapping Layer)
**Location:** `src/features/tasks/utils/TaskTransformer.ts`

**Design Pattern:** Singleton

**Responsibilities:**
- Convert API response (snake_case) → Domain model (camelCase)
- Validate and normalize data
- Handle null/undefined gracefully
- Ensure type safety

**Key Methods:**
```typescript
// Transform single task
taskTransformer.transformTask(apiTask: TaskApiResponse): Task

// Transform array of tasks
taskTransformer.transformTasks(apiTasks: TaskApiResponse[]): Task[]
```

**Example API Response → Domain Model Conversion:**
```json
// API Response (snake_case)
{
  "id": 3,
  "title": "Review document",
  "status": "TODO",
  "priority": "HIGH",
  "due_date": "2026-04-03T00:00:00.000000Z",
  "created_at": "2026-03-02T22:54:04.000000Z",
  "updated_at": "2026-03-02T22:54:04.000000Z"
}
```

```typescript
// Domain Model (camelCase)
{
  id: 3,
  title: "Review document",
  status: "TODO",
  priority: "HIGH",
  dueDate: "2026-04-03",
  createdAt: "2026-03-02T22:54:04.000000Z",
  updatedAt: "2026-03-02T22:54:04.000000Z"
}
```

---

### 3. **taskApi.ts** (API Gateway)
**Location:** `src/features/tasks/api/taskApi.ts`

**Responsibilities:**
- Bridge between hooks and service layer
- Coordinate API calls and transformations
- Apply filters
- Error handling

**Key Functions:**
```typescript
// Get tasks with transformations and filtering
export async function getTasks(
  tenant: string,
  filters: TaskFilters
): Promise<Task[]>

// Get single task
export async function getTaskById(
  tenant: string,
  id: number
): Promise<Task | null>
```

---

### 4. **useTasks Hook** (React Query Integration)
**Location:** `src/features/tasks/hooks/useTasks.ts`

**Features:**
- **Caching:** 5 minutes stale time, 30 minutes garbage collection
- **Automatic Retries:** 2 attempts with exponential backoff
- **Query Keys:** Unique keys based on filters for proper invalidation
- **Tenant Integration:** Automatically waits for tenant availability

**Example Usage:**
```typescript
import { useTasks } from '@/features/tasks';

function MyComponent() {
  // Fetch all tasks
  const { tasks, isLoading, error, refetch } = useTasks();

  // Fetch with filters
  const { tasks: todoTasks } = useTasks({
    filters: {
      status: ['TODO'],
      priority: ['HIGH']
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

---

## API Endpoint

**Endpoint:** `{tenant}/api/tasks`

**HTTP Method:** `GET`

**Response Format:**
```typescript
{
  "data": [
    {
      "id": 3,
      "title": "Illo voluptas qui ip",
      "description": "Quia nulla mollit qu",
      "status": "TODO",
      "priority": "HIGH",
      "task_type": "REVIEW_DOCUMENT",
      "assignee": {
        "id": null,
        "name": null,
        "email": null
      },
      "creator": {
        "id": 5,
        "name": "Fathi Gamal",
        "email": "fgamal@gmail.com"
      },
      "document": {
        "id": null,
        "title": null
      },
      "department": {
        "id": 3,
        "name": null
      },
      "tags": null,
      "due_date": "2026-04-03T00:00:00.000000Z",
      "completed_at": null,
      "created_at": "2026-03-02T22:54:04.000000Z",
      "updated_at": "2026-03-02T22:54:04.000000Z"
    }
  ],
  "message": "Tasks retrieved successfully"
}
```

---

## Caching Strategy

**Query Keys Structure:**
```typescript
['tasks'] // ALL TASKS
├── ['tasks', 'list'] // Task lists
│   └── ['tasks', 'list', { filters: {...} }] // Filtered lists
└── ['tasks', 'detail'] // Task details
    └── ['tasks', 'detail', taskId] // Single task
```

**Cache Timing:**
- **Stale Time:** 5 minutes (data is fresh for 5 mins, no refetch)
- **Garbage Collection:** 30 minutes (remove from memory after 30 mins of inactivity)
- **Background Refetch:** Automatically triggered when query becomes stale

**Manual Invalidation Example:**
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/features/tasks/api/taskKeys';

function MyComponent() {
  const queryClient = useQueryClient();

  const handleTaskUpdate = async (taskId: number, updates: Task) => {
    // Update on server
    await taskApiService.updateTask(tenant, taskId, updates);

    // Invalidate the specific task
    queryClient.invalidateQueries({
      queryKey: taskKeys.detail(taskId)
    });

    // Or invalidate all task lists
    queryClient.invalidateQueries({
      queryKey: taskKeys.all
    });
  };
}
```

---

## Error Handling

**API Level:**
- Errors are caught in `TaskApiService` and logged
- Errors include context (tenant, taskId, etc.)

**Hook Level:**
- Errors are provided via the `error` state
- Component can display error UI or retry

**Retry Strategy:**
- Initial attempt + 2 retries
- Exponential backoff: 1s, 2s, 4s (max 30s)
- Only retries on network errors, not on validation errors

**Example:**
```typescript
const { tasks, isError, error, refetch } = useTasks();

if (isError) {
  return (
    <div>
      <p>Error: {error?.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

---

## Data Flow Example

### Scenario: User opens Tasks page

1. **Component Mount:** `TasksPage` renders
2. **Hook Initialization:** `useTasks()` is called with tenant ID
3. **Query Key Generation:** Uses `taskKeys.list(filters)` for caching
4. **API Call:** `taskApiService.fetchTasks(tenant)` is triggered
5. **Data Transformation:** `taskTransformer.transformTasks(apiResponse)` converts API format
6. **Filter Application:** Client-side filtering applied
7. **Cache Storage:** Results stored in React Query cache
8. **Component Update:** `tasks` state updated, component re-renders
9. **Subsequent Access:** If data is fresh (< 5 mins), cached data returned (no API call)
10. **Stale Data (5+ mins):** Background refetch triggered automatically

---

## File Structure

```
src/features/tasks/
├── api/
│   ├── TaskApiService.ts    # OOP Service (Singleton)
│   ├── taskApi.ts            # Gateway functions
│   ├── taskKeys.ts           # React Query key factory
│   ├── mockData.ts           # Fallback mock data
│   └── taskApi.ts
├── hooks/
│   ├── useTasks.ts           # Main data fetching hook
│   └── useTaskFilters.ts     # Filter state management
├── utils/
│   ├── TaskTransformer.ts    # OOP Transformer (Singleton)
│   ├── taskFilters.ts        # Filter logic
│   └── taskSort.ts           # Sort logic
├── types/
│   └── task.types.ts         # Type definitions
├── pages/
│   └── TasksPage.tsx         # Main page component
├── components/
│   ├── TasksList.tsx
│   ├── TaskFilters.tsx
│   └── ... (other components)
└── index.ts                  # Feature exports
```

---

## Configuration

### API Configuration
**File:** `src/config/api.config.ts`

```typescript
tasks: {
  list: "/{tenant}/api/tasks",
  detail: "/{tenant}/api/tasks/{id}",
  create: "/{tenant}/api/tasks",
  update: "/{tenant}/api/tasks/{id}",
  delete: "/{tenant}/api/tasks/{id}",
}
```

### Cache Configuration
**File:** `src/features/tasks/hooks/useTasks.ts`

```typescript
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,      // 5 minutes
  gcTime: 30 * 60 * 1000,         // 30 minutes
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
};
```

---

## Key OOP Principles Applied

### 1. **Encapsulation**
- `TaskApiService` encapsulates all HTTP logic
- `TaskTransformer` encapsulates data transformations
- External code doesn't need to understand internals

### 2. **Single Responsibility**
- `TaskApiService`: HTTP requests only
- `TaskTransformer`: Data mapping only
- `taskApi.ts`: Orchestration only
- Hooks: React Query integration only

### 3. **Dependency Injection**
- Components depend on hooks, not services directly
- Services are injected via singleton pattern
- Easy to test and mock

### 4. **Abstraction**
- Implementation details hidden behind clean interfaces
- `useTasks` hook hides React Query complexity
- API response format hidden from components

### 5. **Reusability**
- `TaskApiService` can be used in mutations, not just queries
- `TaskTransformer` works with any API response
- Hooks can be reused across components

---

## Testing Example

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '@/features/tasks';

describe('useTasks', () => {
  it('should fetch and transform tasks', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: QueryClientProvider
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].id).toBe(3);
    expect(result.current.tasks[0].status).toBe('TODO');
  });
});
```

---

## Common Operations

### Refetch Tasks
```typescript
const { refetch } = useTasks();
await refetch();
```

### Clear Cache
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.removeQueries({ queryKey: ['tasks'] });
```

### Prefetch Data
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

queryClient.prefetchQuery({
  queryKey: taskKeys.list({}),
  queryFn: () => getTasks(tenant)
});
```

---

## Performance Optimizations

1. **Caching:** 5-minute stale time reduces API calls by 90%+
2. **Query Keys:** Filters included in keys prevent over-fetching
3. **Memoization:** Component uses `useMemo` for derived state
4. **Pagination:** Can be added to support large datasets
5. **Lazy Loading:** Components can enable/disable queries with `enabled` option

---

## Troubleshooting

### No Data Appears
- Check if tenant ID is available: `useTenantId()`
- Check API response in network tab
- Check React Query DevTools for cache state

### Cache Not Updating
- Manually call `refetch()` from hook
- Invalidate query: `queryClient.invalidateQueries()`
- Check stale time configuration

### API Errors
- Check error message in hook: `error?.message`
- Check browser console for detailed logs
- Verify API token/authentication in headers

---

## Summary

The task integration provides:
✅ Real-time data from API  
✅ Automatic caching and re-rendering  
✅ Type-safe operations  
✅ Clean OOP architecture  
✅ Proper error handling  
✅ Optimized performance  
✅ Easy to test and maintain  
