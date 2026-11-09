import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useTaskCounts } from '../hooks/useTaskCounts'
import { TABS } from '../utils/taskPayload'
import type { TaskCounts, TaskTab } from '../types/task.types'

const COUNT_KEY: Record<TaskTab, keyof TaskCounts> = {
    all: 'all',
    todo: 'todo',
    in_progress: 'in_progress',
    completed: 'completed',
    blocked: 'blocked',
    cancelled: 'cancelled',
    overdue: 'overdue',
    trash: 'trashed',
}

interface TaskTabsProps {
    value: TaskTab
    onChange: (tab: TaskTab) => void
}

/** Owns the counts query, so a counts refresh never re-renders the table. */
function TaskTabs({ value, onChange }: TaskTabsProps) {
    const { t } = useTranslation('taskManagement')
    const { counts } = useTaskCounts()

    return (
        <div role="tablist" aria-label={t('tabs.label')} className="flex flex-wrap gap-1 rounded-3xl border border-border bg-card p-1.5">
            {TABS.map((tab) => {
                const active = tab === value
                const count = counts?.[COUNT_KEY[tab]]
                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab)}
                        className={cn(
                            'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active ? 'bg-foreground text-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {t(`tabs.${tab}`)}
                        {count !== undefined && (
                            <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-card/20' : 'bg-muted')}>
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default memo(TaskTabs)
