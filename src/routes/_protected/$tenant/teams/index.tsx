import TeamPage from '@/features/teams/pages/TeamPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$tenant/teams/')({
  component: TeamPage,
})
