import DepartmentsPage from '@/features/departments/pages/DepartmentsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/departments/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: DepartmentsPage,
})
