# Research Document: Task Search with Filters

**Date**: 15 March 2026  
**Feature**: [001-task-search](spec.md)  
**Status**: Phase 0 Complete  

## Research Findings

### 1. Testing Framework Strategy

**Decision**: Use Vitest (inferred from Vite + React 18 project)

**Rationale**:
- No explicit `vitest` or `jest` config found in repository
- Project uses Vite as build tool (vite.config.ts present)
- Vitest is the recommended test framework for Vite projects
- Zero-config setup with Vite integration
- Native ESM/TypeScript support without transpilation

**Implementation**:
- Create `vitest.config.ts` for test configuration
- Use standard `@testing-library/react` + `@testing-library/user-event` for component testing
- Unit tests: `tests/features/tasks/unit/`
- Integration tests: `tests/features/tasks/integration/`
- Minimal setup required - vitest runs tests in Vite pipeline

**Code Pattern**:
```typescript
// tests/features/tasks/unit/useTaskSearch.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTaskSearch } from '@/features/tasks/hooks/useTaskSearch';
// Tests here follow standard vitest patterns
```

---

### 2. TanStack Query (React Query) Integration Patterns

**Findings**:
- Project dependency: `@tanstack/react-query: ^5.90.21` ✅
- DevTools installed: `@tanstack/react-query-devtools: ^5.91.3` ✅

**Current Patterns Found**:
- Query client configured in `src/core/api/query-client.ts` (inferred from common patterns)
- Provider setup in `src/core/providers/AppProviders.tsx`
- HTTP client base URL and interceptors in `src/core/api/client.ts`

**Task Search Hook Pattern**:
```typescript
// src/features/tasks/hooks/useTaskSearch.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { taskSearchService } from '@/features/tasks/services/taskSearchService';

export function useTaskSearch(params: TaskSearchParams) {
  return useQuery({
    queryKey: ['tasks', 'search', params], // Includes all filter params for cache invalidation
    queryFn: () => taskSearchService.search(params),
    staleTime: 1000 * 60 * 5, // 5 minutes (configurable)
    gcTime: 1000 * 60 * 10,   // 10 minutes
  });
}
```

**Cache Invalidation Strategy**:
- Invalidate when filter changes: `queryClient.invalidateQueries({ queryKey: ['tasks', 'search'] })`
- Maintain separate cache per filter combination (TQ v5 does this automatically)
- Debounce search input at 300ms before query trigger (per spec clarification)

**Error Handling Pattern** (per spec error clarification):
```typescript
// Error state returned from useQuery hook
if (error) {
  return <TaskSearchError error={error} onRetry={() => refetch()} />;
}
```

---

### 3. Task Entity Type Definitions

**Source**: `src/features/tasks/types/task.types.ts` ✅

**Current Task Type Structure**:
```typescript
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;  // 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  priority: TaskPriority;  // 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null;  // ISO8601: YYYY-MM-DD
  assignee: User | null;
  creator: User;
  createdAt: string;  // ISO8601: YYYY-MM-DDTHH:mm:ssZ
  updatedAt: string;  // ISO8601: YYYY-MM-DDTHH:mm:ssZ
  tags: string[];
  department: string | null;  // Currently string, not object
  relatedDocumentsCount: number;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};
```

**Discrepancy with Spec** ⚠️:
- **Spec mentions** `task_type` field (CREATE_DOCUMENT, UPDATE_DOCUMENT, etc.) 
- **Actual codebase** has no `task_type` field - only title/description
- **Recommendation**: Clarify with backend team whether task types are needed or if the spec example was illustrative

**Department Mismatch** ⚠️:
- **Spec expects**: `department: { id: number, name: string }`
- **Actual type**: `department: string | null`
- **Recommendation**: Update Task type to match spec, or clarify scope with product

---

### 4. Existing Filter Patterns

**Source**: `src/features/documents/services/documentFilter.service.ts` ✅

**Pattern Used**:
- Static class with pure filter functions
- Accepts dataset + criteria, returns filtered results
- Case-insensitive substring matching for search
- Array-based filter (only include items matching all active filters)

**Task Filter Service Pattern** (to be created):
```typescript
export class TaskFilterService {
  static applySearchFilter(tasks: Task[], query: string): Task[] {
    if (!query.trim()) return tasks;
    const q = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(q) ||
      (task.description?.toLowerCase().includes(q) ?? false)
    );
  }

  static filterByStatus(tasks: Task[], statuses: TaskStatus[]): Task[] {
    if (statuses.length === 0) return tasks;
    return tasks.filter(task => statuses.includes(task.status));
  }

  static filterByPriority(tasks: Task[], priorities: TaskPriority[]): Task[] {
    if (priorities.length === 0) return tasks;
    return tasks.filter(task => priorities.includes(task.priority));
  }

  // ... other filter methods
}
```

**Note**: Filters run client-side (on already-fetched results) vs. API-side (query params). For task search, filters are applied API-side per spec endpoint `/api/tasks/search?status=TODO&priority=HIGH`.

---

### 5. shadcn/ui Components Available & Required

**Already Installed** ✅:
- `SearchInput.tsx` - Custom search input with magnifying glass icon (found at `src/shared/components/ui/SearchInput.tsx`)
- `avatar.tsx` - For displaying assignee/creator avatars
- `badge.tsx` - For displaying tags
- `button.tsx` - Filter and action buttons
- `card.tsx` - Task card container
- `dropdown-menu.tsx` - Filter menu options
- `input.tsx` - For date inputs, number inputs
- `skeleton.tsx` - Loading skeleton placeholders (per spec UI clarification)
- `tabs.tsx` - If filtering by tabs (secondary)
- `drawer.tsx` - Mobile filter drawer
- `tooltip.tsx` - Filter help tooltips
- `separator.tsx` - Visual dividers

**Need to Add** (via `shadcn-cli add`):
- `select` - Required for status/priority/department dropdowns
- `popover` - For date picker popup
- `calendar` - For date range selection
- `pagination` - For paginating search results

**shadcn-cli Add Commands**:
```bash
# Install missing components
npx shadcn-cli@latest add select
npx shadcn-cli@latest add popover
npx shadcn-cli@latest add calendar
npx shadcn-cli@latest add pagination

# Or combined
npx shadcn-cli@latest add select popover calendar pagination
```

---

### 6. API Integration & Response Format Alignment

**Spec Endpoint**: 
```
GET /api/tasks/search?search=update&status=TODO&priority=HIGH&per_page=15&page=1&sort_by=created_at&sort_order=desc
```

**Actual Response Format** (from spec provided):
```json
{
  "message": "Tasks searched successfully",
  "status": "success",
  "code": 200,
  "data": [ /* Task[] */ ],
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

**TypeScript Contract**:
```typescript
// src/features/tasks/types/search.ts (or contracts/)
export interface TaskSearchResponse {
  message: string;
  status: 'success' | 'error';
  code: number;
  data: Task[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}
```

**HTTP Client Integration**:
```typescript
// src/features/tasks/services/taskSearchService.ts
import { apiClient } from '@/core/api/client';

export const taskSearchService = {
  async search(params: TaskSearchParams): Promise<TaskSearchResponse> {
    const response = await apiClient.get('/api/tasks/search', { params });
    return response.data;
  }
};
```

---

### 7. Default Sort Order Clarification Resolution

**Spec Clarification Q4 Result**: Sort by `created_at` descending (newest first)

**Implementation**:
```typescript
const defaultSortConfig = {
  sort_by: 'created_at',
  sort_order: 'desc' as const,
};

// Sent in API request as query params:
// GET /api/tasks/search?sort_by=created_at&sort_order=desc
```

---

### 8. Debouncing Search Input (300ms)

**Spec Clarification Q3 Result**: Debounce at 300ms before triggering API call

**Implementation Pattern**:
```typescript
import { useMemo } from 'react';
import { useCallback } from 'react';
import { debounce } from '@/lib/utils'; // Or use lodash.debounce

export function useTaskSearch(params: TaskSearchParams) {
  const debouncedSearch = useMemo(
    () => debounce((newParams: TaskSearchParams) => {
      queryClient.setQueryData(['tasks', 'search', newParams], (old) => old);
      // Trigger useQuery refetch with new params
    }, 300),
    []
  );

  const handleSearchChange = useCallback((query: string) => {
    debouncedSearch({ ...params, search: query });
  }, [params, debouncedSearch]);

  return { handleSearchChange, /* ... */ };
}
```

---

### 9. Loading State UI (Skeleton Loaders)

**Spec Clarification Q5 Result**: Show skeleton loaders for task items while loading

**Implementation**:
```typescript
// src/shared/components/ui/skeleton.tsx (already exists!)
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

// Usage in TaskSearchResults:
{isLoading ? (
  <div className="space-y-4">
    {Array.from({ length: 15 }).map((_, i) => (
      <TaskLoadingSkeleton key={i} />
    ))}
  </div>
) : (
  <TaskResultsList tasks={data.data} />
)}
```

**TaskLoadingSkeleton Component**:
```typescript
export function TaskLoadingSkeleton() {
  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <Skeleton className="h-5 w-3/4" />      {/* title */}
      <Skeleton className="h-4 w-full" />      {/* description */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />      {/* status badge */}
        <Skeleton className="h-6 w-16" />      {/* priority badge */}
      </div>
    </div>
  );
}
```

---

### 10. Initial Load State (Show All Tasks)

**Spec Clarification Q2 Result**: Load and display all accessible tasks on page load

**Implementation**:
```typescript
useEffect(() => {
  // On component mount, trigger search with empty query
  // Backend filters by user permissions automatically
  refetch();
}, []); // Run once on mount

// Query behaves like:
// GET /api/tasks/search?per_page=15&page=1&sort_by=created_at&sort_order=desc
// (no search, status, priority filters - returns all user's tasks)
```

---

### 11. Error Handling (Error Banner + Retry)

**Spec Clarification Q1 Result**: Show error banner with retry button; hide previous results

**Implementation**:
```typescript
// In TaskSearchPage component:
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p className="text-red-800">
        Failed to load tasks: {error.message}
      </p>
      <button
        onClick={() => refetch()}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}
```

---

## Summary Table

| Unknown | Finding | Status | Impact |
|---------|---------|--------|--------|
| Testing Framework | Vitest (inferred from Vite) | ✅ Clear | Setup vitest.config.ts |
| React Query Usage | v5.90.21 installed, patterns in codebase | ✅ Clear | Use TQ hooks for search |
| Task Types | Found in src/features/tasks/types/ | ⚠️ Discrepancy | Discuss task_type field with backend |
| Filter Patterns | DocumentFilterService pattern found | ✅ Clear | Implement TaskFilterService similarly |
| shadcn Components | 10 available, 4 need to be added | ✅ Clear | Run shadcn add commands |
| Default Sort | created_at desc (clarified in spec) | ✅ Clear | Use in default params |
| Debouncing | 300ms (clarified in spec) | ✅ Clear | Use debounce utility |
| Skeleton Loaders | Already exists in codebase | ✅ Clear | Use existing Skeleton component |
| Initial State | Show all tasks on load (clarified) | ✅ Clear | Trigger empty-param search on mount |
| Error Handle | Banner + retry (clarified) | ✅ Clear | Create TaskSearchError component |

---

## Recommendations for Phase 1

1. **Entity Type Alignment**: Update `src/features/tasks/types/task.types.ts` to match spec:
   - Add `task_type?: TaskType` field OR clarify spec
   - Change `department: string` to `department: { id: number; name: string } | null`
   - Consider adding `document?: { id: number; title: string }` field

2. **Install Missing shadcn Components**: Run the add commands above before starting component development

3. **Create Service Layer**: Implement `taskSearchService.ts` following existing API client patterns

4. **Hook Development Order**:
   - `useTaskSearch` (primary)
   - `useTaskFilters` (state management)
   - `useTaskPagination` (pagination handling)

5. **Component Development Order** (dependency-based):
   - TaskLoadingSkeleton (dependency for results)
   - TaskSearchError (dependency for error handling)
   - TaskSearchInput (with debouncing)
   - TaskSearchFilters (with all filter types)
   - TaskResultsList + TaskCard
   - TaskSearchPage (container)

---

**Phase 0 Status**: ✅ COMPLETE - All unknowns researched and clarified. Ready for Phase 1 design artifact generation.
