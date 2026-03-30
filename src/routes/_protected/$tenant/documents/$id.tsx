import DocumentViewPage from '@/features/documents/pages/DocumentViewPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$tenant/documents/$id')({
    component: DocumentViewPage,
})
