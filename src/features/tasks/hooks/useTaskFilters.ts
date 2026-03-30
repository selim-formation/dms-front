/**
 * useTaskFilters Hook
 * 
 * Manages task filter state matching backend API specification.
 * Provides functions to update individual filters and reset to defaults.
 * 
 * Filters supported:
 * - status, priority, task_type (string filters)
 * - assignee_id, department_id (entity filters)
 * - due_date_from, due_date_to (date range filters)
 * - search (full-text search)
 * - sort_by, sort_order (sorting)
 */

import { useState, useCallback } from 'react'
import type { TaskFilters, TaskStatus, TaskPriority } from '../types/task.types'
import { DEFAULT_FILTERS } from '../types/task.types'

interface UseTaskFiltersReturn {
    filters: TaskFilters
    setStatusFilter: (statuses: TaskStatus[]) => void
    setPriorityFilter: (priorities: TaskPriority[]) => void
    setSearchFilter: (search: string) => void
    setAssigneeFilter: (assigneeId: number | null) => void
    setTaskTypeFilter: (taskType: string | null) => void
    setDepartmentFilter: (departmentId: number | null) => void
    setDueDateRange: (from: string | null, to: string | null) => void
    setSortBy: (field: 'created_at' | 'due_date' | 'priority' | 'status') => void
    setSortOrder: (order: 'asc' | 'desc') => void
    toggleStatus: (status: TaskStatus) => void
    togglePriority: (priority: TaskPriority) => void
    resetFilters: () => void
}

/**
 * Custom hook for managing task filters
 * 
 * Features:
 * - Manages all backend-supported filters
 * - Provides both batch and individual filter update methods
 * - useCallback ensures stable function references for performance
 */
export function useTaskFilters(): UseTaskFiltersReturn {
    const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)

    // Set status filters (replaces current array)
    const setStatusFilter = useCallback((statuses: TaskStatus[]) => {
        setFilters((prev) => ({
            ...prev,
            status: statuses,
        }))
    }, [])

    // Set priority filters (replaces current array)
    const setPriorityFilter = useCallback((priorities: TaskPriority[]) => {
        setFilters((prev) => ({
            ...prev,
            priority: priorities,
        }))
    }, [])

    // Set search filter
    const setSearchFilter = useCallback((search: string) => {
        setFilters((prev) => ({
            ...prev,
            search,
        }))
    }, [])

    // Set assignee filter
    const setAssigneeFilter = useCallback((assigneeId: number | null) => {
        setFilters((prev) => ({
            ...prev,
            assignee_id: assigneeId,
        }))
    }, [])

    // Set task type filter
    const setTaskTypeFilter = useCallback((taskType: string | null) => {
        setFilters((prev) => ({
            ...prev,
            task_type: taskType,
        }))
    }, [])

    // Set department filter
    const setDepartmentFilter = useCallback((departmentId: number | null) => {
        setFilters((prev) => ({
            ...prev,
            department_id: departmentId,
        }))
    }, [])

    // Set due date range
    const setDueDateRange = useCallback((from: string | null, to: string | null) => {
        setFilters((prev) => ({
            ...prev,
            due_date_from: from,
            due_date_to: to,
        }))
    }, [])

    // Set sort field
    const setSortBy = useCallback((field: 'created_at' | 'due_date' | 'priority' | 'status') => {
        setFilters((prev) => ({
            ...prev,
            sort_by: field,
        }))
    }, [])

    // Set sort direction
    const setSortOrder = useCallback((order: 'asc' | 'desc') => {
        setFilters((prev) => ({
            ...prev,
            sort_order: order,
        }))
    }, [])

    // Toggle a status in/out of the filter
    const toggleStatus = useCallback((status: TaskStatus) => {
        setFilters((prev) => {
            const currentStatus = prev.status
            const isSelected = currentStatus.includes(status)

            return {
                ...prev,
                status: isSelected
                    ? currentStatus.filter((s) => s !== status)
                    : [...currentStatus, status],
            }
        })
    }, [])

    // Toggle a priority in/out of the filter
    const togglePriority = useCallback((priority: TaskPriority) => {
        setFilters((prev) => {
            const currentPriority = prev.priority
            const isSelected = currentPriority.includes(priority)

            return {
                ...prev,
                priority: isSelected
                    ? currentPriority.filter((p) => p !== priority)
                    : [...currentPriority, priority],
            }
        })
    }, [])

    // Reset all filters to default state
    const resetFiltersCallback = useCallback(() => {
        setFilters(DEFAULT_FILTERS)
    }, [])

    return {
        filters,
        setStatusFilter,
        setPriorityFilter,
        setSearchFilter,
        setAssigneeFilter,
        setTaskTypeFilter,
        setDepartmentFilter,
        setDueDateRange,
        setSortBy,
        setSortOrder,
        toggleStatus,
        togglePriority,
        resetFilters: resetFiltersCallback,
    }
}
