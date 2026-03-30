import { requireAuth } from '@/core/router/guards/route-guards';
import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async (ctx) => {
    await requireAuth(ctx as unknown as { context: import('@/core/router/types').RouteContext; location: { pathname: string; search: Record<string, unknown> };[key: string]: unknown });
  },
  component: () => <Outlet />,
})
