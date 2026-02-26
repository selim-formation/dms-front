# Tasks: Modern Tasks Page with Performance Optimization

**Feature**: 001-tasks-page-design  
**Branch**: `001-tasks-page-design`  
**Date**: 2026-02-26

**Input**: Design documents from `/specs/001-tasks-page-design/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

**Tests**: Tests are NOT required for this MVP - focus on functional implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: Always start with `- [ ]`
- **[ID]**: Sequential task ID (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3, US4) - only for user story phases
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature folder structure and initialize type definitions

- [x] T001 Create feature directory structure: src/features/tasks/ with subdirectories: api/, components/, hooks/, pages/, routes/, types/, utils/
- [x] T002 [P] Create TypeScript type definitions in src/features/tasks/types/task.types.ts (copy from contracts/types.ts)
- [x] T003 [P] Create feature index file src/features/tasks/index.ts for public exports
- [x] T004 [P] Add tasks route path to router configuration if needed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create mock task data array (25-30 diverse tasks) in src/features/tasks/api/mockData.ts covering all statuses, priorities, with/without assignees, due dates
- [x] T006 [P] Create TanStack Query key factory in src/features/tasks/api/taskKeys.ts
- [x] T007 [P] Create base API function getTasks() with 800ms delay simulation in src/features/tasks/api/taskApi.ts
- [x] T008 [P] Create utility functions for filtering tasks in src/features/tasks/utils/taskFilters.ts  
- [x] T009 [P] Create utility functions for sorting tasks in src/features/tasks/utils/taskSort.ts
- [x] T010 [P] Create date formatting utility in src/features/tasks/utils/dateFormat.ts using date-fns

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View All Tasks List (Priority: P1) 🎯 MVP

**Goal**: Users can navigate to /tasks page, see all tasks in a card grid layout with loading states, navbar at top, and empty state when no tasks exist

**Independent Test**: Navigate to /:tenant/tasks and verify tasks display in card layout with navbar, loading state appears briefly, and all task information is visible (title, status, priority, due date, assignee, document count)

### Implementation for User Story 1

- [x] T011 [P] [US1] Create useTasks custom hook in src/features/tasks/hooks/useTasks.ts using TanStack Query with 5-minute stale time
- [x] T012 [P] [US1] Create TaskCard component in src/features/tasks/components/TaskCard.tsx with React.memo, showing title, status badge, priority, due date, assignee avatar, document count
- [x] T013 [P] [US1] Create status badge color mapping in TaskCard using color palette (TODO=gray, IN_PROGRESS=blue, COMPLETED=green, BLOCKED=red)
- [x] T014 [P] [US1] Create EmptyState component in src/features/tasks/components/EmptyState.tsx for when no tasks match criteria
- [x] T015 [US1] Create TasksList component in src/features/tasks/components/TasksList.tsx with responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [x] T016 [US1] Create TasksPage main page component in src/features/tasks/pages/TasksPage.tsx integrating Navbar from @/shared/components/layout/Navbar
- [x] T017 [US1] Add loading state UI to TasksPage (show loading message or skeleton loaders)
- [x] T018 [US1] Add error state UI to TasksPage with error message display  
- [x] T019 [US1] Integrate EmptyState into TasksPage when tasks array is empty
- [x] T020 [US1] Create TanStack Router route file in src/features/tasks/routes/tasks.tsx for /$tenant/tasks path
- [x] T021 [US1] Test navigation to tasks page, verify loading state, card layout, empty state, and all task data displays correctly

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view all tasks in a card grid

---

## Phase 4: User Story 2 - Filter and Sort Tasks (Priority: P2)

**Goal**: Users can filter tasks by status and priority, sort by due date/priority/created date/title, with instant UI updates and session persistence

**Independent Test**: Apply status filter "In Progress", verify only matching tasks show; change sort to "Priority", verify tasks reorder; apply multiple filters together and verify correct results

### Implementation for User Story 2

- [x] T022 [P] [US2] Create useTaskFilters custom hook in src/features/tasks/hooks/useTaskFilters.ts managing filter state (status[], priority[], search)
- [x] T023 [P] [US2] Create TaskFilters component in src/features/tasks/components/TaskFilters.tsx with multi-select dropdowns for status and priority using Radix UI Select
- [x] T024 [P] [US2] Create TaskSort component in src/features/tasks/components/TaskSort.tsx with dropdown for sort field and direction using Radix UI Select
- [x] T025 [US2] Integrate useTaskFilters hook into TasksPage component
- [x] T026 [US2] Update useTasks hook to accept filters parameter and include in query key
- [x] T027 [US2] Add client-side filtering logic to getTasks() function in taskApi.ts (filter by status, priority arrays using OR logic)
- [x] T028 [US2] Add useMemo to TasksPage for sorting filtered tasks using sort configuration
- [x] T029 [US2] Integrate TaskFilters component into TasksPage above task grid
- [x] T030 [US2] Integrate TaskSort component into TasksPage next to filters
- [x] T031 [US2] Add useCallback for filter/sort change handlers to prevent unnecessary re-renders
- [x] T032 [US2] Test all filter combinations, verify only matching tasks display with <200ms update time
- [x] T033 [US2] Test all sort options (due date, priority, created date, title) in both asc/desc directions

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view and filter/sort tasks

---

## Phase 5: User Story 3 - Search Tasks by Title or Description (Priority: P3)

**Goal**: Users can type in search box and see tasks filtered in real-time with 300ms debouncing to prevent performance issues

**Independent Test**: Type "budget" in search box, wait 300ms, verify only tasks with "budget" in title/description show; clear search and verify all tasks return

### Implementation for User Story 3

- [ ] T034 [P] [US3] Create useTaskSearch custom hook in src/features/tasks/hooks/useTaskSearch.ts with 300ms debounce logic using setTimeout
- [ ] T035 [P] [US3] Create TaskSearch component in src/features/tasks/components/TaskSearch.tsx with input field using shadcn Input component
- [ ] T036 [US3] Integrate useTaskSearch hook into TasksPage component
- [ ] T037 [US3] Update useTaskFilters to include search string in filter state
- [ ] T038 [US3] Add search filtering logic to getTasks() function (case-insensitive substring match on title AND description)
- [ ] T039 [US3] Integrate TaskSearch component into TasksPage above filters/sort row
- [ ] T040 [US3] Update EmptyState to show "No tasks match your search" when search is active but no results
- [ ] T041 [US3] Test search with various keywords, verify 300ms debounce works, verify case-insensitive matching
- [ ] T042 [US3] Test search combined with filters, verify both work together correctly

**Checkpoint**: All filtering, sorting, and search should now work together seamlessly

---

## Phase 6: User Story 4 - View Task Details (Priority: P2)

**Goal**: Users can click any task card to open a side panel (desktop) or full-screen overlay (mobile) showing full task details without losing list context

**Independent Test**: Click a task card, verify side panel slides in from right on desktop with task details visible while list stays on left; on mobile (<768px), verify full-screen overlay appears; press escape or click close to dismiss

### Implementation for User Story 4

- [ ] T043 [P] [US4] Create TaskDetailsPanel component in src/features/tasks/components/TaskDetailsPanel.tsx using Radix UI Dialog
- [ ] T044 [P] [US4] Add responsive CSS to TaskDetailsPanel: side panel (w-96 from right) on desktop, full-screen (w-full) on mobile <768px
- [ ] T045 [P] [US4] Design TaskDetailsPanel layout showing title, full description, status, priority, due date, assignee, creator, tags, department, document count
- [ ] T046 [US4] Add selectedTaskId state to TasksPage (number | null)
- [ ] T047 [US4] Add onClick handler to TaskCard component accepting taskId parameter
- [ ] T048 [US4] Connect TaskCard onClick to setSelectedTaskId in TasksPage
- [ ] T049 [US4] Add useMemo to TasksPage to find selected task from tasks array by id
- [ ] T050 [US4] Integrate TaskDetailsPanel into TasksPage with open={!!selectedTaskId} and onOpenChange handler
- [ ] T051 [US4] Add smooth slide-in animation to side panel using CSS transitions
- [ ] T052 [US4] Add close button to TaskDetailsPanel header
- [ ] T053 [US4] Configure Dialog to close on escape key and outside click (desktop only)
- [ ] T054 [US4] Update TaskCard React.memo comparison function to include isSelected state
- [ ] T055 [US4] Test clicking task cards opens panel on desktop with list visible
- [ ] T056 [US4] Test on mobile (<768px width) panel becomes full-screen overlay
- [ ] T057 [US4] Test close button, escape key, and outside click (desktop) all dismiss panel
- [ ] T058 [US4] Verify task list does not re-render when panel opens/closes

**Checkpoint**: All user stories (1-4) are now complete and independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, accessibility, and production readiness

- [ ] T059 [P] Add React.memo to TaskCard component with custom comparison function (compare task.id and task.updatedAt)
- [ ] T060 [P] Add useMemo to TasksPage for filtered tasks computation
- [ ] T061 [P] Add useMemo to TasksPage for sorted tasks computation
- [ ] T062 [P] Add useCallback to task click handler in TasksPage
- [ ] T063 [P] Add useCallback to filter change handlers in TasksPage
- [ ] T064 [P] Add useCallback to sort change handlers in TasksPage
- [ ] T065 [P] Create LoadingSkeleton component in src/features/tasks/components/LoadingSkeleton.tsx with skeleton cards matching TaskCard layout
- [ ] T066 [P] Replace loading message with LoadingSkeleton in TasksPage
- [ ] T067 [P] Add keyboard navigation support: Tab through task cards, Enter to open details, Escape to close
- [ ] T068 [P] Add ARIA labels to TaskCard: aria-label with task title and status
- [ ] T069 [P] Add ARIA labels to filter/sort controls: aria-label describing purpose
- [ ] T070 [P] Add ARIA live region for announcing filter results count
- [ ] T071 [P] Verify all color contrasts meet WCAG AA standards using color palette
- [ ] T072 [P] Add error boundary around TasksList to catch rendering errors
- [ ] T073 [P] Add retry button to error state that refetches data
- [ ] T074 [P] Test with React DevTools Profiler to verify zero unnecessary re-renders
- [ ] T075 [P] Test with 500 mock tasks to verify 60fps scrolling performance
- [ ] T076 [P] Test responsive behavior at breakpoints: 320px, 768px, 1280px, 2560px
- [ ] T077 [P] Run linting (bun lint) and fix any warnings
- [ ] T078 [P] Verify TypeScript compilation with no errors (tsc --noEmit)

---

## Dependencies & Parallel Execution

### Critical Path (Sequential)
```
Phase 1 (Setup) → Phase 2 (Foundation) → User Stories can begin
```

### User Story Independence

All user stories (Phases 3-6) **can be worked on in parallel** after Phase 2 completes. However, there's a logical build order:

**Recommended Order**:
1. **US1 first** (P1) - Establishes basic page and card display
2. **US2 and US4 in parallel** (both P2) - Filtering and details viewing are independent
3. **US3 last** (P3) - Search builds on filtering infrastructure

**Why User Stories Are Independent**:
- US1 (View): Foundational - can work without other features
- US2 (Filter/Sort): Adds controls but doesn't break US1
- US3 (Search): Adds search box, integrates with existing filter logic  
- US4 (Details): Adds click handler and panel, doesn't affect list rendering

### Parallel Execution Opportunities

**Within Phase 2 (Foundation)**:
- T006 (Query keys) ⚡ T007 (API function) ⚡ T008 (Filter utils) ⚡ T009 (Sort utils) ⚡ T010 (Date utils)
- T005 (Mock data) must complete before T007

**Within Phase 3 (US1)**:
- T011 (Hook) ⚡ T012 (TaskCard) ⚡ T013 (Colors) ⚡ T014 (EmptyState)
- T015-T020 somewhat sequential due to integration

**Within Phase 4 (US2)**:
- T022 (useTaskFilters) ⚡ T023 (TaskFilters) ⚡ T024 (TaskSort)
- T025-T033 sequential for integration and testing

**Within Phase 5 (US3)**:
- T034 (useTaskSearch) ⚡ T035 (TaskSearch component)
- T036-T042 sequential for integration

**Within Phase 6 (US4)**:
- T043 (Panel component) ⚡ T044 (CSS) ⚡ T045 (Layout) can start together
- T046-T058 sequential for wiring and testing

**Within Phase 7 (Polish)**:
- T059-T078 can ALL run in parallel (different concerns: memoization, accessibility, testing)

---

## Implementation Strategy

### MVP Delivery (Minimal Viable Product)
**Implement Phase 1 + Phase 2 + Phase 3 (US1 only)**

This gives you:
- ✅ View all tasks in card layout
- ✅ Loading and error states  
- ✅ Empty state
- ✅ Navbar integration
- ✅ Responsive grid (mobile/tablet/desktop)

**Time Estimate**: 4-6 hours for experienced developer

### Incremental Delivery

**Sprint 1** (MVP): Phase 1-3 (US1)  
**Sprint 2**: Phase 4 (US2 - Filter/Sort)  
**Sprint 3**: Phase 6 (US4 - Details Panel)  
**Sprint 4**: Phase 5 (US3 - Search) + Phase 7 (Polish)

### Testing Strategy (Manual - No Automated Tests Required)

**After Phase 3 (US1)**:
1. Navigate to /:tenant/tasks
2. Verify loading state appears
3. Verify 25-30 tasks display in grid
4. Verify empty state with no data
5. Verify responsive design at 320px, 768px, 1280px

**After Phase 4 (US2)**:
1. Apply status filter "In Progress"
2. Apply priority filter "High"  
3. Try all sort options
4. Verify UI updates <200ms

**After Phase 5 (US3)**:
1. Type in search box
2. Verify 300ms debounce (no instant filter)
3. Verify case-insensitive matching
4. Test search + filters together

**After Phase 6 (US4)**:
1. Click task card on desktop
2. Verify side panel slides in from right
3. Verify list visible on left
4. Test on mobile - verify full-screen
5. Test escape key and close button

**After Phase 7 (Polish)**:
1. Profile with React DevTools - verify zero unnecessary re-renders
2. Test with 500 tasks - verify smooth scrolling
3. Test keyboard navigation
4. Verify WCAG AA contrast
5. Run linting and fix warnings

---

## Task Checklist Format Validation

✅ All tasks follow format: `- [ ] [ID] [P?] [Story?] Description with file path`  
✅ Task IDs are sequential (T001-T078)  
✅ [P] marker indicates parallelizable tasks (different files, no dependencies)  
✅ [Story] labels (US1-US4) present for user story phases  
✅ No [Story] label for Setup, Foundational, and Polish phases  
✅ File paths included in all implementation tasks  
✅ Each phase has clear Goal and Independent Test  
✅ Dependencies documented  
✅ Parallel execution opportunities identified

---

## Total Task Count: 78 tasks

**Breakdown by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 6 tasks ⚠️ BLOCKING
- Phase 3 (US1 - P1): 11 tasks 🎯 MVP
- Phase 4 (US2 - P2): 12 tasks
- Phase 5 (US3 - P3): 9 tasks
- Phase 6 (US4 - P2): 16 tasks
- Phase 7 (Polish): 20 tasks

**MVP Scope** (Phase 1-3): 21 tasks  
**Full Feature**: 78 tasks

**Estimated MVP Time**: 4-6 hours  
**Estimated Full Feature Time**: 12-16 hours (for experienced developer familiar with stack)

---

## Notes for Implementation

1. **Start with Phase 1-2**: These are quick and essential
2. **Focus on US1 (Phase 3) for MVP**: Get basic functionality working
3. **Parallelize US2 and US4**: Independent features after US1
4. **Add US3 and Polish last**: Nice-to-haves
5. **Use existing patterns**: Reference documents feature for API patterns, home feature for card layouts
6. **Memoization is critical**: Required for performance requirements
7. **Test continuously**: Don't wait until the end
8. **Color palette is already defined**: Use existing CSS variables via Tailwind classes

---

**Ready for Implementation! 🚀**

All tasks are clearly defined with file paths, dependencies are documented, and parallel opportunities are identified. Start with Phase 1-3 for MVP, then incrementally add remaining features.
