import { useCallback, useMemo, useState } from 'react'

/**
 * Row selection for string or number ids. Auto-resets whenever `resetKey`
 * changes (new page, new filters) — derived during render, no effect needed.
 */
export function useRowSelection<Id extends string | number>(resetKey: string, pageIds: Id[]) {
    const [state, setState] = useState<{ key: string; ids: Id[] }>({ key: resetKey, ids: [] })

    const ids = useMemo(() => (state.key === resetKey ? state.ids : []), [state, resetKey])
    const selectedIds = useMemo<ReadonlySet<Id>>(() => new Set(ids), [ids])

    const toggle = useCallback(
        (id: Id) =>
            setState((prev) => {
                const current = prev.key === resetKey ? prev.ids : []
                return {
                    key: resetKey,
                    ids: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
                }
            }),
        [resetKey],
    )

    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

    const toggleAll = useCallback(
        () => setState({ key: resetKey, ids: allSelected ? [] : pageIds }),
        [resetKey, allSelected, pageIds],
    )

    const clear = useCallback(() => setState({ key: resetKey, ids: [] }), [resetKey])

    return { selectedIds, selectedList: ids, allSelected, toggle, toggleAll, clear }
}
