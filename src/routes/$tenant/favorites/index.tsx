import { createFileRoute } from '@tanstack/react-router'
import FavoritesPage from '@/features/documents/pages/FavoritesPage'

export const Route = createFileRoute('/$tenant/favorites/')({
  component: FavoritesPage,
})
