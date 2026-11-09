import { memo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges'
import TaskDueDate from './TaskDueDate'
import { useTaskDetail } from '../hooks/useTaskDetail'
import type { Task } from '../types/task.types'

function Row({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
    return (
        <div className={wide ? 'col-span-2' : undefined}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{children}</dd>
        </div>
    )
}

interface TaskDetailsDialogProps {
    taskId: number | null
    onOpenChange: (open: boolean) => void
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
    onRestore: (task: Task) => void
}

/** Read-only view; fetches only while open (trashed tasks can be opened too). */
function TaskDetailsDialog({ taskId, onOpenChange, onEdit, onDelete, onRestore }: TaskDetailsDialogProps) {
    const { t, i18n } = useTranslation('taskManagement')
    const { task, isLoading, isError, error, refetch } = useTaskDetail(taskId)
    const notFound = isError && errorStatus(error) === 404
    const date = (iso: string) => relativeTime(iso, i18n.language)
    const a = task?.abilities

    return (
        <Dialog open={taskId !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('details.title')}</DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {isError && (
                    <div className="space-y-3 py-6 text-center">
                        <p className="text-sm text-destructive">{t(notFound ? 'states.notFound' : 'states.viewError')}</p>
                        {!notFound && (
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                {t('actions.retry', { ns: 'common' })}
                            </Button>
                        )}
                    </div>
                )}

                {task && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground" dir="auto">{task.title}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <TaskStatusBadge status={task.status} />
                                <TaskPriorityBadge priority={task.priority} />
                                {task.deleted_at && <Badge variant="outline">{t('details.inTrash')}</Badge>}
                            </div>
                            {task.description && (
                                <p className="whitespace-pre-line text-sm text-muted-foreground" dir="auto">{task.description}</p>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-4 text-sm">
                            <Row label={t('details.type')}>{t(`type.${task.task_type}`)}</Row>
                            <Row label={t('details.dueDate')}><TaskDueDate dueDate={task.due_date} overdue={task.is_overdue} /></Row>
                            <Row label={t('details.assignee')}>{task.assignee?.name ?? '—'}</Row>
                            <Row label={t('details.creator')}>{task.creator?.name ?? '—'}</Row>
                            <Row label={t('details.department')}>{task.department?.title ?? '—'}</Row>
                            <Row label={t('details.document')}>
                                {task.document
                                    ? <span dir="auto">{task.document.title}{task.document_version ? ` · v${task.document_version.version}` : ''}</span>
                                    : task.document_id ? t('details.documentHidden') : '—'}
                            </Row>
                            <Row label={t('details.tags')} wide>
                                {task.tags.length ? (
                                    <span className="flex flex-wrap gap-1">
                                        {task.tags.map((tag) => <Badge key={tag} variant="secondary" dir="auto">{tag}</Badge>)}
                                    </span>
                                ) : '—'}
                            </Row>
                            <Row label={t('details.created')}>{date(task.created_at)}</Row>
                            <Row label={t('details.updated')}>{date(task.updated_at)}</Row>
                            {task.completed_at && <Row label={t('details.completed')}>{date(task.completed_at)}</Row>}
                            {task.deleted_at && <Row label={t('details.deleted')}>{date(task.deleted_at)}</Row>}
                        </dl>
                    </div>
                )}

                {task && a && (a.update || a.delete || a.restore) && (
                    <DialogFooter>
                        {a.restore && (
                            <Button variant="outline" onClick={() => onRestore(task)}>
                                <RotateCcw className="h-4 w-4" />
                                {t('actions.restore')}
                            </Button>
                        )}
                        {a.delete && (
                            <Button variant="outline" onClick={() => onDelete(task)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                {t('actions.delete')}
                            </Button>
                        )}
                        {a.update && (
                            <Button onClick={() => onEdit(task)}>
                                <Pencil className="h-4 w-4" />
                                {t('actions.edit')}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default memo(TaskDetailsDialog)
