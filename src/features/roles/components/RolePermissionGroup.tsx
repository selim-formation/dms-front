import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import RolePermissionOption from './RolePermissionOption'
import { humanize } from '../utils/rolePayload'
import type { RolePermission } from '../types/role.types'

interface RolePermissionGroupProps {
    action: string
    items: RolePermission[]
    selected: ReadonlySet<number>
    held: ReadonlySet<string>
    disabled?: boolean
    onToggle: (id: number) => void
    onToggleMany: (ids: number[], checked: boolean) => void
}

/** One action bucket (read_, create_ …) with a "select all I may grant" toggle. */
function RolePermissionGroup({ action, items, selected, held, disabled, onToggle, onToggleMany }: RolePermissionGroupProps) {
    const { t } = useTranslation('roles')

    const grantableIds = useMemo(() => items.filter((i) => held.has(i.name)).map((i) => i.id), [items, held])
    const allChecked = grantableIds.length > 0 && grantableIds.every((id) => selected.has(id))
    const selectedCount = items.reduce((n, i) => n + (selected.has(i.id) ? 1 : 0), 0)

    return (
        <section className="rounded-xl border border-border">
            <header className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
                <h4 className="text-sm font-semibold text-foreground">
                    {t(`permissions.actions.${action}`, { defaultValue: humanize(action) })}
                    <span className="ms-2 text-xs font-normal text-muted-foreground">
                        {selectedCount}/{items.length}
                    </span>
                </h4>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
                    <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-primary"
                        checked={allChecked}
                        disabled={disabled || grantableIds.length === 0}
                        onChange={() => onToggleMany(grantableIds, !allChecked)}
                    />
                    {t('form.selectGroup')}
                </label>
            </header>
            <div className="grid grid-cols-1 gap-x-2 p-1.5 sm:grid-cols-2">
                {items.map((item) => (
                    <RolePermissionOption
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        checked={selected.has(item.id)}
                        locked={!held.has(item.name) && !selected.has(item.id)}
                        disabled={disabled}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </section>
    )
}

export default memo(RolePermissionGroup)
