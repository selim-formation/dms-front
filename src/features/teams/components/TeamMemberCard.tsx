import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Mail, FileText, Share2 } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { useTenantId } from '@/core/tenant/hooks/useTenant'
import { roleBadgeColor, roleLabel, STATUS_DOT_COLOR } from '../utils/teamBadges'
import type { TeamMember } from '../types/team.types'

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

interface TeamMemberCardProps {
    member: TeamMember
}

/**
 * The status dot reflects tenant-membership status, not live presence —
 * this backend has no realtime "online right now" tracking.
 */
function TeamMemberCard({ member }: TeamMemberCardProps) {
    const { t } = useTranslation(['teams', 'common'])
    const tenant = useTenantId()
    const department = member.departments[0]?.title ?? t('teamPage.noDepartment')

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-border">
                            {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {initials(member.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span
                            className={`absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-card ${STATUS_DOT_COLOR[member.status]}`}
                            title={t(`teamPage.status.${member.status}`)}
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{department}</p>
                        <Badge variant="outline" className={`mt-1 text-[11px] ${roleBadgeColor(member.role)}`}>
                            {roleLabel(member.role, t)}
                        </Badge>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{member.email}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
                        <p className="text-lg font-bold text-foreground">{member.documents_count}</p>
                        <p className="text-[11px] text-muted-foreground">{t('teamPage.documents')}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
                        <p className="text-lg font-bold text-foreground">{member.shared_count}</p>
                        <p className="text-[11px] text-muted-foreground">{t('teamPage.shared')}</p>
                    </div>
                </div>

                <div className="mt-5 flex gap-2">
                    <Link
                        to="/$tenant/documents"
                        params={{ tenant: tenant ?? '' }}
                        search={{ owner: member.id }}
                        className="flex-1"
                    >
                        <Button variant="outline" className="w-full gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            {t('teamPage.documents')}
                        </Button>
                    </Link>
                    <Link
                        to="/$tenant/documents"
                        params={{ tenant: tenant ?? '' }}
                        search={{ shared_by: member.id }}
                        className="flex-1"
                    >
                        <Button
                            variant="outline"
                            className="w-full gap-2 text-sm border-primary/20 text-primary hover:bg-primary/5"
                        >
                            <Share2 className="h-4 w-4" />
                            {t('teamPage.shared')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default memo(TeamMemberCard)
