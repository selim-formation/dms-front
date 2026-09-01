/**
 * TaskDetailsDrawer Component
 * 
 * Modern drawer component displaying complete task information
 * Shown when a task is selected from the task list
 */

import { useTranslation } from 'react-i18next'
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
        bg: 'bg-muted',
        icon: '📝',
        text: 'text-muted-foreground',
    },
    IN_PROGRESS: {
        bg: 'bg-info/10',
        icon: '⚙️',
        text: 'text-info',
    },
    COMPLETED: {
        bg: 'bg-success/10',
        icon: '✓',
        text: 'text-success',
    },
    BLOCKED: {
        bg: 'bg-destructive/10',
        icon: '⛔',
        text: 'text-destructive',
    },
}

/**
 * Color mapping for priority badges
 */
const PRIORITY_COLORS: Record<Task['priority'], { bg: string; text: string }> = {
    LOW: {
        bg: 'bg-secondary',
        text: 'text-secondary-foreground',
    },
    MEDIUM: {
        bg: 'bg-warning/10',
        text: 'text-warning',
    },
    HIGH: {
        bg: 'bg-warning/20',
        text: 'text-warning',
    },
    URGENT: {
        bg: 'bg-destructive/10',
        text: 'text-destructive',
    },
}

export function TaskDetailsDrawer({ task, isOpen, onClose }: TaskDetailsDrawerProps) {
    const { t } = useTranslation(['tasks', 'common'])

    if (!task) {
        return null
    }

    const statusColors = STATUS_COLORS[task.status]
    const priorityColors = PRIORITY_COLORS[task.priority]

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent side="right" className="max-w-md max-h-screen flex flex-col">
                {/* Header */}
                <DrawerHeader className="border-b border-border pb-4">
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
                        <DrawerClose className="text-muted-foreground hover:text-foreground" />
                    </div>
                </DrawerHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Description Section */}
                    {task.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-foreground mb-2">{t('tasks:taskDetailsDrawer.description')}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Due Date */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t('tasks:taskDetailsDrawer.dueDate')}</p>
                            <p className="text-sm text-foreground">
                                {task.dueDate ? formatDate(task.dueDate) : t('tasks:taskDetailsDrawer.noDueDate')}
                            </p>
                        </div>

                        {/* Priority */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t('tasks:taskDetailsDrawer.priority')}</p>
                            <p className={`text-sm font-medium ${priorityColors.text}`}>
                                {TASK_PRIORITY_LABELS[task.priority]}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t('tasks:taskDetailsDrawer.status')}</p>
                            <p className={`text-sm font-medium ${statusColors.text}`}>
                                {TASK_STATUS_LABELS[task.status]}
                            </p>
                        </div>

                        {/* Department */}
                        {task.department && (
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{t('tasks:taskDetailsDrawer.department')}</p>
                                <p className="text-sm text-foreground">{task.department}</p>
                            </div>
                        )}
                    </div>

                    {/* Assignee Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">{t('tasks:taskDetailsDrawer.assignedTo')}</p>
                        {task.assignee ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                {task.assignee.avatar ? (
                                    <img
                                        src={task.assignee.avatar}
                                        alt={task.assignee.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                        {task.assignee.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{task.assignee.name}</p>
                                    <p className="text-xs text-muted-foreground">{t('tasks:taskDetailsDrawer.assignee')}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-muted">
                                <p className="text-sm text-muted-foreground italic">{t('tasks:taskDetailsDrawer.unassigned')}</p>
                            </div>
                        )}
                    </div>

                    {/* Creator Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">{t('tasks:taskDetailsDrawer.createdBy')}</p>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                            {task.creator.avatar ? (
                                <img
                                    src={task.creator.avatar}
                                    alt={task.creator.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                                    {task.creator.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-foreground">{task.creator.name}</p>
                                <p className="text-xs text-muted-foreground">{t('tasks:taskDetailsDrawer.creator')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    {task.tags.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">{t('tasks:taskDetailsDrawer.tags')}</p>
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents Section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">{t('tasks:taskDetailsDrawer.relatedDocuments')}</p>
                        <div className="p-4 rounded-lg bg-muted border border-border">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-foreground mb-1">
                                    {task.relatedDocumentsCount}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('tasks:taskDetailsDrawer.documentsAttached', { count: task.relatedDocumentsCount })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps Section */}
                    <div className="mb-6 p-3 rounded-lg bg-muted border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">{t('tasks:taskDetailsDrawer.activity')}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">{t('tasks:taskDetailsDrawer.created')}</span>
                                <span className="text-foreground font-medium">{formatDate(task.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">{t('tasks:taskDetailsDrawer.lastUpdated')}</span>
                                <span className="text-foreground font-medium">{formatDate(task.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DrawerFooter className="border-t border-border">
                    <DrawerClose className="w-full px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors">
                        {t('common:actions.close')}
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default TaskDetailsDrawer
