import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import DocumentFormView from '../components/form/DocumentFormView'
import { ManagementForbiddenState } from '../components/ManagementStates'
import { useManagementAccess } from '../hooks/useManagementAccess'
import { EMPTY_VALUES } from '../utils/documentForm'

export default function DocumentCreatePage() {
    const { t } = useTranslation('management')
    const access = useManagementAccess()

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
                {access.canCreate ? (
                    <>
                        <div className="mx-auto max-w-4xl">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('form.createTitle')}</h1>
                            <p className="mt-1 text-muted-foreground">{t('form.createSubtitle')}</p>
                        </div>
                        <DocumentFormView initial={EMPTY_VALUES} />
                    </>
                ) : (
                    <ManagementForbiddenState />
                )}
            </main>
        </div>
    )
}
