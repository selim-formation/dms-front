/**
 * TaskDetailsDrawer Component
 * 
 * Modern drawer component displaying complete task information
 * Shown when a task is selected from the task list
 */

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from '@/shared/components/ui/drawer'
import type { Task } from '../types/task.types'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../types/task.types'
import { formatDate } from '../utils/dateFormat'

interface TaskDetailsDrawerProps {
    task: Task | null
    isOpen: boolean
    onClose: () => void
}

/**
 * Color mapping for status badges
 */
const STATUS_COLORS: Record<Task['status'], { bg: string; icon: string; text: string }> = {
    TODO: {
        bg: 'bg-slate-100',
        icon: '📝',
        text: 'text-slate-700',
    },
    IN_PROGRESS: {
        bg: 'bg-blue-100',
        icon: '⚙️',
        text: 'text-blue-700',
    },
    COMPLETED: {
        bg: 'bg-green-100',
        icon: '✓',
        text: 'text-green-700',
    },
    BLOCKED: {
        bg: 'bg-red-100',
        icon: '⛔',
        text: 'text-red-700',
    },
}

/**
 * Color mapping for priority badges
 */
const PRIORITY_COLORS: Record<Task['priority'], { bg: string; text: string }> = {
    LOW: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
    },
    MEDIUM: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
    },
    HIGH: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
    },
    URGENT: {
        bg: 'bg-red-100',
        text: 'text-red-800',
    },
}

export function TaskDetailsDrawer({ task, isOpen, onClose }: TaskDetailsDrawerProps) {
    if (!task) {
        return null
    }

    const statusColors = STATUS_COLORS[task.status]
    const priorityColors = PRIORITY_COLORS[task.priority]

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent side="right" className="max-w-md max-h-screen flex flex-col">
                {/* Header */}
                <DrawerHeader className="border-b border-gray-200 pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <DrawerTitle className="text-2xl mb-2">{task.title}</DrawerTitle>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                                    {statusColors.icon} {TASK_STATUS_LABELS[task.status]}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors.bg} ${priorityColors.text}`}>
                                    {TASK_PRIORITY_LABELS[task.priority]}
                                </span>
                            </div>
                        </div>
                        <DrawerClose className="text-gray-500 hover:text-gray-700" />
                    </div>
                </DrawerHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Description Section */}
                    {task.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Due Date */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Due Date</p>
                            <p className="text-sm text-gray-900">
                                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                            </p>
                        </div>

                        {/* Priority */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Priority</p>
                            <p className={`text-sm font-medium ${priorityColors.text}`}>
                                {TASK_PRIORITY_LABELS[task.priority]}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Status</p>
                            <p className={`text-sm font-medium ${statusColors.text}`}>
                                {TASK_STATUS_LABELS[task.status]}
                            </p>
                        </div>

                        {/* Department */}
                        {task.department && (
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Department</p>
                                <p className="text-sm text-gray-900">{task.department}</p>
                            </div>
                        )}
                    </div>

                    {/* Assignee Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Assigned To</p>
                        {task.assignee ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                {task.assignee.avatar ? (
                                    <img
                                        src={task.assignee.avatar}
                                        alt={task.assignee.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                        {task.assignee.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{task.assignee.name}</p>
                                    <p className="text-xs text-gray-600">Assignee</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-600 italic">Unassigned</p>
                            </div>
                        )}
                    </div>

                    {/* Creator Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Created By</p>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                            {task.creator.avatar ? (
                                <img
                                    src={task.creator.avatar}
                                    alt={task.creator.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                                    {task.creator.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{task.creator.name}</p>
                                <p className="text-xs text-gray-600">Creator</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    {task?.tags?.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {task?.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Related Documents</p>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                    {task.relatedDocumentsCount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {task.relatedDocumentsCount === 1 ? 'document' : 'documents'} attached
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps Section */}
                    <div className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Activity</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Created</span>
                                <span className="text-gray-900 font-medium">{formatDate(task.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="text-gray-900 font-medium">{formatDate(task.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DrawerFooter className="border-t border-gray-200">
                    <DrawerClose className="w-full px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        Close
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default TaskDetailsDrawer
