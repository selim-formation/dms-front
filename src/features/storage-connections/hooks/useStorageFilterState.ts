import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { STORAGE_PER_PAGE } from '../utils/storagePayload'
import type { StorageFilters, StorageProvider, StorageSort, StorageStatus } from '../types/storage.types'

/** `default` = no `sort` param: the default connection first, then by name. */
export type StorageSortChoice = StorageSort | 'default'
const DEFAULT_SORT: StorageSortChoice = 'default'

/** Owns list filters. Any change resets to page 1; search is debounced. */
export function useStorageFilterState() {
    const [search, setSearchRaw] = useState('')
    const [status, setStatusRaw] = useState<StorageStatus | ''>('')
    const [provider, setProviderRaw] = useState<StorageProvider | ''>('')
    const [sort, setSortRaw] = useState<StorageSortChoice>(DEFAULT_SORT)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search.trim(), 300)

    const setSearch = useCallback((v: string) => { setSearchRaw(v); setPage(1) }, [])
    const setStatus = useCallback((v: StorageStatus | '') => { setStatusRaw(v); setPage(1) }, [])
    const setProvider = useCallback((v: StorageProvider | '') => { setProviderRaw(v); setPage(1) }, [])
    const setSort = useCallback((v: StorageSortChoice) => { setSortRaw(v); setPage(1) }, [])
    const clear = useCallback(() => {
        setSearchRaw('')
        setStatusRaw('')
        setProviderRaw('')
        setSortRaw(DEFAULT_SORT)
        setPage(1)
    }, [])

    const filters = useMemo<StorageFilters>(
        () => ({
            search: debouncedSearch || undefined,
            status: status || undefined,
            provider: provider || undefined,
            sort: sort === 'default' ? undefined : sort,
            page,
            perPage: STORAGE_PER_PAGE,
        }),
        [debouncedSearch, status, provider, sort, page],
    )

    const hasActiveFilters = !!search || !!status || !!provider || sort !== DEFAULT_SORT

    return { filters, page, setPage, search, setSearch, status, setStatus, provider, setProvider, sort, setSort, hasActiveFilters, clear }
}
