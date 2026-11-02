import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2, FilePlus, Files, Layers, ListChecks, XCircle } from 'lucide-react'
import TeamStatCard from '@/features/teams/components/TeamStatCard'
import type { DocumentImport } from '../types/import.types'

/** Counters straight from the import (no extra request). */
function ImportStatsGrid({ item }: { item: DocumentImport }) {
    const { t } = useTranslation('imports')
    const tiles = [
        { icon: Files, bg: 'bg-primary/10', color: 'text-primary', value: item.total_rows, label: t('stats.total') },
        { icon: ListChecks, bg: 'bg-primary/10', color: 'text-primary', value: item.valid_rows, label: t('stats.valid') },
        { icon: AlertTriangle, bg: 'bg-destructive/10', color: 'text-destructive', value: item.invalid_rows, label: t('stats.invalid') },
        { icon: CheckCircle2, bg: 'bg-success/10', color: 'text-success', value: item.committed_rows, label: t('stats.committed') },
        { icon: XCircle, bg: 'bg-destructive/10', color: 'text-destructive', value: item.failed_rows, label: t('stats.failed') },
        { icon: FilePlus, bg: 'bg-success/10', color: 'text-success', value: item.documents_created, label: t('stats.documents') },
        { icon: Layers, bg: 'bg-success/10', color: 'text-success', value: item.versions_created, label: t('stats.versions') },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tiles.map((tile) => (
                <TeamStatCard key={tile.label} icon={tile.icon} iconBg={tile.bg} iconColor={tile.color} value={tile.value} label={tile.label} isLoading={false} />
            ))}
        </div>
    )
}

export default memo(ImportStatsGrid)
