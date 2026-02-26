# Quick Start Guide: Tasks Page Feature

**Feature**: 001-tasks-page-design  
**Branch**: `001-tasks-page-design`  
**Date**: 2026-02-26

## Overview

This guide helps developers quickly understand and start working on the Tasks Page feature. The feature implements a modern, performant task management interface with filtering, sorting, search, and responsive detail view.

---

## Prerequisites

**Required**:
- Node.js 18+ (project uses Bun runtime)
- Git access to the repository
- Code editor with TypeScript support (VS Code recommended)
- Basic knowledge of React 19, TypeScript, and Tailwind CSS

**Helpful Context**:
- Read [spec.md](./spec.md) for full requirements
- Review [data-model.md](./data-model.md) for entity structure
- Check [research.md](./research.md) for technical decisions

---

## Quick Start (5 Minutes)

### 1. Checkout and Setup

```bash
# Ensure you're on the feature branch
git checkout 001-tasks-page-design

# Install dependencies (if not already done)
bun install

# Start development server
bun run dev
```

**Server will be available at**: `http://localhost:5173`

### 2. Navigate to Tasks Page

Once the server is running, navigate to:
- URL: `http://localhost:5173/:tenant/tasks` (replace `:tenant` with your tenant ID, e.g., `acme-corp`)
- Or add a link in the Navbar to test navigation

### 3. File Structure

The feature lives in:
```
src/features/tasks/
├── api/           # Mock data and API functions
├── components/    # React components
├── hooks/         # Custom hooks (TanStack Query, filters, search)
├── pages/         # Main TasksPage component
├── routes/        # TanStack Router configuration
├── types/         # TypeScript type definitions
└── utils/         # Helper functions (sorting, filtering)
```

---

## Development Workflow

### Step 1: Create Type Definitions

**File**: `src/features/tasks/types/task.types.ts`

Copy type definitions from [contracts/types.ts](./contracts/types.ts):

```typescript
// src/features/tasks/types/task.types.ts
export interface User {
  id: number
  name: string
  avatar: string | null
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  assignee: User | null
  creator: User
  createdAt: string
  updatedAt: string
  tags: string[]
  department: string | null
  relatedDocumentsCount: number
}

// ... (copy remaining types from contracts/types.ts)
```

### Step 2: Create Mock Data API

**File**: `src/features/tasks/api/taskApi.ts`

```typescript
import type { ApiResponse } from '@/core/api/types'
import type { Task, TaskFilters } from '../types/task.types'

// Mock data (25-30 tasks covering all statuses and priorities)
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Review Q4 Budget',
    description: 'Complete quarterly budget review and submit recommendations',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-03-15',
    assignee: { id: 1, name: 'Sarah Chen', avatar: null },
    creator: { id: 2, name: 'James Park', avatar: null },
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-25T14:30:00Z',
    tags: ['finance', 'quarterly'],
    department: 'Finance',
    relatedDocumentsCount: 3,
  },
  // Add 24-29 more diverse tasks here
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getTasks(
  _tenant: string,
  filters: TaskFilters
): Promise<ApiResponse<Task[]>> {
  await delay(800) // Simulate network latency
  
  let results = [...MOCK_TASKS]
  
  // Apply filters
  if (filters.status.length > 0) {
    results = results.filter((t) => filters.status.includes(t.status))
  }
  if (filters.priority.length > 0) {
    results = results.filter((t) => filters.priority.includes(t.priority))
  }
  if (filters.search) {
    const query = filters.search.toLowerCase()
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
    )
  }
  
  return { data: results, success: true }
}
```

**File**: `src/features/tasks/api/taskKeys.ts`

```typescript
import type { TaskFilters } from '../types/task.types'

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), { filters }] as const,
}
```

### Step 3: Create TanStack Query Hook

**File**: `src/features/tasks/hooks/useTasks.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/taskApi'
import { taskKeys } from '../api/taskKeys'
import type { TaskFilters } from '../types/task.types'

export function useTasks(tenant: string, filters: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(tenant, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

### Step 4: Create Task Card Component

**File**: `src/features/tasks/components/TaskCard.tsx`

```typescript
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Calendar, FileText } from 'lucide-react'
import { format } from 'date-fns'
import type { Task } from '../types/task.types'

interface TaskCardProps {
  task: Task
  onClick: (taskId: number) => void
}

export const TaskCard = React.memo<TaskCardProps>(
  ({ task, onClick }) => {
    const statusColors = {
      TODO: 'bg-gray-100 text-gray-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      COMPLETED: 'bg-green-100 text-green-700',
      BLOCKED: 'bg-red-100 text-red-700',
    }

    return (
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onClick(task.id)}
      >
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <Badge className={statusColors[task.status]}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              </div>
            )}
            {task.assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignee.name}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <Badge variant="outline">{task.priority}</Badge>
              {task.relatedDocumentsCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{task.relatedDocumentsCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
  (prev, next) => prev.task.id === next.task.id && prev.task.updatedAt === next.task.updatedAt
)

TaskCard.displayName = 'TaskCard'
```

### Step 5: Create Main Tasks Page

**File**: `src/features/tasks/pages/TasksPage.tsx`

```typescript
import { useState, useMemo } from 'react'
import { useTenant } from '@/core/tenant/hooks/useTenant'
import Navbar from '@/shared/components/layout/Navbar'
import { TaskCard } from '../components/TaskCard'
import { useTasks } from '../hooks/useTasks'
import type { TaskFilters } from '../types/task.types'

export default function TasksPage() {
  const tenant = useTenant()
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    search: '',
  })
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  const { data, isLoading, error } = useTasks(tenant, filters)

  const tasks = useMemo(() => data?.data || [], [data])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading tasks...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading tasks. Please try again.
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tasks</h1>
        
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No tasks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={setSelectedTaskId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

### Step 6: Create Route

**File**: `src/features/tasks/routes/tasks.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import TasksPage from '../pages/TasksPage'

export const Route = createFileRoute('/$tenant/tasks')({
  component: TasksPage,
})
```

---

## Testing Your Changes

### Manual Testing Checklist

1. **Page Loads**:
   - ✅ Navigate to `/acme-corp/tasks`
   - ✅ See loading state briefly
   - ✅ Tasks display in grid layout

2. **Responsive Design**:
   - ✅ Mobile (< 768px): 1 column
   - ✅ Tablet (768px-1280px): 2 columns
   - ✅ Desktop (> 1280px): 3 columns

3. **Task Cards**:
   - ✅ Title displays correctly
   - ✅ Status badge shows with correct color
   - ✅ Due date formats properly
   - ✅ Assignee avatar/name displays
   - ✅ Priority badge shows
   - ✅ Document count shows (if > 0)

4. **Empty State** (filter all tasks out):
   - ✅ "No tasks found" message displays

### Running Tests

```bash
# Run unit tests
bun test

# Run specific test file
bun test src/features/tasks/components/TaskCard.test.tsx

# Watch mode
bun test --watch
```

---

## Next Steps

### Priority 1 (Must Have for MVP):
1. ✅ Basic task list display
2. ⬜ Filter controls (status, priority)
3. ⬜ Sort controls (by date, priority, title)
4. ⬜ Search input with debouncing
5. ⬜ Task details side panel
6. ⬜ Responsive side panel (full-screen on mobile)
7. ⬜ Loading states (skeleton loaders)
8. ⬜ Error handling

### Priority 2 (Nice to Have):
9. ⬜ Empty state with helpful message
10. ⬜ Performance optimization (memoization)
11. ⬜ Accessibility (keyboard navigation, ARIA labels)
12. ⬜ Animation polish (smooth transitions)

### Priority 3 (Future):
13. ⬜ URL state persistence
14. ⬜ Pagination (>500 tasks)
15. ⬜ Virtual scrolling (>1000 tasks)

---

## Common Issues & Solutions

### Issue: Tasks not loading
**Solution**: Check that `useTenant()` hook returns valid tenant ID. Verify mock data in `taskApi.ts`.

### Issue: TanStack Query not found
**Solution**: Ensure `@tanstack/react-query` is installed and `QueryClientProvider` wraps the app in `AppProviders.tsx`.

### Issue: Types not resolving
**Solution**: Check `tsconfig.json` has correct path alias: `"@/*": ["./src/*"]`

### Issue: Navbar not showing
**Solution**: Verify import path: `import Navbar from '@/shared/components/layout/Navbar'`

### Issue: Tailwind classes not working
**Solution**: Run `bun run dev` to start Tailwind watcher. Check `tailwind.config.js` includes tasks directory.

---

## Performance Tips

1. **Memoization**:
   - Use `React.memo` for TaskCard (already implemented above)
   - Use `useMemo` for filtered/sorted lists
   - Use `useCallback` for event handlers passed to cards

2. **Query Optimization**:
   - TanStack Query handles caching automatically
   - Adjust `staleTime` if data changes frequently
   - Use query invalidation after mutations (future)

3. **Bundle Size**:
   - All dependencies already in project (no new ones needed)
   - Tree-shaking handles unused exports

---

## Resources

**Internal Documentation**:
- [Feature Spec](./spec.md) - Full requirements
- [Data Model](./data-model.md) - Entity definitions
- [Research](./research.md) - Technical decisions
- [API Spec](./contracts/api-spec.md) - API contract

**External Documentation**:
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)

**Existing Examples**:
- Documents feature: `src/features/documents/` (similar patterns)
- Home feature: `src/features/home/` (Navbar usage, card layouts)

---

## Getting Help

1. **Check existing features** for patterns (documents, home)
2. **Review research.md** for technical decisions context
3. **Read spec.md** for requirement clarifications
4. **Check contracts/** for API interfaces

---

## Deployment Checklist (Future)

When ready to merge:

- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Responsive design verified (320px-2560px)
- ✅ Accessibility checked (keyboard nav, screen reader)
- ✅ Performance profiled (no unnecessary re-renders)
- ✅ Code reviewed by team
- ✅ Feature branch rebased on main
- ✅ Changeset/changelog updated

---

**Happy Coding! 🚀**

For questions or issues, check the [spec.md](./spec.md) or review existing feature implementations.
