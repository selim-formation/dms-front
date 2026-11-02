import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { relativeTime } from '@/features/departments/utils/relativeTime'
import type { DocumentImport } from '../types/import.types'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{children}</dd>
        </div>
    )
}

/** Mode, manifest, defaults and timings. Nothing here needs polling-level freshness. */
function ImportInfoCard({ item }: { item: DocumentImport }) {
    const { t, i18n } = useTranslation('imports')
    const d = item.defaults
    const dash = '—'

    return (
        <section className="rounded-2xl border border-border bg-card p-5" aria-label={t('detail.info')}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm md:grid-cols-4">
                <Row label={t('form.mode')}>{t(`mode.${item.mode}`)}</Row>
                <Row label={t('detail.manifest')}>{item.has_manifest ? t('detail.yes') : t('detail.no')}</Row>
                <Row label={t('form.skipInvalidShort')}>{item.skip_invalid ? t('detail.yes') : t('detail.no')}</Row>
                <Row label={t('form.category')}>{d.category ? t(`category.${d.category}`) : dash}</Row>
                <Row label={t('form.importance')}>{d.importance ? t(`importance.${d.importance}`) : dash}</Row>
                <Row label={t('form.departments')}>{d.department_ids.length || dash}</Row>
                <Row label={t('form.sections')}>{d.section_ids.length || dash}</Row>
                <Row label={t('form.types')}>{d.type_ids.length || dash}</Row>
                <Row label={t('form.entities')}>{d.entity_ids.length || dash}</Row>
                <Row label={t('detail.started')}>{item.started_at ? relativeTime(item.started_at, i18n.language) : dash}</Row>
                <Row label={t('detail.finished')}>{item.finished_at ? relativeTime(item.finished_at, i18n.language) : dash}</Row>
            </dl>
            {item.has_manifest && !!item.unlisted_files && (
                <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                    {t('detail.unlisted', { count: item.unlisted_files })}
                </p>
            )}
        </section>
    )
}

export default memo(ImportInfoCard)
