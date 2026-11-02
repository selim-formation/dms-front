import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { humanize, splitPermission } from '../utils/rolePayload'

interface RolePermissionOptionProps {
    id: number
    name: string
    checked: boolean
    /** Not held by the current user and not already in the role: cannot be granted. */
    locked: boolean
    disabled?: boolean
    onToggle: (id: number) => void
}

/** One checkbox row. Primitive props only, so toggling one row re-renders only that row. */
function RolePermissionOption({ id, name, checked, locked, disabled, onToggle }: RolePermissionOptionProps) {
    const { t } = useTranslation('roles')
    const { resource } = splitPermission(name)
    const off = locked || disabled

    return (
        <label
            title={locked ? t('form.permissionNotHeld') : name}
            className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50',
                off && 'cursor-not-allowed opacity-50 hover:bg-transparent',
            )}
        >
            <input
                type="checkbox"
                className="h-4 w-4 shrink-0 accent-primary"
                checked={checked}
                disabled={off}
                onChange={() => onToggle(id)}
            />
            <span className="truncate capitalize">{t(`permissions.resources.${resource}`, { defaultValue: humanize(resource) })}</span>
        </label>
    )
}

export default memo(RolePermissionOption)
