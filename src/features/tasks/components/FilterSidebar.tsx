/**
 * FilterSidebar Component
 * 
 * Advanced filters sidebar with collapsible sections for:
 * - Status
 * - Priority
 * - Assignee
 * - Due Date
 */

import React, { useState, useMemo } from 'react'
import type { Task, TaskStatus, TaskPriority, DueDateRange, CustomDateRange } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'

interface FilterSidebarProps {
    tasks: Task[]
    selectedStatuses: TaskStatus[]
    selectedPriorities: TaskPriority[]
    selectedAssigneeIds: number[]
    selectedDueDateRange: DueDateRange
    customDateRange: CustomDateRange
    onStatusChange: (statuses: TaskStatus[]) => void
    onPriorityChange: (priorities: TaskPriority[]) => void
    onAssigneeChange: (assigneeIds: number[]) => void
    onDueDateRangeChange: (range: DueDateRange) => void
    onCustomDateRangeChange: (range: CustomDateRange) => void
    onReset: () => void
}

/**
 * Get unique assignees from tasks
 */
function getUniqueAssignees(tasks: Task[]) {
    const assigneeMap = new Map<number, { id: number; name: string; avatar: string | null }>()

    tasks.forEach((task) => {
        if (task.assignee) {
            assigneeMap.set(task.assignee.id, task.assignee)
        }
    })

    return Array.from(assigneeMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * FilterSidebar Component
 */
export function FilterSidebar({
    tasks,
    selectedStatuses,
    selectedPriorities,
    selectedAssigneeIds,
    selectedDueDateRange,
    customDateRange,
    onStatusChange,
    onPriorityChange,
    onAssigneeChange,
    onDueDateRangeChange,
    onCustomDateRangeChange,
    onReset,
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['status', 'priority', 'dueDate'])
    )

    const assignees = useMemo(() => getUniqueAssignees(tasks), [tasks])

    const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']
    const priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

    const toggleSection = (section: string) => {
        const newSections = new Set(expandedSections)
        if (newSections.has(section)) {
            newSections.delete(section)
        } else {
            newSections.add(section)
        }
        setExpandedSections(newSections)
    }

    const handleStatusToggle = (status: TaskStatus) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter((s) => s !== status)
            : [...selectedStatuses, status]
        onStatusChange(newStatuses)
    }

    const handlePriorityToggle = (priority: TaskPriority) => {
        const newPriorities = selectedPriorities.includes(priority)
            ? selectedPriorities.filter((p) => p !== priority)
            : [...selectedPriorities, priority]
        onPriorityChange(newPriorities)
    }

    const handleAssigneeToggle = (assigneeId: number) => {
        const newAssignees = selectedAssigneeIds.includes(assigneeId)
            ? selectedAssigneeIds.filter((id) => id !== assigneeId)
            : [...selectedAssigneeIds, assigneeId]
        onAssigneeChange(newAssignees)
    }

    const activeFiltersCount =
        selectedStatuses.length + selectedPriorities.length + selectedAssigneeIds.length + (selectedDueDateRange ? 1 : 0)

    return (
        <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-25 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Advanced Filters</h2>
                        <p className="text-sm text-gray-600 mt-0.5">تصفية متقدمة</p>
                    </div>
                    {activeFiltersCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Filter Sections */}
            <div className="flex-1 overflow-y-auto">
                {/* Status Section */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => toggleSection('status')}
                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Status</span>
                        <span className="text-xs text-gray-600">الحالة</span>
                        <span className="ml-2 text-gray-400">
                            {expandedSections.has('status') ? '−' : '+'}
                        </span>
                    </button>

                    {expandedSections.has('status') && (
                        <div className="px-6 py-3 space-y-2">
                            {statusOptions.map((status) => {
                                const isSelected = selectedStatuses.includes(status)
                                return (
                                    <label
                                        key={status}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleStatusToggle(status)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                            {TASK_STATUS_LABELS[status]}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Priority Section */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => toggleSection('priority')}
                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Priority</span>
                        <span className="text-xs text-gray-600">الأولوية</span>
                        <span className="ml-2 text-gray-400">
                            {expandedSections.has('priority') ? '−' : '+'}
                        </span>
                    </button>

                    {expandedSections.has('priority') && (
                        <div className="px-6 py-3 space-y-2">
                            {priorityOptions.map((priority) => {
                                const isSelected = selectedPriorities.includes(priority)
                                return (
                                    <label
                                        key={priority}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handlePriorityToggle(priority)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                            {TASK_PRIORITY_LABELS[priority]}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Due Date Section */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => toggleSection('dueDate')}
                        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Due Date</span>
                        <span className="text-xs text-gray-600">تاريخ الاستحقاق</span>
                        <span className="ml-2 text-gray-400">
                            {expandedSections.has('dueDate') ? '−' : '+'}
                        </span>
                    </button>

                    {expandedSections.has('dueDate') && (
                        <div className="px-6 py-3 space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="dueDateRange"
                                    value="today"
                                    checked={selectedDueDateRange === 'today'}
                                    onChange={() => onDueDateRangeChange('today')}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">Today</span>
                                <span className="text-xs text-gray-500">(اليوم)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="dueDateRange"
                                    value="thisWeek"
                                    checked={selectedDueDateRange === 'thisWeek'}
                                    onChange={() => onDueDateRangeChange('thisWeek')}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">This Week</span>
                                <span className="text-xs text-gray-500">(هذا الأسبوع)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="dueDateRange"
                                    value="thisMonth"
                                    checked={selectedDueDateRange === 'thisMonth'}
                                    onChange={() => onDueDateRangeChange('thisMonth')}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">This Month</span>
                                <span className="text-xs text-gray-500">(هذا الشهر)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="dueDateRange"
                                    value="custom"
                                    checked={selectedDueDateRange === 'custom'}
                                    onChange={() => onDueDateRangeChange('custom')}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">Custom Range</span>
                                <span className="text-xs text-gray-500">(نطاق مخصص)</span>
                            </label>

                            {/* Custom Date Range Inputs */}
                            {selectedDueDateRange === 'custom' && (
                                <div className="pt-3 border-t border-gray-100 space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            value={customDateRange.from || ''}
                                            onChange={(e) =>
                                                onCustomDateRangeChange({
                                                    ...customDateRange,
                                                    from: e.target.value || null,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            value={customDateRange.to || ''}
                                            onChange={(e) =>
                                                onCustomDateRangeChange({
                                                    ...customDateRange,
                                                    to: e.target.value || null,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                <input
                                    type="radio"
                                    name="dueDateRange"
                                    value=""
                                    checked={selectedDueDateRange === ''}
                                    onChange={() => onDueDateRangeChange('')}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">All Dates</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {activeFiltersCount > 0 && (
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                    <button
                        onClick={onReset}
                        className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default FilterSidebar
