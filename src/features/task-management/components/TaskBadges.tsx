import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ImportToneBadge from '@/features/document-imports/components/ImportToneBadge'
import { priorityTone, statusTone } from '../utils/taskPayload'
import type { TaskPriority, TaskStatus } from '../types/task.types'

/** TODO grey, IN_PROGRESS blue, COMPLETED green, BLOCKED orange, CANCELLED red. */
export const TaskStatusBadge = memo(function TaskStatusBadge({ status }: { status: TaskStatus }) {
    const { t } = useTranslation('taskManagement')
    return <ImportToneBadge tone={statusTone(status)} label={t(`status.${status}`)} />
})

/** LOW grey, MEDIUM blue, HIGH orange, URGENT red. */
export const TaskPriorityBadge = memo(function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
    const { t } = useTranslation('taskManagement')
    return <ImportToneBadge tone={priorityTone(priority)} label={t(`priority.${priority}`)} />
})
