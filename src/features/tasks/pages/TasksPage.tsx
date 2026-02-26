/**
 * TasksPage Component
 * 
 * Main page component for the tasks feature
 * Integrates navbar, task list, filters, sorting, loading/error states, and empty state
 * Implements React.memo and useMemo for performance
 */

import React, { useMemo, useCallback, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { TasksList } from '../components/TasksList'
import { TaskFilters } from '../components/TaskFilters'
import { TaskSort } from '../components/TaskSort'
import { FilterSidebar } from '../components/FilterSidebar'
import { TaskDetailsDrawer } from '../components/TaskDetailsDrawer'
import { DEFAULT_SORT } from '../types/task.types'
import { sortTasks } from '../utils/taskSort'
import { hasActiveFilters } from '../utils/taskFilters'
import Navbar from '@/shared/components/layout/Navbar'
import type { SortConfig, SortField, SortDirection } from '../types/task.types'

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
                        className="h-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
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

    // Manage filters
    const {
        filters,
        setStatusFilter,
        setPriorityFilter,
        setAssigneeFilter,
        setDueDateRange,
        setCustomDateRange,
        resetFilters,
    } = useTaskFilters()

    // Manage sort
    const [sortConfig, setSortConfig] = React.useState<SortConfig>(DEFAULT_SORT)

    // Fetch tasks with filters applied
    const { tasks, isLoading, isError, error, refetch } = useTasks({ filters })

    // Sort the filtered tasks using useMemo
    const displayTasks = useMemo(() => {
        return sortTasks(tasks, sortConfig)
    }, [tasks, sortConfig])

    // Check if any filters are active
    const filtersActive = hasActiveFilters(filters)

    // Callbacks for sort changes (useCallback for performance)
    const handleSortFieldChange = useCallback((field: SortField) => {
        setSortConfig((prev) => ({
            ...prev,
            field,
        }))
    }, [])

    const handleSortDirectionChange = useCallback((direction: SortDirection) => {
        setSortConfig((prev) => ({
            ...prev,
            direction,
        }))
    }, [])

    // Callbacks for filter changes (useCallback for performance)
    const handleStatusChange = useCallback((statuses) => {
        setStatusFilter(statuses)
    }, [setStatusFilter])

    const handlePriorityChange = useCallback((priorities) => {
        setPriorityFilter(priorities)
    }, [setPriorityFilter])

    const handleAssigneeChange = useCallback((assigneeIds) => {
        setAssigneeFilter(assigneeIds)
    }, [setAssigneeFilter])

    const handleDueDateRangeChange = useCallback((range) => {
        setDueDateRange(range)
    }, [setDueDateRange])

    const handleCustomDateRangeChange = useCallback((range) => {
        setCustomDateRange(range)
    }, [setCustomDateRange])

    const handleResetFilters = useCallback(() => {
        resetFilters()
        setIsSidebarOpen(false)
    }, [resetFilters])

    // Find selected task from tasks array
    const selectedTask = useMemo(() => {
        if (!selectedTaskId) return null
        return tasks.find((task) => task.id === selectedTaskId) || null
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
                            <div className="sticky top-0 z-10  p-4 mb-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
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
                                                {filters.status.length + filters.priority.length + filters.assigneeIds.length + (filters.dueDateRange ? 1 : 0)}
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {displayTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                                    {filtersActive && ' (filtered)'}
                                </p>
                            </div>

                            {/* <TaskSort
                                sortField={sortConfig.field}
                                sortDirection={sortConfig.direction}
                                onSortFieldChange={handleSortFieldChange}
                                onSortDirectionChange={handleSortDirectionChange}
                            /> */}

                            {/* Content */}
                            <div className="flex-1 overflow-auto">
                                <TasksList
                                    tasks={displayTasks}
                                    selectedTaskId={selectedTaskId}
                                    onTaskClick={handleTaskClick}
                                    hasFiltersApplied={filtersActive}
                                    hasSearchQuery={filters.search.length > 0}
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
                                selectedAssigneeIds={filters.assigneeIds}
                                selectedDueDateRange={filters.dueDateRange}
                                customDateRange={filters.customDateRange}
                                onStatusChange={handleStatusChange}
                                onPriorityChange={handlePriorityChange}
                                onAssigneeChange={handleAssigneeChange}
                                onDueDateRangeChange={handleDueDateRangeChange}
                                onCustomDateRangeChange={handleCustomDateRangeChange}
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


