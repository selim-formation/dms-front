/**
 * FilterSidebar Component
 * 
 * Advanced filters sidebar with collapsible sections for:
 * - Status
 * - Priority
 * - Assignee
 * - Task Type
 * - Department
 * - Due Date Range
 */

import { useState } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'

interface FilterSidebarProps {
    tasks: Task[]
    selectedStatuses: TaskStatus[]
    selectedPriorities: TaskPriority[]
    selectedAssigneeId: number | null
    selectedTaskType: string | null
    selectedDepartmentId: number | null
    selectedDueDateFrom: string | null
    selectedDueDateTo: string | null
    onStatusChange: (statuses: TaskStatus[]) => void
    onPriorityChange: (priorities: TaskPriority[]) => void
    onAssigneeChange: (assigneeId: number | null) => void
    onTaskTypeChange: (taskType: string | null) => void
    onDepartmentChange: (departmentId: number | null) => void
    onDueDateRangeChange: (from: string | null, to: string | null) => void
    onReset: () => void
}

/**
 * FilterSidebar Component
 */
export function FilterSidebar({
    tasks: _tasks,
    selectedStatuses,
    selectedPriorities,
    selectedAssigneeId,
    selectedTaskType,
    selectedDepartmentId,
    selectedDueDateFrom,
    selectedDueDateTo,
    onStatusChange,
    onPriorityChange,
    onAssigneeChange: _onAssigneeChange,
    onDueDateRangeChange,
    onReset,
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['status', 'priority', 'dueDate'])
    )

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

    const activeFiltersCount =
        selectedStatuses.length +
        selectedPriorities.length +
        (selectedAssigneeId ? 1 : 0) +
        (selectedTaskType ? 1 : 0) +
        (selectedDepartmentId ? 1 : 0) +
        (selectedDueDateFrom ? 1 : 0) +
        (selectedDueDateTo ? 1 : 0)

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
                        <div className="px-6 py-3 space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDueDateFrom || ''}
                                    onChange={(e) =>
                                        onDueDateRangeChange(e.target.value || null, selectedDueDateTo)
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
                                    value={selectedDueDateTo || ''}
                                    onChange={(e) =>
                                        onDueDateRangeChange(selectedDueDateFrom, e.target.value || null)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
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
