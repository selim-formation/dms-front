import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import Navbar from '@/shared/components/layout/Navbar'
import DocumentManagementPanel from '../components/DocumentManagementPanel'

/** Direct route to the workspace (kept for deep links such as `?view=ID`); the Documents page hosts the same panel. */
export default function DocumentManagementPage() {
    const navigate = useNavigate()
    const { view } = useSearch({ from: '/_protected/$tenant/document-management/' })
    // `?view=ID` (after create / edit) opens that document's details once, then is stripped.
    const [initialViewId] = useState<number | null>(view ?? null)
    useEffect(() => {
        if (view !== undefined) navigate({ to: '.', search: {}, replace: true })
    }, [view, navigate])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <DocumentManagementPanel initialViewId={initialViewId} />
            </main>
        </div>
    )
}
