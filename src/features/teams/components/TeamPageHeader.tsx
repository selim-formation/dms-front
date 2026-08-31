import { memo } from 'react'
import { useTranslation } from 'react-i18next'

function TeamPageHeader() {
    const { t } = useTranslation('teams')
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {t('teamPage.title')}
            </h1>
            <p className="mt-1 text-muted-foreground">{t('teamPage.subtitle')}</p>
        </div>
    )
}

export default memo(TeamPageHeader)
