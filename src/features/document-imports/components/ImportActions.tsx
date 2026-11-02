import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2, Play, RotateCcw, Undo2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import { useDownloadProblems, useImportAction } from '../hooks/useImportMutations'
import type { DocumentImport, ImportAction } from '../types/import.types'

export type ImportActionResult =
    | { tone: 'success'; message: string }
    | { tone: 'error'; message: string; status?: number }

interface ImportActionsProps {
    item: DocumentImport
    onResult: (result: ImportActionResult) => void
}

/**
 * Renders only what the server's `actions` allow (state AND permission) and owns
 * the confirmations (start, roll back) and their mutations, so the rest of the
 * detail page doesn't re-render while a dialog is open.
 */
function ImportActions({ item, onResult }: ImportActionsProps) {
    const { t } = useTranslation('imports')
    const [confirm, setConfirm] = useState<'commit' | 'rollback' | null>(null)

    const commit = useImportAction('commit')
    const retry = useImportAction('retry')
    const rollback = useImportAction('rollback')
    const problems = useDownloadProblems()

    const run = useCallback(
        (action: ImportAction) => {
            const mutation = { commit, retry, rollback }[action]
            mutation.mutate(item.id, {
                onSuccess: () => onResult({ tone: 'success', message: t(`notice.${action}`) }),
                // 409 / 404 / 403 messages come from the server and are already user-readable.
                onError: (err) =>
                    onResult({ tone: 'error', status: errorStatus(err), message: errorMessage(err) ?? t('notice.actionFailed') }),
                onSettled: () => setConfirm(null),
            })
        },
        [commit, retry, rollback, item.id, onResult, t],
    )

    const handleProblems = useCallback(
        () =>
            problems.mutate(item.id, {
                onError: (err) => onResult({ tone: 'error', message: errorMessage(err) ?? t('notice.actionFailed') }),
            }),
        [problems, item.id, onResult, t],
    )

    const { actions } = item
    if (!actions.commit && !actions.retry && !actions.rollback && !actions.download_problems) return null

    const closeConfirm = (open: boolean) => !open && setConfirm(null)
    const isPending = commit.isPending || rollback.isPending

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                {actions.download_problems && (
                    <Button variant="outline" onClick={handleProblems} disabled={problems.isPending}>
                        {problems.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {t('actions.downloadProblems')}
                    </Button>
                )}
                {actions.rollback && (
                    <Button variant="outline" onClick={() => setConfirm('rollback')} disabled={rollback.isPending}>
                        <Undo2 className="h-4 w-4" />
                        {t('actions.rollback')}
                    </Button>
                )}
                {actions.retry && (
                    <Button variant="outline" onClick={() => run('retry')} disabled={retry.isPending}>
                        {retry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                        {t('actions.retry')}
                    </Button>
                )}
                {actions.commit && (
                    <Button onClick={() => setConfirm('commit')} disabled={commit.isPending}>
                        <Play className="h-4 w-4" />
                        {t('actions.commit')}
                    </Button>
                )}
            </div>

            {confirm && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={isPending}
                    onConfirm={() => run(confirm)}
                    destructive={confirm === 'rollback'}
                    title={t(`confirm.${confirm}.title`)}
                    description={t(`confirm.${confirm}.description`, {
                        name: item.name,
                        count: confirm === 'commit' ? item.valid_rows : item.documents_created + item.versions_created,
                    })}
                    confirmLabel={t(`confirm.${confirm}.confirm`)}
                />
            )}
        </>
    )
}

export default memo(ImportActions)
