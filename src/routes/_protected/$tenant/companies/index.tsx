import CompanyManagementPage from '@/features/companies/pages/CompanyManagementPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/companies/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: CompanyManagementPage,
})
