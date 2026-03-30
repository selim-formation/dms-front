/**
 * TasksPage Component
 * 
 * Main page component for the tasks feature.
 * Integrates task search, filtering, sorting, and display with intelligent API routing.
 * 
 * Architecture:
 * - useTask hook: Intelligently routes to search or regular fetch endpoint
 * - useTaskFilters: Manages all filter state (status, priority, assignee, dates, sort)
 * - Single source of truth for task data via useTask
 * 
 * Performance optimizations:
 * - useMemo for sorted tasks and selected task lookup
 * - useCallback for event handlers (prevents unnecessary re-renders)
 * - keepPreviousData in useTask to smooth UX during searches
 */

import React, { useMemo, useCallback, useState } from 'react'
import { useTask } from '../hooks/useTask'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { TasksList } from '../components/TasksList'
import { FilterSidebar } from '../components/FilterSidebar'
import { TaskDetailsDrawer } from '../components/TaskDetailsDrawer'
import { TaskSearchInput } from '../components/search/TaskSearchInput'
import { DEFAULT_SORT } from '../types/task.types'
import type { SortConfig, Task } from '../types/task.types'
import { sortTasks } from '../utils/taskSort'
import { hasActiveFilters } from '../utils/taskFilters'
import Navbar from '@/shared/components/layout/Navbar'
import { useDebounce } from "@/shared/hooks/useDebounce"
/**
 * Loading skeleton component
 */
function LoadingState() {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-40 bg-linear-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    )
}

/**
 * Error state component
 */
function ErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-64 py-12 px-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load tasks</h3>
            <p className="text-gray-600 text-center max-w-sm mb-4">
                {error?.message || 'An error occurred while fetching tasks'}
            </p>
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    )
}

export function TasksPage() {
    // State for sidebar and task drawer
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearch = useDebounce(searchValue, 500)

    // Manage filters
    const {
        filters,
        setStatusFilter,
        setPriorityFilter,
        setAssigneeFilter,
        setTaskTypeFilter,
        setDepartmentFilter,
        setDueDateRange,
        resetFilters,
    } = useTaskFilters()

    // Manage sort
    const [sortConfig] = React.useState<SortConfig>(DEFAULT_SORT)

    // Fetch tasks with search and filters - uses proper TaskFilters transformation
    const { data: tasks = [], isLoading, isError, error, refetch } = useTask({
        search: debouncedSearch,
        filters: {
            status: filters.status,
            priority: filters.priority,
            assignee_id: filters.assignee_id ?? null,
            task_type: filters.task_type,
            department_id: filters.department_id,
            due_date_from: filters.due_date_from,
            due_date_to: filters.due_date_to,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
        },
    })

    // Sort the filtered tasks using useMemo
    const displayTasks = useMemo(() => {
        return sortTasks(tasks, sortConfig)
    }, [tasks, sortConfig])

    // Check if any filters are active
    const filtersActive = hasActiveFilters(filters)

    // Handle reset filters
    const handleResetFilters = useCallback(() => {
        resetFilters()
        setIsSidebarOpen(false)
    }, [resetFilters])

    // Find selected task from tasks array
    const selectedTask = useMemo(() => {
        if (!selectedTaskId) return null
        return tasks.find((task: Task) => task.id === selectedTaskId) || null
    }, [selectedTaskId, tasks])

    // Handler for task click
    const handleTaskClick = useCallback((taskId: number) => {
        setSelectedTaskId(taskId)
    }, [])

    // Handler for closing the drawer
    const handleCloseDrawer = useCallback(() => {
        setSelectedTaskId(null)
    }, [])

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                </div>
                <LoadingState />
            </div>
        )
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col h-full">
                <div className="sticky top-0 z-10  p-4">
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                </div>
                <ErrorState error={error as Error} onRetry={() => refetch()} />
            </div>
        )
    }

    console.log('TasksPage - fetched tasks:', tasks)
    // Main content
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8 relative">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col h-full">
                            {/* Header with Filter Button */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h1>


                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">

                                {/* Search Input */}
                                <div>
                                    <TaskSearchInput
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        onClear={() => setSearchValue('')}
                                        placeholder="Search tasks by title or description..."
                                    />
                                </div>

                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSidebarOpen
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    aria-label="Toggle filter sidebar"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                        />
                                    </svg>

                                    <span>Filter</span>

                                    {filtersActive && (
                                        <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-semibold">
                                            {filters.status.length +
                                                filters.priority.length +
                                                (filters.assignee_id ? 1 : 0) +
                                                (filters.task_type ? 1 : 0) +
                                                (filters.department_id ? 1 : 0) +
                                                (filters.due_date_from ? 1 : 0) +
                                                (filters.due_date_to ? 1 : 0)}
                                        </span>
                                    )}
                                </button>

                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto">
                                <TasksList
                                    tasks={displayTasks}
                                    selectedTaskId={selectedTaskId}
                                    onTaskClick={handleTaskClick}
                                    hasFiltersApplied={filtersActive}
                                    hasSearchQuery={searchValue.length > 0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Sidebar */}
                    {isSidebarOpen && (
                        <div className="w-80">
                            <FilterSidebar
                                tasks={tasks}
                                selectedStatuses={filters.status}
                                selectedPriorities={filters.priority}
                                selectedAssigneeId={filters.assignee_id}
                                selectedTaskType={filters.task_type}
                                selectedDepartmentId={filters.department_id}
                                selectedDueDateFrom={filters.due_date_from}
                                selectedDueDateTo={filters.due_date_to}
                                onStatusChange={setStatusFilter}
                                onPriorityChange={setPriorityFilter}
                                onAssigneeChange={setAssigneeFilter}
                                onTaskTypeChange={setTaskTypeFilter}
                                onDepartmentChange={setDepartmentFilter}
                                onDueDateRangeChange={setDueDateRange}
                                onReset={handleResetFilters}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Task Details Drawer */}
            <TaskDetailsDrawer
                task={selectedTask}
                isOpen={selectedTask !== null}
                onClose={handleCloseDrawer}
            />
        </div>
    )
}

export default TasksPage


