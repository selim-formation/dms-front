import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Ban, FlaskConical, KeyRound, MoreVertical, Pencil, Star, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { StorageConnection } from '../types/storage.types'

export interface StorageRowHandlers {
    onEdit: (c: StorageConnection) => void
    onTest: (c: StorageConnection) => void
    onSetDefault: (c: StorageConnection) => void
    onReplaceCredentials: (c: StorageConnection) => void
    onDisable: (c: StorageConnection) => void
    onDelete: (c: StorageConnection) => void
}

interface StorageRowActionsProps extends StorageRowHandlers {
    connection: StorageConnection
    /** The test limit (5 a minute) was hit. */
    testBlocked: boolean
}

/** Only what `abilities` allows. */
function StorageRowActions({ connection: c, testBlocked, ...h }: StorageRowActionsProps) {
    const { t } = useTranslation('storage')
    const a = c.abilities
    if (!Object.values(a).some(Boolean)) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.menu', { name: c.name })}>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {a.update && (
                    <DropdownMenuItem onClick={() => h.onEdit(c)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {a.test && (
                    <DropdownMenuItem disabled={testBlocked} onClick={() => h.onTest(c)}>
                        <FlaskConical className="me-2 h-4 w-4" />
                        {testBlocked ? t('actions.testCooling') : t('actions.test')}
                    </DropdownMenuItem>
                )}
                {a.set_default && (
                    <DropdownMenuItem onClick={() => h.onSetDefault(c)}>
                        <Star className="me-2 h-4 w-4" />
                        {t('actions.makeDefault')}
                    </DropdownMenuItem>
                )}
                {a.rotate && (
                    <DropdownMenuItem onClick={() => h.onReplaceCredentials(c)}>
                        <KeyRound className="me-2 h-4 w-4" />
                        {t('actions.replaceCredentials')}
                    </DropdownMenuItem>
                )}
                {(a.disable || a.delete) && <DropdownMenuSeparator />}
                {a.disable && (
                    <DropdownMenuItem onClick={() => h.onDisable(c)}>
                        <Ban className="me-2 h-4 w-4" />
                        {t('actions.disable')}
                    </DropdownMenuItem>
                )}
                {a.delete && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => h.onDelete(c)}>
                        <Trash2 className="me-2 h-4 w-4" />
                        {t('actions.delete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(StorageRowActions)
