/**
 * useTaskFilters Hook
 * 
 * Manages task filter state (status, priority, search, assignee, due date)
 * Provides functions to update individual filters and reset to defaults
 */

import { useState, useCallback } from 'react'
import type { TaskFilters, TaskStatus, TaskPriority, DueDateRange, CustomDateRange } from '../types/task.types'
import { DEFAULT_FILTERS } from '../types/task.types'

interface UseTaskFiltersReturn {
    filters: TaskFilters
    setStatusFilter: (statuses: TaskStatus[]) => void
    setPriorityFilter: (priorities: TaskPriority[]) => void
    setSearchFilter: (search: string) => void
    setAssigneeFilter: (assigneeIds: number[]) => void
    setDueDateRange: (range: DueDateRange) => void
    setCustomDateRange: (range: CustomDateRange) => void
    toggleStatus: (status: TaskStatus) => void
    togglePriority: (priority: TaskPriority) => void
    toggleAssignee: (assigneeId: number) => void
    resetFilters: () => void
}

/**
 * Custom hook for managing task filters
 * 
 * Features:
 * - Manages status, priority, search, assignee, and due date filters
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
    const setAssigneeFilter = useCallback((assigneeIds: number[]) => {
        setFilters((prev) => ({
            ...prev,
            assigneeIds,
        }))
    }, [])

    // Set due date range
    const setDueDateRange = useCallback((range: DueDateRange) => {
        setFilters((prev) => ({
            ...prev,
            dueDateRange: range,
        }))
    }, [])

    // Set custom date range
    const setCustomDateRange = useCallback((range: CustomDateRange) => {
        setFilters((prev) => ({
            ...prev,
            customDateRange: range,
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

    // Toggle an assignee in/out of the filter
    const toggleAssignee = useCallback((assigneeId: number) => {
        setFilters((prev) => {
            const currentAssignees = prev.assigneeIds
            const isSelected = currentAssignees.includes(assigneeId)

            return {
                ...prev,
                assigneeIds: isSelected
                    ? currentAssignees.filter((id) => id !== assigneeId)
                    : [...currentAssignees, assigneeId],
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
        setDueDateRange,
        setCustomDateRange,
        toggleStatus,
        togglePriority,
        toggleAssignee,
        resetFilters: resetFiltersCallback,
    }
}
