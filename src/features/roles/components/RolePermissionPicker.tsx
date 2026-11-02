import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/utils'
import RolePermissionGroup from './RolePermissionGroup'
import { groupPermissions, humanize, splitPermission } from '../utils/rolePayload'
import type { RolePermission } from '../types/role.types'

interface RolePermissionPickerProps {
    options: RolePermission[]
    selected: ReadonlySet<number>
    held: ReadonlySet<string>
    onToggle: (id: number) => void
    onToggleMany: (ids: number[], checked: boolean) => void
    isLoading?: boolean
    isError?: boolean
    onRetry?: () => void
    invalid?: boolean
    disabled?: boolean
}

/**
 * Searchable, grouped multi-select. Options a user doesn't hold stay visible
 * but locked ("you can only grant what you hold"); ones already in the role can
 * always be removed.
 */
function RolePermissionPicker({
    options,
    selected,
    held,
    onToggle,
    onToggleMany,
    isLoading,
    isError,
    onRetry,
    invalid,
    disabled,
}: RolePermissionPickerProps) {
    const { t } = useTranslation('roles')
    const [query, setQuery] = useState('')

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase()
        const matches = q
            ? options.filter((o) => {
                  const { resource } = splitPermission(o.name)
                  return (
                      o.name.toLowerCase().includes(q) ||
                      t(`permissions.resources.${resource}`, { defaultValue: humanize(resource) }).toLowerCase().includes(q)
                  )
              })
            : options
        return groupPermissions(matches)
    }, [options, query, t])

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('form.permissionsSearch')}
                    className="ps-9"
                    disabled={disabled}
                    aria-label={t('form.permissionsSearch')}
                />
            </div>

            <div
                className={cn(
                    'max-h-80 space-y-3 overflow-y-auto rounded-xl border p-2',
                    invalid ? 'border-destructive' : 'border-border',
                )}
            >
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {isError && (
                    <div className="space-y-2 py-6 text-center">
                        <p className="text-sm text-destructive">{t('form.permissionsError')}</p>
                        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                            {t('actions.retry', { ns: 'common' })}
                        </Button>
                    </div>
                )}
                {!isLoading && !isError && groups.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">{t('form.permissionsEmpty')}</p>
                )}
                {groups.map((g) => (
                    <RolePermissionGroup
                        key={g.action}
                        action={g.action}
                        items={g.items}
                        selected={selected}
                        held={held}
                        disabled={disabled}
                        onToggle={onToggle}
                        onToggleMany={onToggleMany}
                    />
                ))}
            </div>

            <p className="text-xs text-muted-foreground">
                {t('form.permissionsSelected', { count: selected.size, total: options.length })} · {t('form.grantHint')}
            </p>
        </div>
    )
}

export default memo(RolePermissionPicker)
