# Tasks: Task Search with Filters

**Input**: Design documents from `/specs/001-task-search/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅  
**Branch**: `001-task-search`  
**Date**: 15 March 2026

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story ID (US1, US2, etc.) - foundational tasks have no story label
- Include exact file paths in descriptions

---

## Phase 1: Setup & Project Initialization

**Purpose**: Initialize project structure and create contracts/types

- [x] T001 Create contracts types file at `src/features/tasks/contracts/index.ts` re-exporting from search-api
- [x] T002 [P] Create TaskSearchService interface in `src/features/tasks/services/taskSearchService.ts`
- [x] T003 [P] Create custom hooks directory structure at `src/features/tasks/hooks/`
- [x] T004 [P] Create search components directory at `src/features/tasks/components/search/`

**Checkpoint**: Project structure ready for integration work

---

## Phase 2: Foundational Infrastructure (Blocking Prerequisites)

**Purpose**: Core integrations that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement TaskSearchService API integration in `src/features/tasks/services/taskSearchService.ts` - must support all query parameters from spec (search, filters, pagination, sorting)
- [x] T006 Create `useTaskSearch` custom hook in `src/features/tasks/hooks/useTaskSearch.ts` - wraps React Query for task search API calls with caching
- [x] T007 [P] Install missing shadcn/ui components: select, popover, calendar, pagination
- [ ] T008 [P] Update Task types in `src/features/tasks/types/task.types.ts` - add document field and Department object type (vs string)
- [x] T009 Create TaskFilterService in `src/features/tasks/services/taskFilterService.ts` - utility functions for filter serialization
- [ ] T010 Create `useTaskFilters` custom hook in `src/features/tasks/hooks/useTaskFilters.ts` - manages filter state and conversions
- [x] T011 Create `useTaskPagination` custom hook in `src/features/tasks/hooks/useTaskPagination.ts` - manages page tracking and navigation

**Checkpoint**: Foundation ready - user stories can now be implemented in parallel

---

## Phase 3: User Story 1 - Basic Text Search (Priority: P1) 🎯 MVP

**Goal**: Enable users to search tasks by keywords in title and description with debounced input

**Independent Test**: User can type "update" in search field, see loading skeleton, then results containing "update" display within 2 seconds

### Tests for User Story 1

- [ ] T012 [P] [US1] Create unit test for TaskSearchInput debouncing at `tests/features/tasks/unit/components/TaskSearchInput.test.tsx` - verify 300ms debounce delay before onChange trigger
- [ ] T013 [P] [US1] Create integration test for text search in `tests/features/tasks/integration/TaskSearchPage.search.test.tsx` - user types, waits for debounce, verifies results contain search term

### Implementation for User Story 1

- [x] T014 [P] [US1] Create TaskLoadingSkeleton component at `src/features/tasks/components/search/TaskLoadingSkeleton.tsx` - skeleton loader for task cards during initial load and search
- [x] T015 [P] [US1] Create TaskSearchInput component at `src/features/tasks/components/search/TaskSearchInput.tsx` - debounced search input with 300ms delay per spec clarification
- [x] T016 [US1] Create TaskSearchError component at `src/features/tasks/components/search/TaskSearchError.tsx` - error banner with retry button per spec clarification
- [x] T017 [P] [US1] Create TaskCard component at `src/features/tasks/components/search/TaskCard.tsx` - displays single task with title, description, status badge, priority badge, assignee, due date
- [x] T018 [US1] Create TaskResultsList component at `src/features/tasks/components/search/TaskResultsList.tsx` - renders list of TaskCards with proper spacing and layout (depends on T017)
- [x] T019 [P] [US1] Create TaskSearchPage container component at `src/features/tasks/components/search/TaskSearchPage.tsx` - orchestrates search, filters, and results display
- [ ] T020 [US1] Integrate TaskSearchPage into router at appropriate route (document exact route path) - add navigation link
- [ ] T021 [US1] Add search highlighting - highlight matching search term in results (optional enhancement, can defer)

**Checkpoint**: User Story 1 complete - basic text search fully functional and independently testable

**MVP Deliverable**: User can search tasks by keyword and see results with status/priority badges

---

## Phase 4: User Story 2 - Filter by Status and Priority (Priority: P1)

**Goal**: Enable users to filter tasks by status (TODO, IN_PROGRESS, COMPLETED, BLOCKED) and priority (LOW, MEDIUM, HIGH, URGENT)

**Independent Test**: User can select status "TODO" and priority "HIGH", see only matching tasks. Clearing filters shows all tasks again.

### Tests for User Story 2

- [ ] T022 [P] [US2] Create unit test for status filter at `tests/features/tasks/unit/hooks/useTaskFilters.test.tsx` - verify filter state updates when status selected
- [ ] T023 [P] [US2] Create unit test for priority filter at `tests/features/tasks/unit/services/taskFilterService.test.ts` - verify filter serialization for API params
- [ ] T024 [US2] Create integration test for combined status+priority filter at `tests/features/tasks/integration/TaskSearchPage.filters.test.tsx` - select both filters, verify AND logic (only tasks matching both appear)

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create TaskStatusFilter sub-component at `src/features/tasks/components/search/filters/TaskStatusFilter.tsx` - checkboxes for TODO, IN_PROGRESS, COMPLETED, BLOCKED status values
- [ ] T026 [P] [US2] Create TaskPriorityFilter sub-component at `src/features/tasks/components/search/filters/TaskPriorityFilter.tsx` - checkboxes for LOW, MEDIUM, HIGH, URGENT priority values  
- [ ] T027 [P] [US2] Create TaskSearchFilters container at `src/features/tasks/components/search/TaskSearchFilters.tsx` - combines status and priority filters with clear/apply buttons (uses T025, T026)
- [ ] T028 [US2] Add filter badge display in TaskCard at `src/features/tasks/components/search/TaskCard.tsx` - show status and priority as colored badges (update existing from T017)
- [ ] T029 [US2] Update useTaskSearch hook to handle status/priority arrays in params (update existing from T006)
- [ ] T030 [US2] Add clear filters functionality at `src/features/tasks/components/search/TaskSearchPage.tsx` - reset button returns all filters to empty state (update existing from T019)

**Checkpoint**: User Story 2 complete - status and priority filtering working with AND logic

---

## Phase 5: User Story 3 - Pagination and Results Control (Priority: P1)

**Goal**: Enable users to navigate result pages and control results-per-page (1-100, default 15)

**Independent Test**: Search returns 45 results (3 pages × 15 per page). User navigates to page 2 and 3. Per-page dropdown changes results to 20 per page (showing 2 pages + partial 3rd).

### Tests for User Story 3

- [ ] T031 [P] [US3] Create unit test for useTaskPagination at `tests/features/tasks/unit/hooks/useTaskPagination.test.ts` - verify page state updates, can't go beyond last page
- [ ] T032 [P] [US3] Create unit test for pagination metadata at `tests/features/tasks/unit/components/TaskPagination.test.tsx` - verify from/to/total display correctly
- [ ] T033 [US3] Create integration test for pagination flow at `tests/features/tasks/integration/TaskSearchPage.pagination.test.tsx` - navigate pages, change per_page, verify results update

### Implementation for User Story 3

- [ ] T034 [P] [US3] Create TaskPagination sub-component at `src/features/tasks/components/search/pagination/TaskPagination.tsx` - page navigation buttons (prev, current page, next) with page count display
- [ ] T035 [P] [US3] Create PerPageSelector sub-component at `src/features/tasks/components/search/pagination/PerPageSelector.tsx` - dropdown: 15, 20, 25, 50 per page options
- [ ] T036 [US3] Create TaskPaginationContainer at `src/features/tasks/components/search/pagination/TaskPaginationContainer.tsx` - combines pagination controls with "Results X-Y of Z" display (uses T034, T035)
- [ ] T037 [P] [US3] Use shadcn Pagination component at `src/shared/components/ui/pagination.tsx` - for page navigation UI
- [ ] T038 [US3] Integrate pagination container into TaskResultsList at `src/features/tasks/components/search/TaskResultsList.tsx` - add pagination controls below results (update existing from T018)
- [ ] T039 [P] [US3] Update TaskSearchPage to manage page and per_page state at `src/features/tasks/components/search/TaskSearchPage.tsx` - reset page to 1 when search/filters change (update existing from T019)
- [ ] T040 [US3] Handle edge cases - invalid page numbers revert to last_page, per_page validation (1-100) at `src/features/tasks/services/taskSearchService.ts` (update existing from T005)

**Checkpoint**: User Story 3 complete - full pagination working, page resets on filter change, per-page control functional

**MVP Complete**: Stories 1-3 deliver core search functionality with text search, status/priority filters, and pagination

---

## Phase 6: User Story 4 - Filter by Task Type (Priority: P2)

**Goal**: Enable users to filter tasks by type (CREATE_DOCUMENT, UPDATE_DOCUMENT, REVIEW_DOCUMENT, etc.)

**Independent Test**: User selects task_type "CREATE_DOCUMENT", sees only tasks with that type. Works independently and in combination with other filters.

### Tests for User Story 4

- [ ] T041 [P] [US4] Create unit test for task type filter at `tests/features/tasks/unit/components/filters/TaskTypeFilter.test.tsx` - verify task type values and selection

### Implementation for User Story 4

- [ ] T042 [US4] Confirm task_type field in Task type definition - verify backend returns task_type and update type if needed in `src/features/tasks/types/task.types.ts` (coordinate with backend)
- [ ] T043 [P] [US4] Create TaskTypeFilter component at `src/features/tasks/components/search/filters/TaskTypeFilter.tsx` - checkbox/dropdown for task types (values: CREATE_DOCUMENT, UPDATE_DOCUMENT, REVIEW_DOCUMENT, etc.)
- [ ] T044 [US4] Add TaskTypeFilter to TaskSearchFilters at `src/features/tasks/components/search/TaskSearchFilters.tsx` - integrate into existing filters section (update existing from T027)
- [ ] T045 [P] [US4] Display task type in TaskCard at `src/features/tasks/components/search/TaskCard.tsx` - show as badge or tag (update existing from T017, T028)

**Checkpoint**: User Story 4 complete - task type filtering functional

---

## Phase 7: User Story 5 - Filter by Assignee and Department (Priority: P2)

**Goal**: Enable users to filter tasks by assigned user and their department

**Independent Test**: User selects assignee "John Doe", sees only John's tasks. User selects department "Engineering", sees only Engineering dept tasks. Both combined shows intersection.

### Tests for User Story 5

- [ ] T046 [P] [US5] Create unit test for assignee filter at `tests/features/tasks/unit/components/filters/AssigneeFilter.test.tsx` - fetch and display user list
- [ ] T047 [P] [US5] Create unit test for department filter at `tests/features/tasks/unit/components/filters/DepartmentFilter.test.tsx` - fetch and display departments
- [ ] T048 [US5] Create integration test for assignee+department combo at `tests/features/tasks/integration/TaskSearchPage.filters.test.tsx` - select both, verify AND logic

### Implementation for User Story 5

- [ ] T049 [P] [US5] Create AssigneeFilter component at `src/features/tasks/components/search/filters/AssigneeFilter.tsx` - dropdown/multi-select of available users with search, async load users from API if needed
- [ ] T050 [P] [US5] Create DepartmentFilter component at `src/features/tasks/components/search/filters/DepartmentFilter.tsx` - dropdown/checkboxes of available departments, async load from API
- [ ] T051 [US5] Add AssigneeFilter and DepartmentFilter to TaskSearchFilters at `src/features/tasks/components/search/TaskSearchFilters.tsx` (update existing from T027, T044)
- [ ] T052 [P] [US5] Display assignee in TaskCard at `src/features/tasks/components/search/TaskCard.tsx` - show assignee name/avatar (update existing from T017)
- [ ] T053 [P] [US5] Display department badge in TaskCard at `src/features/tasks/components/search/TaskCard.tsx` - show department name (update existing from T017)
- [ ] T054 [US5] Create API service function to fetch users for assignee dropdown at `src/features/tasks/services/userService.ts` - new file for user/department lists

**Checkpoint**: User Story 5 complete - assignee and department filtering functional

---

## Phase 8: User Story 6 - Filter by Due Date Range (Priority: P2)

**Goal**: Enable users to filter tasks by due date range (from/to dates)

**Independent Test**: User selects due_date_from "2026-03-15" and due_date_to "2026-04-15", sees only tasks with due dates in range. Range is inclusive (tasks due exactly on start/end dates included).

### Tests for User Story 6

- [ ] T055 [P] [US6] Create unit test for date range selection at `tests/features/tasks/unit/components/filters/DueDateRangeFilter.test.tsx` - verify date validation, from <= to
- [ ] T056 [US6] Create integration test for date filtering at `tests/features/tasks/integration/TaskSearchPage.filters.test.tsx` - select date range, verify results in range

### Implementation for User Story 6

- [ ] T057 [P] [US6] Create DueDateRangeFilter component at `src/features/tasks/components/search/filters/DueDateRangeFilter.tsx` - uses shadcn calendar popover to select from/to dates, validate from <= to
- [ ] T058 [US6] Add DueDateRangeFilter to TaskSearchFilters at `src/features/tasks/components/search/TaskSearchFilters.tsx` (update existing from T027, T044, T051)
- [ ] T059 [P] [US6] Display due date in TaskCard at `src/features/tasks/components/search/TaskCard.tsx` - show formatted date, highlight if overdue (update existing from T017)
- [ ] T060 [US6] Add date validation to TaskSearchService - reject invalid date formats at `src/features/tasks/services/taskSearchService.ts` (update existing from T005)

**Checkpoint**: User Story 6 complete - due date range filtering functional

---

## Phase 9: User Story 7 - Sorting Results (Priority: P2)

**Goal**: Enable users to sort results by different fields (created_at, updated_at, due_date, priority, title) and direction (asc/desc)

**Independent Test**: User sorts by created_at descending (newest first), sees newest tasks first. Switch to ascending shows oldest first. Sort persists when filters change.

### Tests for User Story 7

- [ ] T061 [P] [US7] Create unit test for sort controls at `tests/features/tasks/unit/components/TaskSortControl.test.tsx` - verify sort field and direction selection
- [ ] T062 [US7] Create integration test for sort persistence at `tests/features/tasks/integration/TaskSearchPage.sorting.test.tsx` - sort, then filter, verify sort maintained

### Implementation for User Story 7

- [ ] T063 [P] [US7] Create TaskSortControl component at `src/features/tasks/components/search/TaskSortControl.tsx` - dropdown for sort field (created_at, updated_at, due_date, priority, title) + toggle for asc/desc
- [ ] T064 [US7] Add TaskSortControl to TaskSearchFilters at `src/features/tasks/components/search/TaskSearchFilters.tsx` - integrate sort controls (update existing from T027, T044, T051, T058)
- [ ] T065 [P] [US7] Update default sort per spec clarification - created_at descending (newest first) as default in `src/features/tasks/hooks/useTaskSearch.ts` (update existing from T006)
- [ ] T066 [US7] Update TaskResultsList to include sort status display at `src/features/tasks/components/search/TaskResultsList.tsx` - show "Sorted by X (asc/desc)" indicator (update existing from T018)

**Checkpoint**: User Story 7 complete - sorting functional with persistence

---

## Phase 10: User Story 8 - Combined Search and Filters (Priority: P3)

**Goal**: Ensure all filters work correctly together with AND logic

**Independent Test**: User enters search term AND selects status AND priority AND assignee AND date range - only tasks matching ALL criteria appear (not OR).

### Tests for User Story 8

- [ ] T067 [US8] Create comprehensive integration test for combined filters at `tests/features/tasks/integration/TaskSearchPage.combined.test.tsx` - 3+ filters active simultaneously, verify AND logic, not OR
- [ ] T068 [US8] Create edge case tests: empty search with filters, all filters cleared, only search term at `tests/features/tasks/integration/TaskSearchPage.edgeCases.test.tsx`

### Implementation for User Story 8

- [ ] T069 [US8] Verify TaskSearchService builds correct query params for all combinations at `src/features/tasks/services/taskSearchService.ts` - no special handling needed if foundation is correct (verify from T005)
- [ ] T070 [US8] Add "Clear All Filters" button for convenience at `src/features/tasks/components/search/TaskSearchFilters.tsx` - resets all filters and search in one action (update existing from T027)
- [ ] T071 [US8] Add active filters display/summary at `src/features/tasks/components/search/TaskSearchPage.tsx` - show "X filters active" with list of active filters and quick clear (update existing from T019)
- [ ] T072 [US8] Display result count and matching criteria at `src/features/tasks/components/search/TaskResultsList.tsx` - e.g., "Found 5 tasks matching: status=TODO, priority=HIGH" (update existing from T018)

**Checkpoint**: User Story 8 complete - combined filters work with AND logic

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, accessibility, performance, documentation

- [ ] T073 [P] Add error boundary for TaskSearchPage at `src/features/tasks/components/search/TaskSearchPage.tsx` - gracefully handle component errors
- [ ] T074 [P] Add loading state management for async operations - skeleton loaders for user/department dropdowns at `src/features/tasks/components/search/filters/AssigneeFilter.tsx` (update from T049)
- [ ] T075 [P] Implement proper error messages for API failures at `src/features/tasks/components/search/TaskSearchError.tsx` - user-friendly messages for common failures (update from T016)
- [ ] T076 [P] Add keyboard accessibility - tab order, enter to submit search/filters at TaskSearchInput and filters
- [ ] T077 [P] Add aria labels for screen readers - all interactive elements have proper labels
- [ ] T078 [P] Optimize useTaskSearch query caching - staleTime 5 minutes, gcTime 10 minutes per research findings at `src/features/tasks/hooks/useTaskSearch.ts`
- [ ] T079 [P] Add analytics tracking (optional) - log search queries, filters used, results clicked to `src/features/tasks/hooks/useTaskSearch.ts`
- [ ] T080 Create feature README at `src/features/tasks/README.md` - documents search feature with screenshots, usage, caveats
- [ ] T081 Update main app navigation to include task search link
- [ ] T082 Document API integration contract for backend team at `specs/001-task-search/contracts/README.md` - explain expected response format
- [ ] T083 Create acceptance test checklist at `specs/001-task-search/ACCEPTANCE_TESTS.md` - manual QA checklist for each user story

**Checkpoint**: Feature polish complete - user-ready with accessibility and error handling

---

## Implementation Dependencies & Parallel Execution

### Dependency Graph

```
T001-T004 (Setup)
    ↓
T005-T011 (Foundation) 
    ├─→ T012-T021 (US1: Text Search) - Can start after T005-T011 complete
    │   ├─→ T022-T030 (US2: Status/Priority Filters)
    │   ├─→ T031-T040 (US3: Pagination)
    │   └─→ T041-T045 (US4: Task Type)
    │       ├─→ T046-T054 (US5: Assignee/Dept)
    │       ├─→ T055-T060 (US6: Due Date Range)
    │       └─→ T061-T066 (US7: Sorting)
    └─→ T067-T072 (US8: Combined Filters) - Depends on all stories
        └─→ T073-T083 (Polish)
```

### Parallel Execution Examples

**Day 1 - Setup & Foundation** (Sequential, blocking):
- Run T001-T004 in sequence
- Then run T005-T011 in parallel (different files: taskSearchService.ts, hooks/)

**Day 2 - User Stories 1-3** (Parallel after foundation):
```
Worker 1: T012-T021 (US1 Tests + Implementation)
Worker 2: T022-T030 (US2 Tests + Implementation) 
Worker 3: T031-T040 (US3 Tests + Implementation)
```
These can run in parallel because they build on independent components.

**Day 3 - User Stories 4-7** (Parallel):
```
Worker 1: T041-T045 (US4 Task Type)
Worker 2: T046-T054 (US5 Assignee/Dept)
Worker 3: T055-T060 (US6 Due Date)
Worker 4: T061-T066 (US7 Sorting)
```

**Day 4 - Final Integration**:
- T067-T072 (US8 Combined - requires previous stories done)
- T073-T083 (Polish - parallel)

---

## Task Statistics

| Category | Count |
|----------|-------|
| Setup Tasks (T001-T004) | 4 |
| Foundation Tasks (T005-T011) | 7 |
| User Story 1 (T012-T021) | 10 |
| User Story 2 (T022-T030) | 9 |
| User Story 3 (T031-T040) | 10 |
| User Story 4 (T041-T045) | 5 |
| User Story 5 (T046-T054) | 9 |
| User Story 6 (T055-T060) | 6 |
| User Story 7 (T061-T066) | 6 |
| User Story 8 (T067-T072) | 6 |
| Polish (T073-T083) | 11 |
| **TOTAL TASKS** | **83** |

---

## MVP Scope Recommendation

**Minimum Viable Product** (Stories 1-3 only):
- Basic text search with debouncing ✅
- Status and priority filtering ✅
- Pagination with per-page control ✅
- ~40 tasks (T001-T040)
- **Estimated effort**: 2-3 developer days
- **User value**: Users can find tasks by keyword, filter by importance, navigate large result sets

**Phase 2** (Add Stories 4-7, Stories recommended for first release):
- Task type filtering
- Assignee and department filtering  
- Due date range filtering
- Sorting by multiple fields
- ~65 tasks (T001-T066)
- **Estimated effort**: 4-5 developer days
- **User value**: Complete filtering suite for power users

**Phase 3** (Add Story 8 + Polish):
- Combined filter validation
- Full accessibility
- Error handling and edge cases
- ~83 tasks (T001-T083)
- **Estimated effort**: 5-6 developer days
- **User value**: Production-ready feature with excellent UX

---

## Success Criteria Verification

Each task includes acceptance criteria from spec.md user stories:

**US1-US3 (MVP)**: 
- [ ] User can search and see results within 2 seconds (T021)
- [ ] Results show matching status/priority badges (T028)  
- [ ] Pagination controls work, can navigate all pages (T038)

**US4-US7** (Phase 2):
- [ ] All filters work independently and combined (T045, T054, T060, T066)
- [ ] Filter combinations use AND logic not OR (T069)
- [ ] Sort order persists across filter changes (T066)

**US8** (Phase 3):
- [ ] Multiple concurrent filters work correctly (T069)
- [ ] Edge cases handled gracefully (T068)

---

**Status**: ✅ READY FOR IMPLEMENTATION

**Next**: Assign tasks to developers, start with Phase 1 (T001-T004), then Phase 2 (T005-T011), then parallelize user story phases based on team size.

Run tests continuously (T-prefixed test tasks) to ensure quality throughout implementation.
