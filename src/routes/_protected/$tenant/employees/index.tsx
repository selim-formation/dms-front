import EmployeesPage from '@/features/employees/pages/EmployeesPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/employees/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: EmployeesPage,
})
