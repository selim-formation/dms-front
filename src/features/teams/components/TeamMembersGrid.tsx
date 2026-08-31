import { memo } from 'react'
import TeamMemberCard from './TeamMemberCard'
import type { TeamMember } from '../types/team.types'

interface TeamMembersGridProps {
    members: TeamMember[]
}

function TeamMembersGrid({ members }: TeamMembersGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>
    )
}

export default memo(TeamMembersGrid)
