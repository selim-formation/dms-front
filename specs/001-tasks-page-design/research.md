# Research: Modern Tasks Page with Performance Optimization

**Feature**: 001-tasks-page-design  
**Date**: 2026-02-26  
**Status**: Complete

## Overview

This document consolidates research findings and technical decisions for implementing the Tasks Page feature. All technical unknowns from the Technical Context have been resolved through analysis of the existing codebase patterns.

---

## Research Areas

### 1. Data Fetching Strategy (TanStack Query)

**Decision**: Use TanStack Query 5.90 with query keys pattern

**Rationale**:
- Already established pattern in the project (see `documents/api/documentKeys.ts`)
- Provides automatic caching, background refetching, and stale data management
- Built-in loading and error states reduce boilerplate
- DevTools available for debugging query state

**Implementation Pattern** (from existing codebase):
```typescript
// taskKeys.ts - Query key factory
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
}

// useTasks.ts - Query hook
export function useTasks(tenant: string, filters: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(tenant, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

**Alternatives Considered**:
- Direct useState + useEffect: Rejected - too much boilerplate, no caching
- SWR library: Rejected - TanStack Query already established in project

---

### 2. Component Memoization Strategy

**Decision**: Use React.memo for list items, useMemo for derived data, useCallback for event handlers passed to children

**Rationale**:
- Prevents unnecessary re-renders when filter/sort state changes
- Task cards render independently - only affected cards re-render on data changes
- Meets spec requirement of "zero unnecessary re-renders"
- Aligns with React 19 rendering model

**Implementation Pattern**:
```typescript
// TaskCard.tsx - Memoized card component
export const TaskCard = React.memo<TaskCardProps>(({ task, onClick }) => {
  return (/* ... */)
}, (prevProps, nextProps) => {
  // Custom comparison - re-render only if task data or selected state changes
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.updated_at === nextProps.task.updated_at &&
         prevProps.isSelected === nextProps.isSelected
})

// TasksPage.tsx - Memoized callbacks
const handleTaskClick = useCallback((taskId: number) => {
  setSelectedTaskId(taskId)
}, [])

// Memoized filtered/sorted data
const processedTasks = useMemo(() => {
  return sortTasks(filterTasks(tasks, filters), sortConfig)
}, [tasks, filters, sortConfig])
```

**Alternatives Considered**:
- Virtual scrolling (react-window): Deferred - spec allows 500 tasks without virtualization
- No memoization: Rejected - would fail zero re-render requirement

---

### 3. Search Debouncing Implementation

**Decision**: Custom hook with useDebounce pattern (300ms delay as specified)

**Rationale**:
- Prevents excessive API calls/filtering on each keystroke
- 300ms delay specified in requirements (FR-011)
- Lightweight solution not requiring additional libraries
- Pattern can be reused across features

**Implementation Pattern**:
```typescript
// useTaskSearch.ts
export function useTaskSearch(initialValue = '', delay = 300) {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return [value, debouncedValue, setValue] as const
}

// Usage in TasksPage
const [searchInput, debouncedSearch, setSearchInput] = useTaskSearch('', 300)
// Filter with debouncedSearch, display searchInput in input field
```

**Alternatives Considered**:
- Lodash debounce: Rejected - adds dependency for simple functionality
- Server-side search: Not applicable - using mock data

---

### 4. Responsive Side Panel Implementation

**Decision**: Radix UI Dialog with conditional rendering based on viewport width

**Rationale**:
- Radix UI already in use (shadcn/ui foundation)
- Built-in accessibility (focus trap, escape key, ARIA attributes)
- CSS-based responsive behavior using Tailwind breakpoints
- Side panel on desktop (≥768px), full-screen overlay on mobile (<768px)

**Implementation Pattern**:
```typescript
// TaskDetailsPanel.tsx using Radix Dialog
<Dialog open={!!selectedTaskId} onOpenChange={() => setSelectedTaskId(null)}>
  <DialogContent className="
    fixed right-0 top-0 h-full
    w-full md:w-96 
    transform transition-transform
    bg-surface
  ">
    {/* Task details content */}
  </DialogContent>
</Dialog>

// Tailwind classes handle responsive behavior:
// - Mobile (<768px): w-full = full-screen overlay
// - Desktop (≥768px): w-96 right-0 = side panel from right
```

**Alternatives Considered**:
- Custom modal implementation: Rejected - lacks accessibility features
- Bottom sheet on mobile: Rejected - clarification confirmed full-screen overlay

---

### 5. Mock Data Structure

**Decision**: JSON array in API file with delay simulation (800ms), following documents feature pattern

**Rationale**:
- Matches existing pattern in `documents/api/documentApi.ts`
- Simulates realistic network latency for testing loading states
- Easy to expand/modify during development
- Clear migration path to real API (replace functions, keep interfaces)

**Implementation Pattern**:
```typescript
// taskApi.ts
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Review Q4 Budget',
    description: 'Complete quarterly budget review...',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-03-15',
    assignee: { id: 1, name: 'Sarah Chen', avatar: null },
    creator: { id: 2, name: 'James Park' },
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-25T14:30:00Z',
    tags: ['finance', 'quarterly'],
    department: 'Finance',
    relatedDocumentsCount: 3,
  },
  // ... 25-30 diverse task examples
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getTasks(tenant: string, filters: TaskFilters): Promise<ApiResponse<Task[]>> {
  await delay(800) // Simulate network latency
  
  let results = [...MOCK_TASKS]
  // Apply filtering logic
  return { data: results, success: true }
}
```

**Alternatives Considered**:
- MSW (Mock Service Worker): Deferred - overkill for simple mock data
- Separate JSON file: Rejected - adds import complexity, inline is clearer

---

### 6. Filter and Sort State Management

**Decision**: useState for local UI state, URL params deferred to later iteration

**Rationale**:
- Simple solution for MVP - no URL persistence needed yet
- Filter/sort state lives in TasksPage component
- Easy to lift to URL params later if needed
- Avoids premature complexity

**Implementation Pattern**:
```typescript
// TasksPage.tsx
const [filters, setFilters] = useState<TaskFilters>({
  status: [],
  priority: [],
  search: '',
})

const [sortConfig, setSortConfig] = useState<SortConfig>({
  field: 'dueDate',
  direction: 'asc',
})

// Pass to useTasks hook which includes in query key
const { data, isLoading, error } = useTasks(tenant, filters)

// Client-side sort after fetch (with memoization)
const sortedTasks = useMemo(() => sortTasks(data, sortConfig), [data, sortConfig])
```

**Alternatives Considered**:
- URL state with TanStack Router: Deferred - not required for MVP
- Global state (Zustand/Redux): Rejected - unnecessary for page-local state

---

### 7. Color Palette Integration

**Decision**: Use CSS variables from existing color-palette.json system via Tailwind classes

**Rationale**:
- System already established in `/src/config/color-palette.json`
- CSS variables exposed via `/src/styles/colors.css`
- Tailwind config maps to these variables (tailwind.colors.config.js)
- WCAG AA compliant colors already validated

**Status Colors** (from palette):
```typescript
// Map task status to color classes
const statusColors = {
  'To Do': 'bg-gray-100 text-gray-700 border-gray-300',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-300', // primary
  'Completed': 'bg-green-100 text-green-700 border-green-300', // success
  'Blocked': 'bg-red-100 text-red-700 border-red-300', // danger
}

// Priority colors
const priorityColors = {
  'Low': 'text-gray-600',
  'Medium': 'text-yellow-600', // warning
  'High': 'text-orange-600', // warning-dark
  'Urgent': 'text-red-600', // danger
}
```

**Alternatives Considered**:
- Inline hex colors: Rejected - violates design system consistency
- New color definitions: Rejected - palette is comprehensive

---

### 8. Card Layout Design

**Decision**: CSS Grid with responsive columns (1 col mobile, 2 cols tablet, 3 cols desktop)

**Rationale**:
- Confirmed via clarification: card layout chosen over table
- Grid provides consistent spacing and alignment
- Auto-fills based on viewport width
- Cards show: title, status badge, priority indicator, due date, assignee avatar

**Implementation Pattern**:
```typescript
// TasksList.tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {tasks.map(task => (
    <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
  ))}
</div>

// TaskCard.tsx structure
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <CardHeader>
    <div className="flex justify-between items-start">
      <CardTitle>{task.title}</CardTitle>
      <Badge>{task.status}</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(task.dueDate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar>{task.assignee.name}</Avatar>
        <span>{task.assignee.name}</span>
      </div>
      <div className="flex justify-between">
        <PriorityBadge priority={task.priority} />
        {task.relatedDocumentsCount > 0 && (
          <span>{task.relatedDocumentsCount} docs</span>
        )}
      </div>
    </div>
  </CardContent>
</Card>
```

**Alternatives Considered**:
- Flexbox layout: Rejected - Grid better for equal-width cards
- Single column with dividers: Rejected - less information density

---

## Summary of Technical Decisions

| Aspect | Decision | Library/Pattern |
|--------|----------|-----------------|
| Data Fetching | TanStack Query with query keys | `@tanstack/react-query` |
| Memoization | React.memo + useMemo + useCallback | React 19 built-in |
| Search Debounce | Custom hook with setTimeout | Native JavaScript |
| Side Panel | Radix Dialog with responsive CSS | `@radix-ui/react-dialog` |
| Mock Data | Inline array with delay simulation | TypeScript |
| State Management | useState (local) | React built-in |
| Colors | CSS variables via Tailwind | Existing system |
| Layout | CSS Grid with responsive columns | Tailwind CSS |
| Icons | Lucide React | `lucide-react` (existing) |
| Date Formatting | date-fns | `date-fns` (existing) |

---

## Performance Optimization Checklist

- ✅ TanStack Query caching (5min stale time)
- ✅ React.memo for TaskCard components
- ✅ useMemo for filtered/sorted task lists
- ✅ useCallback for event handlers
- ✅ Debounced search (300ms)
- ✅ Lazy loading side panel content
- ✅ CSS-based animations (no JavaScript)
- ✅ Optimized re-render detection (custom comparison function)

---

## Migration Path to Real API

**When moving from mock to real API**:

1. Replace mock functions in `taskApi.ts` with axios calls
2. Update base URL to use `@/core/api/client.ts` configured client
3. Keep TypeScript interfaces unchanged
4. Adjust query staleTime/cacheTime based on real data freshness needs
5. Add error boundary for API failures
6. Consider pagination if >500 tasks expected

**No changes needed**:
- TanStack Query hooks
- Component structure
- Type definitions
- UI components

---

## Open Questions / Future Enhancements

**Deferred to future iterations** (explicitly out of scope for MVP):

- Task creation/editing/deletion (MVP is read-only per assumptions)
- Direct document linking (showing count only per clarification)
- URL state persistence for filters/sorts
- Virtual scrolling for >500 tasks
- Real-time updates (WebSocket)
- Bulk actions (multi-select)
- Task comments/activity feed
- File attachments
- Notification system

**No blockers identified** - all technical unknowns resolved
