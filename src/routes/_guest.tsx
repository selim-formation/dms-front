import { requireGuest } from '@/core/router/guards/route-guards';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest')({
  beforeLoad: async (ctx) => {
    await requireGuest(ctx as unknown as { context: import('@/core/router/types').RouteContext;[key: string]: unknown });
  },
  component: () => <Outlet />,
})