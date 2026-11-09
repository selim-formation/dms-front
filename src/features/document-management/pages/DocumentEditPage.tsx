import { useMemo } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Layers, Loader2 } from 'lucide-react'
import Navbar from '@/shared/components/layout/Navbar'
import { Button } from '@/shared/components/ui/button'
import { DepartmentErrorState } from '@/features/departments/components/DepartmentStates'
import { errorStatus } from '@/features/departments/utils/departmentErrors'
import DocumentFormView from '../components/form/DocumentFormView'
import { ManagementForbiddenState } from '../components/ManagementStates'
import { useManagedDocumentDetail } from '../hooks/useManagedDocumentDetail'
import { useVersionAccess } from '../hooks/useVersionAccess'
import { valuesFromDocument } from '../utils/documentForm'

export default function DocumentEditPage() {
    const { t } = useTranslation('management')
    const { tenant, documentId } = useParams({ from: '/_protected/$tenant/document-management/$documentId/edit' })
    const id = Number(documentId)
    const { canRead: canVersions } = useVersionAccess()
    const { document: doc, isLoading, isError, error, refetch } = useManagedDocumentDetail(id)
    const initial = useMemo(() => (doc ? valuesFromDocument(doc) : null), [doc])
    const status = errorStatus(error)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isError && (status === 403 || status === 404) ? (
                    <div className="space-y-4 text-center">
                        <ManagementForbiddenState />
                        <Button asChild variant="outline">
                            <Link to="/$tenant/document-management" params={{ tenant }}>{t('form.backToList')}</Link>
                        </Button>
                    </div>
                ) : isError || !doc || !initial ? (
                    <DepartmentErrorState message={t('states.viewError')} onRetry={() => refetch()} />
                ) : !doc.abilities.update ? (
                    <div className="space-y-4 text-center">
                        <p className="text-muted-foreground">{t('form.cannotEdit')}</p>
                        <Button asChild variant="outline">
                            <Link to="/$tenant/document-management" params={{ tenant }}>{t('form.backToList')}</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('form.editTitle')}</h1>
                                <p className="mt-1 truncate text-muted-foreground" dir="auto">{doc.title}</p>
                            </div>
                            {canVersions && (
                                <Button asChild variant="outline" size="sm">
                                    <Link to="/$tenant/document-management/$documentId/versions" params={{ tenant, documentId }}>
                                        <Layers className="h-4 w-4" />
                                        {t('actions.versions')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <DocumentFormView key={doc.id} initial={initial} documentId={doc.id} responsibleFallback={doc.responsible} />
                    </>
                )}
            </main>
        </div>
    )
}
