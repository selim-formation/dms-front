import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import type { Section } from '../types/section.types'
import type { SectionPermissions } from '../hooks/useSectionPermissions'

export interface SectionRowActions {
    onView: (section: Section) => void
    onEdit: (section: Section) => void
    onDelete: (section: Section) => void
}

interface SectionCardActionsProps extends SectionRowActions {
    section: Section
    permissions: SectionPermissions
}

function SectionCardActions({ section, permissions, ...actions }: SectionCardActionsProps) {
    const { t } = useTranslation('sections')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('actions.menu', { name: section.name })}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => actions.onView(section)}>
                    <Eye className="me-2 h-4 w-4" />
                    {t('actions.view')}
                </DropdownMenuItem>
                {permissions.canUpdate && (
                    <DropdownMenuItem onClick={() => actions.onEdit(section)}>
                        <Pencil className="me-2 h-4 w-4" />
                        {t('actions.edit')}
                    </DropdownMenuItem>
                )}
                {permissions.canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => actions.onDelete(section)}
                        >
                            <Trash2 className="me-2 h-4 w-4" />
                            {t('actions.delete')}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default memo(SectionCardActions)
