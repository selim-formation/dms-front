import StorageConnectionsPage from '@/features/storage-connections/pages/StorageConnectionsPage'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthAndTenant } from '@/core/router'

export const Route = createFileRoute('/_protected/$tenant/storage-connections/')({
  beforeLoad: (ctx) => requireAuthAndTenant(ctx.context),
  component: StorageConnectionsPage,
})
