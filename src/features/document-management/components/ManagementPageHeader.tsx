import { memo } from 'react'
import { useTranslation } from 'react-i18next'

function ManagementPageHeader() {
    const { t } = useTranslation('management')
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('page.title')}</h1>
            <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
        </div>
    )
}

export default memo(ManagementPageHeader)
