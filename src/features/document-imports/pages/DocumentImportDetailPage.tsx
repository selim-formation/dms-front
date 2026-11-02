import { useCallback, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DepartmentNotice, { type DepartmentNoticeData } from '@/features/departments/components/DepartmentNotice'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import ImportDetailHeader from '../components/ImportDetailHeader'
import ImportStatusPanel from '../components/ImportStatusPanel'
import ImportStatsGrid from '../components/ImportStatsGrid'
import ImportInfoCard from '../components/ImportInfoCard'
import ImportRowsPanel from '../components/ImportRowsPanel'
import { ImportBlockedState, ImportListSkeleton } from '../components/ImportStates'
import type { ImportActionResult } from '../components/ImportActions'
import { useImportDetail } from '../hooks/useImportDetail'

/** Rows exist once the archive was unpacked and checked. */
const ROWS_VISIBLE = new Set(['ready', 'committing', 'completed', 'completed_errors', 'rolling_back', 'rolled_back'])

export default function DocumentImportDetailPage() {
    const { t } = useTranslation('imports')
    const { tenant, importId } = useParams({ from: '/_protected/$tenant/document-imports/$importId' })
    const id = Number(importId)
    const { item, isLoading, isError, error, refetch } = useImportDetail(id)
    const [notice, setNotice] = useState<DepartmentNoticeData | null>(null)

    const dismissNotice = useCallback(() => setNotice(null), [])
    const handleResult = useCallback((result: ImportActionResult) => {
        setNotice({ id: Date.now(), tone: result.tone, message: result.message })
    }, [])

    const status = errorStatus(error)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                {isLoading ? (
                    <ImportListSkeleton rows={4} />
                ) : isError && (status === 403 || status === 404) ? (
                    <ImportBlockedState kind={status === 403 ? 'forbidden' : 'notFound'} tenant={tenant} />
                ) : isError || !item ? (
                    <DepartmentErrorState message={t('detail.error')} onRetry={() => refetch()} />
                ) : (
                    <div className="space-y-6">
                        <ImportDetailHeader item={item} tenant={tenant} onResult={handleResult} />
                        <DepartmentNotice notice={notice} onDismiss={dismissNotice} />
                        <ImportStatusPanel item={item} />
                        <ImportStatsGrid item={item} />
                        <ImportInfoCard item={item} />
                        {ROWS_VISIBLE.has(item.status) && (
                            <ImportRowsPanel
                                importId={item.id}
                                importStatus={item.status}
                                live={item.is_in_progress}
                                hasProblems={item.invalid_rows > 0}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
