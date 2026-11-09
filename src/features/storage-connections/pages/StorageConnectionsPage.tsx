import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import DepartmentConfirmDialog from '@/features/departments/components/DepartmentConfirmDialog'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import StoragePageHeader from '../components/StoragePageHeader'
import StorageFilterBar from '../components/StorageFilterBar'
import StorageTable from '../components/StorageTable'
import StorageFormDialog from '../components/StorageFormDialog'
import StorageCredentialsDialog from '../components/StorageCredentialsDialog'
import StorageTestDialog from '../components/StorageTestDialog'
import { StorageEmptyState, StorageForbiddenState, StorageTableSkeleton } from '../components/StorageStates'
import { useStorageList } from '../hooks/useStorageList'
import { useStorageFilterState } from '../hooks/useStorageFilterState'
import { useStorageAccess } from '../hooks/useStorageAccess'
import { useStorageAction } from '../hooks/useStorageAction'
import { useTestStorage } from '../hooks/useTestStorage'
import type { StorageActionKind, StorageConnection } from '../types/storage.types'

type FormTarget = { connection: StorageConnection | null } | null
type ConfirmState = { kind: StorageActionKind; connection: StorageConnection } | null

export default function StorageConnectionsPage() {
    const { t } = useTranslation('storage')
    const access = useStorageAccess()
    const state = useStorageFilterState()
    const { connections, meta, isLoading, isFetching, isError, error, refetch } = useStorageList(state.filters)

    const [formTarget, setFormTarget] = useState<FormTarget>(null)
    const [credentialsTarget, setCredentialsTarget] = useState<StorageConnection | null>(null)
    const [testTarget, setTestTarget] = useState<StorageConnection | null>(null)
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const defaultMutation = useStorageAction('default')
    const disableMutation = useStorageAction('disable')
    const deleteMutation = useStorageAction('delete')
    const actionMutations = { default: defaultMutation, disable: disableMutation, delete: deleteMutation }
    const { mutation: testMutation, cooling } = useTestStorage()

    const notify = useCallback(
        (tone: DepartmentNoticeData['tone'], message: string) => setNotice({ id: Date.now(), tone, message }),
        [],
    )
    const dismissNotice = useCallback(() => setNotice(null), [])

    /** 403 / 404 → notice with a clear reason; anything else → the server's words. */
    const notifyBlocked = useCallback(
        (err: unknown) => {
            const status = errorStatus(err)
            if (status === 403) return notify('error', t('notice.forbidden'))
            if (status === 404) return notify('error', t('notice.notFound'))
            notify('error', errorMessage(err) ?? t('notice.failed'))
        },
        [notify, t],
    )

    // Stable row callbacks (rows are memoised)
    const handleCreate = useCallback(() => setFormTarget({ connection: null }), [])
    const handleEdit = useCallback((c: StorageConnection) => setFormTarget({ connection: c }), [])
    const handleReplaceCredentials = useCallback((c: StorageConnection) => setCredentialsTarget(c), [])
    const handleTest = useCallback(
        (c: StorageConnection) => {
            setTestTarget(c)
            testMutation.reset()
            testMutation.mutate(c.id)
        },
        [testMutation],
    )
    const ask = useCallback(
        (kind: StorageActionKind) => (connection: StorageConnection) => {
            setConfirmError(null)
            setConfirm({ kind, connection })
        },
        [],
    )
    const handleSetDefault = useMemo(() => ask('default'), [ask])
    const handleDisable = useMemo(() => ask('disable'), [ask])
    const handleDelete = useMemo(() => ask('delete'), [ask])

    const { setPage } = state
    const handlePageChange = useCallback(
        (next: number) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [setPage],
    )

    const closeForm = useCallback((open: boolean) => !open && setFormTarget(null), [])
    const closeCredentials = useCallback((open: boolean) => !open && setCredentialsTarget(null), [])
    const closeTest = useCallback((open: boolean) => !open && setTestTarget(null), [])
    const closeConfirm = useCallback((open: boolean) => {
        if (open) return
        setConfirm(null)
        setConfirmError(null)
    }, [])

    const handleSaved = useCallback(
        (mode: 'created' | 'updated') => {
            setFormTarget(null)
            notify('success', t(`notice.${mode}`))
        },
        [notify, t],
    )
    const handleCredentialsSaved = useCallback(() => {
        setCredentialsTarget(null)
        notify('success', t('notice.credentialsReplaced'))
    }, [notify, t])
    const handleFormBlocked = useCallback(
        (err: unknown) => {
            setFormTarget(null)
            setCredentialsTarget(null)
            notifyBlocked(err)
        },
        [notifyBlocked],
    )
    const handleRunAgain = useCallback(() => {
        if (!testTarget) return
        testMutation.reset()
        testMutation.mutate(testTarget.id)
    }, [testTarget, testMutation])

    const runConfirm = () => {
        if (!confirm) return
        const { kind, connection } = confirm
        actionMutations[kind].mutate(connection.id, {
            onSuccess: () => {
                setConfirm(null)
                notify('success', t(`notice.${kind}`))
            },
            onError: (err) => {
                const status = errorStatus(err)
                if (status === 403 || status === 404) {
                    setConfirm(null)
                    return notifyBlocked(err)
                }
                // 409 names the reason; for delete, point at Disable.
                const message = errorMessage(err) ?? t('notice.failed')
                setConfirmError(kind === 'delete' && status === 409 ? `${message} ${t('confirm.delete.suggestDisable')}` : message)
            },
        })
    }

    const confirmCopy = useMemo(() => {
        if (!confirm) return null
        const { kind, connection } = confirm
        const extra = kind === 'disable' && connection.is_default ? ` ${t('confirm.disable.defaultWarning')}` : ''
        return {
            title: t(`confirm.${kind}.title`),
            description: `${t(`confirm.${kind}.description`, { name: connection.name })}${extra}`,
            confirmLabel: t(`confirm.${kind}.confirm`),
            destructive: kind !== 'default',
        }
    }, [confirm, t])

    const forbidden = !access.canRead || (isError && errorStatus(error) === 403)
    const pending = defaultMutation.isPending || disableMutation.isPending || deleteMutation.isPending

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                {forbidden ? (
                    <StorageForbiddenState />
                ) : (
                    <div className="space-y-6">
                        <StoragePageHeader canCreate={access.canCreate} onCreate={handleCreate} />

                        <StorageFilterBar
                            search={state.search}
                            onSearchChange={state.setSearch}
                            status={state.status}
                            onStatusChange={state.setStatus}
                            provider={state.provider}
                            onProviderChange={state.setProvider}
                            sort={state.sort}
                            onSortChange={state.setSort}
                            hasActiveFilters={state.hasActiveFilters}
                            onClear={state.clear}
                        />

                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />

                        {isLoading ? (
                            <StorageTableSkeleton />
                        ) : isError ? (
                            <DepartmentErrorState message={error?.message || t('page.errorTitle')} onRetry={() => refetch()} />
                        ) : connections.length === 0 ? (
                            <StorageEmptyState canCreate={access.canCreate} filtered={state.hasActiveFilters} onCreate={handleCreate} />
                        ) : (
                            <>
                                <StorageTable
                                    connections={connections}
                                    testBlocked={cooling}
                                    onEdit={handleEdit}
                                    onTest={handleTest}
                                    onSetDefault={handleSetDefault}
                                    onReplaceCredentials={handleReplaceCredentials}
                                    onDisable={handleDisable}
                                    onDelete={handleDelete}
                                />
                                <DepartmentPagination
                                    currentPage={meta?.current_page ?? state.page}
                                    lastPage={meta?.last_page ?? 1}
                                    onPageChange={handlePageChange}
                                    disabled={isFetching}
                                />
                            </>
                        )}
                    </div>
                )}
            </main>

            {formTarget && (
                <StorageFormDialog
                    key={formTarget.connection?.id ?? 'new'}
                    connection={formTarget.connection}
                    onOpenChange={closeForm}
                    onSaved={handleSaved}
                    onBlocked={handleFormBlocked}
                />
            )}

            {credentialsTarget && (
                <StorageCredentialsDialog
                    key={credentialsTarget.id}
                    connection={credentialsTarget}
                    onOpenChange={closeCredentials}
                    onSaved={handleCredentialsSaved}
                    onBlocked={handleFormBlocked}
                />
            )}

            {testTarget && (
                <StorageTestDialog
                    name={testTarget.name}
                    isPending={testMutation.isPending}
                    result={testMutation.data}
                    error={testMutation.error}
                    cooling={cooling}
                    onRunAgain={handleRunAgain}
                    onOpenChange={closeTest}
                />
            )}

            {confirmCopy && (
                <DepartmentConfirmDialog
                    open
                    onOpenChange={closeConfirm}
                    isPending={pending}
                    onConfirm={runConfirm}
                    error={confirmError}
                    {...confirmCopy}
                />
            )}
        </div>
    )
}
