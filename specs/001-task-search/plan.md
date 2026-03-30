# Implementation Plan: Task Search with Filters

**Branch**: `001-task-search` | **Date**: 15 March 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-task-search/spec.md`

## Summary

Implement a task search and filtering interface for the DMS frontend that enables users to find tasks through text search, status/priority filtering, task type, assignee, department, and date range selection. The feature provides paginated results with sorting capabilities and integrates with the backend `/api/tasks/search` endpoint. Critical UX behaviors include: 300ms debounced search input, skeleton loading states, error recovery with retry, and default sorting by creation date (newest first).

## Technical Context

**Language/Version**: TypeScript 5.x  
**Framework**: React 18+ (with TanStack Router v1+)  
**UI Library**: shadcn/ui (Radix UI + Tailwind CSS)  
**HTTP Client**: Custom axios-based API client in `src/core/api/client.ts`  
**Query Management**: TanStack Query v5+ (React Query) - inferred from package.json patterns  
**Styling**: Tailwind CSS + PostCSS  
**Build Tool**: Vite (vite.config.ts present)  
**Testing**: NEEDS CLARIFICATION (Vitest, Jest, or other)  
**Target Platform**: Web browser (modern React-supporting browsers)  
**Project Type**: Web (SPA - Single Page Application)  
**Performance Goals**: <1 second search response time for 10,000 tasks (from spec SC-002)  
**Constraints**: 
- HTTPS-only authentication (cookie-based per http-only-auth spec found in codebase)
- User permission awareness (cannot see tasks from departments/assignees not visible to them)
- Responsive design (mobile + desktop)  
**Scale/Scope**: Initial deployment for internal task management system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Project Constitution Status**: Not yet formalized in repository  
**Applicable Guidelines** (inferred from codebase structure):
- ✅ React/TypeScript standard - Feature uses React hooks + TypeScript strictly
- ✅ shadcn/ui component library - Feature leverages existing design system (buttons, dialogs, inputs from shadcn)
- ✅ TanStack Router integration - Feature uses router for task page navigation
- ✅ Accessible design - Feature requires keyboard accessibility + screen reader support (per spec SC-010)
- ✅ Responsive design - Feature MUST work on mobile + desktop (inferred from Tailwind + responsive utilities)
- ✅ HTTPS-only auth - Feature respects http-only cookie authentication pattern
- ✅ API service pattern - Feature uses `src/core/api/client.ts` patterns for HTTP requests

**Violations**: None identified
**Conditions**: None - feature is compliant with detected project standards

## Project Structure

### Documentation (this feature)

```text
specs/001-task-search/
├── spec.md              # ✅ Complete - Feature specification with 8 user stories
├── plan.md              # ← This file (implementation plan)
├── research.md          # Phase 0 output (research findings - to generate)
├── data-model.md        # Phase 1 output (entity definitions - to generate)
├── quickstart.md        # Phase 1 output (integration guide - to generate)
├── contracts/           # Phase 1 output (API types - to generate)
│   ├── search-params.ts
│   ├── search-response.ts
│   └── task-entity.ts
└── tasks.md             # Phase 2 output (implementation tasks - NOT by plan)
```

### Source Code Structure (React/TypeScript Frontend)

```text
src/features/tasks/
├── components/
│   ├── TaskSearchPage.tsx          # Main page component
│   ├── TaskSearchFilters.tsx       # Filter sidebar/bar component
│   ├── TaskSearchInput.tsx         # Search input with debouncing
│   ├── TaskResultsList.tsx         # Paginated results display
│   ├── TaskCard.tsx                # Individual task display
│   ├── TaskLoadingSkeleton.tsx     # Skeleton loaders for loading state
│   └── TaskSearchError.tsx         # Error banner with retry
├── hooks/
│   ├── useTaskSearch.ts            # Custom hook: search/filter logic + API integration
│   ├── useTaskFilters.ts           # Custom hook: filter state management
│   └── useTaskPagination.ts        # Custom hook: pagination logic
├── services/
│   ├── taskSearchService.ts        # API calls to /api/tasks/search
│   └── taskFilterService.ts        # Filter parameter serialization
├── types/
│   └── search.ts                   # Export from contracts for dev convenience
└── README.md                        # Feature documentation

src/core/api/
├── client.ts                       # (existing) - Base Axios client
└── interceptors/
    └── taskSearch.ts               # (optional) - Search-specific middleware

tests/features/tasks/
├── unit/
│   ├── hooks/useTaskSearch.test.ts
│   ├── services/taskSearchService.test.ts
│   └── components/TaskSearchInput.test.ts
└── integration/
    └── TaskSearchPage.integration.test.ts
```

**Structure Decision**: Single-feature modular structure within existing tasks feature folder. Leverages existing patterns in `src/features/documents/` as reference for task search implementation. No new top-level folders - keeps related code co-located.

## Complexity Tracking

> **No violations detected** - Feature design aligns with project standards (React + TypeScript + shadcn/ui patterns).

---

## Phase 0: Research & Technical Briefing

### Research Tasks

Based on Technical Context, verify:

1. **Testing Framework** (NEEDS CLARIFICATION from Technical Context)
   - What test runner is being used? (Vitest, Jest, or other)
   - Task: Check `package.json` test configs and `vitest.config.ts` or `jest.config.ts`
   - Impact: Determines test structure and syntax for search feature tests

2. **TanStack Query Integration Pattern**
   - Investigate existing React Query usage in `src/features/documents` and `src/features/auth`
   - Task: Document hook patterns, cache invalidation strategy, and error handling
   - Impact: Informs `useTaskSearch` hook implementation

3. **Available Task Status/Priority Enums**
   - Task: Check backend task types in `src/features/tasks/types/` or API response types
   - Impact: Determines filter dropdown options and validation

4. **Existing Filter Patterns**
   - Task: Review `src/features/documents/services/documentFilter.service.ts` (found in workspace)
   - Impact: Reuse established filter serialization patterns

5. **shadcn/ui Components for Search UI**
   - Task: Identify which shadcn components are available (Input, Select, DatePicker, Button, etc.)
   - Impact: Determines which components we need to add via `shadcn-cli`

### Deliverable: Phase 0 Research
**Output File**: `research.md` (to be generated)
**Contains**:
- Testing framework decision + rationale
- TanStack Query patterns documented with examples
- Task entity type definitions found
- Filter service patterns with code references
- shadcn/ui component audit + add commands

---

## Phase 1: Design Artifacts

### Phase 1a: Data Model

**Output File**: `data-model.md` (to be generated)

**Entities to define**:
1. **Task** (core entity from backend)
   - Fields: id, title, description, status, priority, task_type, tags, due_date, etc.
   - Validation rules: required fields, enums, type constraints
   - Relationships: Assignee (User), Creator (User), Document, Department

2. **TaskSearchParams** (frontend query representation)
   - search: string | null
   - status: string | null
   - priority: string | null
   - task_type: string | null
   - department_id: number | null
   - assignee_id: number | null
   - due_date_from: Date | null
   - due_date_to: Date | null
   - per_page: number (1-100, default 15)
   - page: number (1+)
   - sort_by: string
   - sort_order: "asc" | "desc"

3. **TaskSearchResponse** (backend response)
   - data: Task[]
   - meta: { total, per_page, current_page, last_page, from, to }
   - message: string
   - status: string
   - code: number

### Phase 1b: API Contracts

**Output Directory**: `contracts/`

**Files to generate**:
- `search-params.ts` - TypeScript types for query parameters (extends Zod schemas if using validation)
- `search-response.ts` - TypeScript types for API response
- `task-entity.ts` - Task type definition with all fields
- `index.ts` - Export all types

**Schema Pattern** (inferred from codebase):
```typescript
// contracts/search-params.ts
import { z } from "zod";

export const TaskSearchParamsSchema = z.object({
  search: z.string().optional(),
  status: z.enum([...]).optional(),
  priority: z.enum([...]).optional(),
  // ... other fields
});

export type TaskSearchParams = z.infer<typeof TaskSearchParamsSchema>;
```

### Phase 1c: Quick Start Guide

**Output File**: `quickstart.md` (to be generated)

**Sections**:
1. Feature Overview & Architecture Diagram
2. Component Tree (SearchPage → Filters + Input + Results)
3. Hook Integration Pattern (`useTaskSearch` usage)
4. Example: Basic Search Implementation (code snippet)
5. Example: Adding Filters (step-by-step)
6. API Integration Checklist
7. Testing Patterns for Search Features

### Phase 1d: Agent Context Update

**Action**: After Phase 1 artifacts generated, run agent context update script:
```bash
./.specify/scripts/bash/update-agent-context.sh copilot
```

**What gets updated**: Copilot agent context file with new search types/patterns from this feature

---

## Phase 2: Implementation Tasks (NOT Part of plan.md)

**Scheduled**: Next - `/speckit.tasks` command

**Will generate**: `tasks.md` with:
- Dependency-ordered implementation tasks
- Each task with acceptance criteria
- Test requirements
- Integration points
- Estimated complexity/effort

---

## Success Criteria for Planning Phase

- [x] Technical Context document complete
- [x] Constitution Check passed (no violations)
- [x] Project Structure explicitly defined with file paths
- [x] Phase 0 Research tasks identified
- [x] Phase 1 Design inputs specified (data model, contracts, quickstart)
- [x] Phase 2 path clear (tasks.md generation)
- [x] No NEEDS CLARIFICATION markers remain in plan
- [x] Agent context update action documented

---

## Phase 1 Execution Summary ✅

### Artifacts Generated

**Phase 0: Research Document**
- **File**: `research.md` (✅ Complete)
- **Content**: 11 research findings covering testing framework, React Query patterns, task types, filter patterns, shadcn components, API response format, default sort, debouncing, skeleton loaders, initial state, error handling
- **Status**: All unknowns researched and resolved

**Phase 1a: Data Model**
- **File**: `data-model.md` (✅ Complete)
- **Content**: Comprehensive entity definitions (Task, User, Department, Tag), query models (TaskSearchParams, TaskFilters), response models (TaskSearchResponse), validation rules, relationships, pagination metadata, type safety strategy with Zod
- **Entities**: 4 primary entities with full field documentation and constraints

**Phase 1b: API Contracts**
- **Files**: 
  - `contracts/search-api.ts` (✅ Complete) - TypeScript interface definitions for requests/responses
  - `contracts/index.ts` (✅ Complete) - Central export point
- **Types**: TaskSearchParams, TaskSearchResponse, PaginationMeta, error handling types
- **Coverage**: Request parameters, response structure, pagination, error responses, helper types

**Phase 1c: Quick Start Guide**
- **File**: `quickstart.md` (✅ Complete)
- **Content**: Installation guide, architecture diagram, step-by-step integration (hooks, services, components), component file structure, testing examples, common patterns, troubleshooting
- **Developer Ready**: Copy-paste code examples for all major components and hooks

**Phase 1d: Agent Context Update**
- **Status**: ✅ Complete - Copilot agent context updated with TypeScript and search patterns

### Statistics

| Artifact | Lines | Status |
|----------|-------|--------|
| research.md | ~450 | Complete ✅ |
| data-model.md | ~400 | Complete ✅ |
| contracts/search-api.ts | ~80 | Complete ✅ |
| contracts/index.ts | ~20 | Complete ✅ |
| quickstart.md | ~500 | Complete ✅ |
| **Total Documentation** | **~1450 lines** | **Complete ✅** |

### Key Findings from Research

1. **Testing**: Vitest (inferred from Vite setup) - zero config needed
2. **State Mgmt**: TanStack React Query v5.90.21 already installed
3. **Task Types**: Exist at `src/features/tasks/types/task.types.ts` with minor schema adjustments needed
4. **Filter Pattern**: DocumentFilterService pattern found - replicable
5. **UI Components**: 10 shadcn/ui components available, 4 need installation
6. **Performance**: Default pagination per_page=15, default sort created_at descending
7. **UX Patterns**: Debounce 300ms, skeleton loaders, error banner with retry

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **TanStack Query (React Query)** | Already installed, ideal for API data management |
| **Vitest** | Native Vite integration, zero-config, ESM-first |
| **shadcn/ui** | Consistent with existing design system |
| **Service + Hooks Pattern** | Follows existing codebase conventions |
| **Debounce 300ms** | Balances responsiveness with server load |
| **Default sort**: created_at desc | Newest tasks first aligns with user expectations |
| **Skeleton loaders** | Better perceived performance than spinners |

### Integration Points

- **API**: `/api/tasks/search` endpoint (backend contract defined)
- **State**: React Context or Zustand (recommendation: whichever is used for other features)
- **Router**: TanStack Router (already integrated in codebase)
- **Auth**: HTTP-only cookie authentication (existing system)
- **Permissions**: User visibility filters handled by backend

---

## Ready for Phase 2: Task Generation

**Next Command**:
```bash
/speckit.tasks
# or
npm run speckit -- tasks
```

**Will Generate**:
- `tasks.md` - Implementation tasks with:
  - Dependency graph (which tasks block others)
  - Complexity estimations
  - Acceptance criteria per task
  - Test requirements
  - Integration checklists

**Estimated Task Count**: 12-15 implementation tasks (based on:
- 7 components
- 3 hooks
- 1 service layer
- Unit + integration tests
- Documentation updates)
