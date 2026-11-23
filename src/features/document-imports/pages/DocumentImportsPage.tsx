import Navbar from '@/shared/components/layout/Navbar'
import DocumentImportsPanel from '../components/DocumentImportsPanel'

/** Direct route to the bulk-import workspace (kept for deep links); the Documents page hosts the same panel. */
export default function DocumentImportsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <DocumentImportsPanel />
            </main>
        </div>
    )
}
