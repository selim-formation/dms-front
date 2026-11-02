import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import type { DepartmentSection } from '../types/department.types'

const CHAR_BUDGET = 50

interface DepartmentSectionBadgesProps {
    sections: DepartmentSection[]
    /** Total count from the API (may exceed `sections.length`). */
    total?: number
}

/** Section names as badges, limited to ~50 characters with a "+N" overflow chip. */
function DepartmentSectionBadges({ sections, total }: DepartmentSectionBadgesProps) {
    const { t } = useTranslation('departments')

    const { visible, hidden } = useMemo(() => {
        let used = 0
        const shown: DepartmentSection[] = []
        for (const s of sections) {
            if (shown.length > 0 && used + s.name.length > CHAR_BUDGET) break
            shown.push(s)
            used += s.name.length
        }
        return { visible: shown, hidden: Math.max(0, (total ?? sections.length) - shown.length) }
    }, [sections, total])

    if (sections.length === 0) {
        return <span className="text-xs text-muted-foreground">{t('card.noSections')}</span>
    }

    return (
        <ul className="flex flex-wrap gap-1.5">
            {visible.map((s) => (
                <li key={s.id}>
                    <Badge variant="secondary" className="max-w-[10rem] truncate font-medium">
                        {s.name}
                    </Badge>
                </li>
            ))}
            {hidden > 0 && (
                <li>
                    <Badge variant="outline">{t('card.moreSections', { count: hidden })}</Badge>
                </li>
            )}
        </ul>
    )
}

export default memo(DepartmentSectionBadges)
