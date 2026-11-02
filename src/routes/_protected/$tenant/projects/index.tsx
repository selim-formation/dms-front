import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/projects/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: ProjectsPage,
})
