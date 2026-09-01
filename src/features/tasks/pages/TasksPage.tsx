/**
 * TasksPage Component
 *
 * Main page component for the tasks feature
 * Integrates navbar, task list, filters, sorting, loading/error states, and empty state
 * Implements React.memo and useMemo for performance
 */

import React, { useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTasks } from "../hooks/useTasks";
import { useTaskFilters } from "../hooks/useTaskFilters";

import { TasksList } from "../components/TasksList";
import { FilterSidebar } from "../components/FilterSidebar";
import { TaskDetailsDrawer } from "../components/TaskDetailsDrawer";
import { TaskSearchInput } from "../components/search/TaskSearchInput";

import { DEFAULT_SORT } from "../types/task.types";
import type {
  SortConfig,
  TaskStatus,
  TaskPriority,
  DueDateRange,
  CustomDateRange,
} from "../types/task.types";

import { sortTasks } from "../utils/taskSort";
import { hasActiveFilters } from "../utils/taskFilters";

import Navbar from "@/shared/components/layout/Navbar";

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
            className="h-40 bg-linear-to-r from-secondary to-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const { t } = useTranslation(["tasks", "common"]);

  return (
    <div className="flex flex-col items-center justify-center min-h-64 py-12 px-4">
      <div className="text-4xl mb-4">⚠️</div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t("tasks:tasksPage.failedToLoad")}
      </h3>

      <p className="text-muted-foreground text-center max-w-sm mb-4">
        {error?.message || t("tasks:tasksPage.fetchError")}
      </p>

      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t("tasks:tasksPage.tryAgain")}
      </button>
    </div>
  );
}

export function TasksPage() {
  const { t } = useTranslation(["tasks", "common"]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  /**
   * Manage filters
   */
  const {
    filters,
    setStatusFilter,
    setPriorityFilter,
    setAssigneeFilter,
    setDueDateRange,
    setCustomDateRange,
    resetFilters,
  } = useTaskFilters();

  /**
   * Manage sort
   */
  const [sortConfig] = React.useState<SortConfig>(DEFAULT_SORT);

  /**
   * Fetch tasks with filters applied
   */
  const { tasks, isLoading, isError, error, refetch } = useTasks({ filters });

  /**
   * Search
   *
   * If your project already has searchValue/setSearchValue
   * coming from another hook, use that implementation here.
   */
  const [searchValue, setSearchValue] = useState("");

  /**
   * Sort filtered tasks
   */
  const displayTasks = useMemo(() => {
    return sortTasks(tasks, sortConfig);
  }, [tasks, sortConfig]);

  /**
   * Check if any filters are active
   */
  const filtersActive = hasActiveFilters(filters);

  /**
   * Filter callbacks
   */
  const handleStatusChange = useCallback(
    (statuses: TaskStatus[]) => {
      setStatusFilter(statuses);
    },
    [setStatusFilter],
  );

  const handlePriorityChange = useCallback(
    (priorities: TaskPriority[]) => {
      setPriorityFilter(priorities);
    },
    [setPriorityFilter],
  );

  const handleAssigneeChange = useCallback(
    (assigneeIds: number[]) => {
      setAssigneeFilter(assigneeIds);
    },
    [setAssigneeFilter],
  );

  const handleDueDateRangeChange = useCallback(
    (range: DueDateRange) => {
      setDueDateRange(range);
    },
    [setDueDateRange],
  );

  const handleCustomDateRangeChange = useCallback(
    (range: CustomDateRange) => {
      setCustomDateRange(range);
    },
    [setCustomDateRange],
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setIsSidebarOpen(false);
  }, [resetFilters]);

  /**
   * Find selected task
   */
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;

    return tasks.find((task) => task.id === selectedTaskId) || null;
  }, [selectedTaskId, tasks]);

  /**
   * Task click handler
   */
  const handleTaskClick = useCallback((taskId: number) => {
    setSelectedTaskId(taskId);
  }, []);

  /**
   * Close drawer
   */
  const handleCloseDrawer = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("tasks:tasksPage.title")}
          </h1>
        </div>

        <LoadingState />
      </div>
    );
  }

  /**
   * Error state
   */
  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 p-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("tasks:tasksPage.title")}
          </h1>
        </div>

        <ErrorState error={error as Error} onRetry={() => refetch()} />
      </div>
    );
  }

  /**
   * Main content
   */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="sticky top-0 z-10 p-4 mb-4 rounded-lg">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
                  {/* Search */}
                  <div>
                    <TaskSearchInput
                      value={searchValue}
                      onChange={setSearchValue}
                      onClear={() => setSearchValue("")}
                      placeholder={t("tasks:tasksPage.searchPlaceholder")}
                    />
                  </div>

                  {/* Filter Button */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isSidebarOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                    aria-label={t("tasks:tasksPage.toggleFilterSidebar")}
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

                    <span>{t("tasks:tasksPage.filter")}</span>

                    {filtersActive && (
                      <span className="ms-1 px-2 py-0.5 bg-primary-foreground text-primary rounded-full text-xs font-semibold">
                        {filters.status.length +
                          filters.priority.length +
                          filters.assigneeIds.length +
                          (filters.dueDateRange ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {t("tasks:tasksPage.title")}
                </h1>

                <p className="text-sm text-muted-foreground">
                  {displayTasks.length} of {tasks.length}{" "}
                  {tasks.length !== 1 ? "tasks" : "task"}
                  {filtersActive && " (filtered)"}
                </p>
              </div>

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
  );
}

export default TasksPage;
