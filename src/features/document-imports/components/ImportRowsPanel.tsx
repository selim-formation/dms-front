import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentPagination from '@/features/departments/components/DepartmentPagination'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { useDebounce } from '@/shared/hooks/useDebounce'
import ImportRowsToolbar from './ImportRowsToolbar'
import ImportRowsTable from './ImportRowsTable'
import { ImportListSkeleton } from './ImportStates'
import { useImportRows } from '../hooks/useImportRows'
import { ROWS_PER_PAGE } from '../utils/importPayload'
import type { RowFilters, RowStatus } from '../types/import.types'

interface ImportRowsPanelProps {
    importId: number
    importStatus: string
    live: boolean
    /** Review default: show the problems first when there are any. */
    hasProblems: boolean
}

/** Owns its own filters/page, so typing here never re-renders the detail header or stats. */
function ImportRowsPanel({ importId, importStatus, live, hasProblems }: ImportRowsPanelProps) {
    const { t } = useTranslation('imports')
    const [search, setSearchRaw] = useState('')
    const [status, setStatusRaw] = useState<RowStatus | ''>(() => (hasProblems ? 'invalid' : ''))
    const [page, setPage] = useState(1)
    const debounced = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setStatus = useCallback((v: RowStatus | '') => { setStatusRaw(v); setPage(1) }, [])

    const filters = useMemo<RowFilters>(
        () => ({ search: debounced || undefined, status: status || undefined, sort: 'row_number', page, perPage: ROWS_PER_PAGE }),
        [debounced, status, page],
    )
    const { rows, meta, isLoading, isFetching, isError, refetch } = useImportRows(importId, filters, importStatus, live)

    return (
        <section className="space-y-4" aria-label={t('rows.title')}>
            <h2 className="text-lg font-semibold text-foreground">{t('rows.title')}</h2>
            <ImportRowsToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

            {isLoading ? (
                <ImportListSkeleton rows={5} />
            ) : isError ? (
                <DepartmentErrorState message={t('rows.error')} onRetry={() => refetch()} />
            ) : rows.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-card py-10 text-center text-sm text-muted-foreground">
                    {t('rows.empty')}
                </p>
            ) : (
                <>
                    <ImportRowsTable rows={rows} />
                    <DepartmentPagination
                        currentPage={meta?.current_page ?? page}
                        lastPage={meta?.last_page ?? 1}
                        onPageChange={setPage}
                        disabled={isFetching}
                    />
                </>
            )}
        </section>
    )
}

export default memo(ImportRowsPanel)
