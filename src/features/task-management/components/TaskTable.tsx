import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import TaskRow from './TaskRow'
import type { TaskRowHandlers } from './TaskRowActions'
import type { Task, TaskStatus, TaskTab } from '../types/task.types'
import { isSelectable } from '../utils/taskPayload'

const COLUMNS = ['title', 'status', 'priority', 'type', 'assignee', 'creator', 'due', 'created'] as const

interface TaskTableProps extends TaskRowHandlers {
    tasks: Task[]
    tab: TaskTab
    /** Show the selection column (user holds a bulk permission). */
    bulkEnabled: boolean
    selectedIds: ReadonlySet<number>
    onToggleSelect: (id: number) => void
    onChangeStatus: (task: Task, status: TaskStatus) => void
}

function TaskTable({ tasks, tab, bulkEnabled, selectedIds, onToggleSelect, onChangeStatus, ...handlers }: TaskTableProps) {
    const { t } = useTranslation('taskManagement')

    return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-240 text-start">
                <thead>
                    <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="w-10 ps-4 py-3"><span className="sr-only">{t('table.selectColumn')}</span></th>
                        {COLUMNS.map((c) => (
                            <th key={c} scope="col" className="px-4 py-3 text-start font-semibold">
                                {t(`table.columns.${c}`)}
                            </th>
                        ))}
                        <th scope="col" className="w-12 pe-3 py-3"><span className="sr-only">{t('table.columns.actions')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            selectable={bulkEnabled && isSelectable(task, tab)}
                            selected={selectedIds.has(task.id)}
                            onToggleSelect={onToggleSelect}
                            onChangeStatus={onChangeStatus}
                            {...handlers}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default memo(TaskTable)
