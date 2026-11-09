import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/utils'
import FeatureOption from './FeatureOption'
import { humanizePermission } from '../../utils/companyPayload'

export interface FeatureItem {
    id: number
    name: string
}

interface CompanyFeaturePickerProps {
    options: FeatureItem[]
    selectedIds: number[]
    onChange: (ids: number[]) => void
    isLoading?: boolean
    isError?: boolean
    onRetry?: () => void
    invalid?: boolean
    disabled?: boolean
}

/**
 * Searchable checkbox list of features (permissions) with "select all" over the
 * visible rows and an "N of M selected" summary. Any permission may be a feature.
 */
function CompanyFeaturePicker({ options, selectedIds, onChange, isLoading, isError, onRetry, invalid, disabled }: CompanyFeaturePickerProps) {
    const { t } = useTranslation('companies')
    const [query, setQuery] = useState('')

    const selected = useMemo<ReadonlySet<number>>(() => new Set(selectedIds), [selectedIds])

    const sorted = useMemo(() => [...options].sort((a, b) => a.name.localeCompare(b.name)), [options])
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase()
        return q ? sorted.filter((o) => o.name.toLowerCase().includes(q) || humanizePermission(o.name).includes(q)) : sorted
    }, [sorted, query])

    const visibleIds = useMemo(() => visible.map((o) => o.id), [visible])
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))

    const toggle = useCallback(
        (id: number) => onChange(selected.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]),
        [onChange, selected, selectedIds],
    )

    const toggleVisible = useCallback(() => {
        if (allVisibleSelected) {
            const drop = new Set(visibleIds)
            onChange(selectedIds.filter((id) => !drop.has(id)))
        } else {
            onChange([...new Set([...selectedIds, ...visibleIds])])
        }
    }, [allVisibleSelected, onChange, selectedIds, visibleIds])

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-48 flex-1">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('form.featuresSearch')}
                        aria-label={t('form.featuresSearch')}
                        className="ps-9"
                        disabled={disabled}
                    />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={toggleVisible} disabled={disabled || visibleIds.length === 0}>
                    {t(allVisibleSelected ? 'form.deselectAll' : 'form.selectAll')}
                </Button>
            </div>

            <div className={cn('max-h-72 overflow-y-auto rounded-xl border p-1.5', invalid ? 'border-destructive' : 'border-border')}>
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {isError && (
                    <div className="space-y-2 py-6 text-center">
                        <p className="text-sm text-destructive">{t('form.featuresError')}</p>
                        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                            {t('actions.retry', { ns: 'common' })}
                        </Button>
                    </div>
                )}
                {!isLoading && !isError && visible.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">{t('form.featuresEmpty')}</p>
                )}
                <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2">
                    {visible.map((o) => (
                        <FeatureOption key={o.id} id={o.id} name={o.name} checked={selected.has(o.id)} disabled={disabled} onToggle={toggle} />
                    ))}
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                {t('form.featuresSelected', { count: selectedIds.length, total: options.length })}
            </p>
        </div>
    )
}

export default memo(CompanyFeaturePicker)
