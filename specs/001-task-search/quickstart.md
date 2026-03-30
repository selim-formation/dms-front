# Quick Start Guide: Task Search with Filters

**Feature**: [001-task-search](spec.md)  
**Date**: 15 March 2026  
**Status**: Phase 1 - Integration Ready

## Overview

This quick start guide shows developers how to integrate the task search and filtering feature into the DMS frontend application.

### Feature Scope

- **Search**: Full-text search across task titles and descriptions
- **Filters**: Status, priority, task type, department, assignee, due date range
- **Pagination**: Results per page control and page navigation
- **Sorting**: Sort by created date, updated date, due date, priority, or title
- **UX**: Debounced search input (300ms), skeleton loaders, error recovery with retry

### Architecture

```
User Interaction
     ↓
TaskSearchPage (container)
├── TaskSearchInput (with 300ms debounce)
├── TaskSearchFilters (dropdowns/checkboxes)
└── TaskResults
    ├── TaskLoadingSkeleton (during fetch)
    ├── TaskSearchError (on error)
    └── TaskResultsList (task cards)
         └── TaskCard (individual task)

Behind the scenes:
└── useTaskSearch hook
    └── React Query (TanStack Query)
         └── taskSearchService.search()
              └── API: /api/tasks/search
```

---

## Installation & Setup

### 1. Install Missing shadcn/ui Components

The feature requires some additional shadcn/ui components. Install them:

```bash
cd /Users/formation/Desktop/Work/Formation/dms-front

# Install missing components (run together or separately)
npx shadcn-cli@latest add select
npx shadcn-cli@latest add popover
npx shadcn-cli@latest add calendar
npx shadcn-cli@latest add pagination
```

**Already available** (no install needed):
- button, input, card, badge, dropdown-menu, skeleton

### 2. Create Feature Directory Structure

```bash
# Directories are created automatically, but verify:
mkdir -p src/features/tasks/components/search
mkdir -p src/features/tasks/hooks
mkdir -p src/features/tasks/services
mkdir -p src/features/tasks/types
mkdir -p tests/features/tasks/unit
mkdir -p tests/features/tasks/integration
```

### 3. Update Task Types (if needed)

Check `src/features/tasks/types/task.types.ts` and ensure:

```typescript
// Add if missing:
export interface Department {
  id: number;
  name: string;
}

// Update Task interface:
export interface Task {
  // ... existing fields ...
  department: Department | null;  // Was: string | null
  document?: {                      // Add if not present
    id: number;
    title: string;
  };
}
```

---

## Component Architecture

### File Structure

```
src/features/tasks/
├── components/
│   └── search/
│       ├── TaskSearchPage.tsx       # Main page (container)
│       ├── TaskSearchInput.tsx      # Debounced input
│       ├── TaskSearchFilters.tsx    # Filter UI (status, priority, etc.)
│       ├── TaskResultsList.tsx      # Result list with pagination
│       ├── TaskCard.tsx             # Individual task display
│       ├── TaskLoadingSkeleton.tsx  # Loading state
│       └── TaskSearchError.tsx      # Error state with retry
│
├── hooks/
│   ├── useTaskSearch.ts            # Main search hook (React Query)
│   ├── useTaskFilters.ts           # Filter state management
│   └── useTaskPagination.ts        # Pagination logic
│
├── services/
│   └── taskSearchService.ts        # API calls
│
└── types/
    └── search.ts                   # Re-export contracts for convenience
```

---

## Step-by-Step Integration

### Step 1: Create the Custom Hook (useTaskSearch)

**File**: `src/features/tasks/hooks/useTaskSearch.ts`

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { taskSearchService } from '@/features/tasks/services/taskSearchService';
import type { TaskSearchParams, TaskSearchResponse } from '@/features/tasks/contracts';

export function useTaskSearch(params: TaskSearchParams) {
  return useQuery<TaskSearchResponse>({
    queryKey: ['tasks', 'search', params],
    queryFn: () => taskSearchService.search(params),
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 10,    // 10 minutes
    enabled: true,              // Always enabled (param changes trigger refetch)
  });
}
```

### Step 2: Create the Service (taskSearchService)

**File**: `src/features/tasks/services/taskSearchService.ts`

```typescript
import type { TaskSearchParams, TaskSearchResponse } from '@/features/tasks/contracts';
import { apiClient } from '@/core/api/client';

export const taskSearchService = {
  async search(params: TaskSearchParams): Promise<TaskSearchResponse> {
    // Build query parameters, filtering out undefined values
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status?.length) {
      params.status.forEach(s => queryParams.append('status', s));
    }
    if (params.priority?.length) {
      params.priority.forEach(p => queryParams.append('priority', p));
    }
    if (params.department_id) queryParams.append('department_id', String(params.department_id));
    if (params.assignee_id) queryParams.append('assignee_id', String(params.assignee_id));
    if (params.due_date_from) queryParams.append('due_date_from', params.due_date_from);
    if (params.due_date_to) queryParams.append('due_date_to', params.due_date_to);
    if (params.per_page) queryParams.append('per_page', String(params.per_page || 15));
    if (params.page) queryParams.append('page', String(params.page || 1));
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const response = await apiClient.get<TaskSearchResponse>(
      `/api/tasks/search?${queryParams.toString()}`
    );
    
    return response.data;
  },
};
```

### Step 3: Create React Components

**File**: `src/features/tasks/components/search/TaskSearchInput.tsx`

```typescript
import { useCallback, useMemo } from 'react';
import { Input } from '@/shared/components/ui/input';
import SearchInput from '@/shared/components/ui/SearchInput';
import { debounce } from 'lodash';

interface TaskSearchInputProps {
  value: string;
  onChange: (query: string) => void;
}

export function TaskSearchInput({ value, onChange }: TaskSearchInputProps) {
  const debouncedOnChange = useMemo(
    () => debounce((query: string) => onChange(query), 300),
    [onChange]
  );
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(e.target.value);
  }, [debouncedOnChange]);
  
  return (
    <SearchInput
      placeholder="Search tasks by title or description..."
      onChange={handleChange}
      defaultValue={value}
    />
  );
}
```

**File**: `src/features/tasks/components/search/TaskLoadingSkeleton.tsx`

```typescript
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function TaskLoadingSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />      {/* title */}
      <Skeleton className="h-4 w-full mb-3" />     {/* description */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />          {/* status */}
        <Skeleton className="h-6 w-16" />          {/* priority */}
      </div>
    </Card>
  );
}
```

**File**: `src/features/tasks/components/search/TaskSearchError.tsx`

```typescript
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface TaskSearchErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export function TaskSearchError({ error, onRetry }: TaskSearchErrorProps) {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div className="flex-1">
          <p className="text-red-900 font-medium">Failed to load tasks</p>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="mt-3 border-red-600 text-red-600 hover:bg-red-100"
      >
        Retry
      </Button>
    </div>
  );
}
```

---

## Integration with Page Component

**File**: `src/features/tasks/components/search/TaskSearchPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useTaskSearch } from '@/features/tasks/hooks/useTaskSearch';
import type { TaskSearchParams } from '@/features/tasks/contracts';
import { TaskSearchInput } from './TaskSearchInput';
import { TaskSearchFilters } from './TaskSearchFilters';
import { TaskResultsList } from './TaskResultsList';
import { TaskLoadingSkeleton } from './TaskLoadingSkeleton';
import { TaskSearchError } from './TaskSearchError';

const DEFAULT_PARAMS: TaskSearchParams = {
  search: '',
  status: [],
  priority: [],
  department_id: undefined,
  assignee_id: undefined,
  due_date_from: undefined,
  due_date_to: undefined,
  per_page: 15,
  page: 1,
  sort_by: 'created_at',
  sort_order: 'desc',
};

export function TaskSearchPage() {
  const [params, setParams] = useState<TaskSearchParams>(DEFAULT_PARAMS);
  const { data, isLoading, error, refetch } = useTaskSearch(params);
  
  // Load initial results on mount
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const handleSearchChange = (search: string) => {
    setParams(prev => ({ ...prev, search, page: 1 }));
  };
  
  const handleFilterChange = (newFilters: Partial<TaskSearchParams>) => {
    setParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };
  
  if (error) {
    return <TaskSearchError error={error} onRetry={() => refetch()} />;
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <TaskLoadingSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <TaskSearchInput
        value={params.search || ''}
        onChange={handleSearchChange}
      />
      
      <TaskSearchFilters
        params={params}
        onChange={handleFilterChange}
      />
      
      <TaskResultsList
        tasks={data?.data || []}
        meta={data?.meta}
        currentPage={params.page || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

---

## Testing Strategy

### Unit Test Example

**File**: `tests/features/tasks/unit/hooks/useTaskSearch.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskSearch } from '@/features/tasks/hooks/useTaskSearch';

describe('useTaskSearch', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient();
  });
  
  it('should fetch tasks with search params', async () => {
    const { result } = renderHook(
      () => useTaskSearch({ search: 'update', per_page: 15, page: 1 }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data?.meta.total).toBeGreaterThan(0);
  });
});
```

### Integration Test Example

**File**: `tests/features/tasks/integration/TaskSearchPage.test.tsx`

```typescript
import { render, screen, userEvent, waitFor } from '@testing-library/react';
import { TaskSearchPage } from '@/features/tasks/components/search/TaskSearchPage';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

describe('TaskSearchPage Integration', () => {
  const queryClient = new QueryClient();
  
  it('should search tasks when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <TaskSearchPage />
      </QueryClientProvider>
    );
    
    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'update');
    
    // Wait for debounced request (300ms + request time)
    await waitFor(() => {
      expect(screen.getByText(/update/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
```

---

## Common Patterns

### Debouncing Search Input (300ms)

Always debounce the search input to prevent excessive API calls:

```typescript
import { debounce } from 'lodash';

const handleSearchChange = debounce((query: string) => {
  setParams(prev => ({ ...prev, search: query }));
}, 300);  // 300ms delay
```

### Building Filter Params

Construct clean query objects:

```typescript
const buildParams = (filters: UIFilters): TaskSearchParams => ({
  search: filters.search || undefined,
  status: filters.statuses.length > 0 ? Array.from(filters.statuses) : undefined,
  priority: filters.priorities.length > 0 ? Array.from(filters.priorities) : undefined,
  per_page: filters.perPage,
  page: filters.currentPage,
  sort_by: filters.sortField,
  sort_order: filters.sortOrder,
});
```

### Pagination

```typescript
// Total pages
const totalPages = data?.meta.last_page || 1;

// Can go to next page?
const hasNextPage = params.page! < totalPages;

// Can go to previous page?
const hasPreviousPage = params.page! > 1;
```

---

## Troubleshooting

### Issue: Search not working (empty results)

**Causes**:
1. Debounce delay - Wait 300ms after typing stops
2. No data matching filters - Try resetting filters
3. Permission issue - User may not have access to those tasks

**Solution**:
```typescript
// Clear all filters to see all tasks
const resetSearch = () => {
  setParams(DEFAULT_PARAMS);
};
```

### Issue: Pagination buttons not showing

**Check**:
- `meta.last_page` value (should be > 1)
- `data?.meta` is actually populated from API

### Issue: Loading skeleton not showing

**Verify**:
- `isLoading` state is true during request
- Skeleton component is rendered when `isLoading === true`

---

## API Reference

### Task Search Endpoint

```
GET /api/tasks/search?search=...&status=TODO&per_page=15&page=1
```

**Parameters**: See [TaskSearchParams](contracts/search-api.ts)  
**Response**: See [TaskSearchResponse](contracts/search-api.ts)

---

## Resources

- **Feature Spec**: [spec.md](spec.md)
- **Data Model**: [data-model.md](data-model.md)
- **Research**: [research.md](research.md)
- **API Contracts**: [contracts/](contracts/)

---

**Integration Status**: ✅ READY FOR IMPLEMENTATION

Next: Run `/speckit.tasks` to generate implementation task list with dependencies and estimates.
