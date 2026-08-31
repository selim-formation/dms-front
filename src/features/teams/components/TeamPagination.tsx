import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from '@/shared/components/ui/pagination'

interface TeamPaginationProps {
    currentPage: number
    lastPage: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

function TeamPagination({ currentPage, lastPage, onPageChange, disabled }: TeamPaginationProps) {
    const { t } = useTranslation('teams')

    if (lastPage <= 1) return null

    const canPrevious = currentPage > 1 && !disabled
    const canNext = currentPage < lastPage && !disabled

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={!canPrevious}
                        className={!canPrevious ? 'pointer-events-none opacity-50' : ''}
                        onClick={(e) => {
                            e.preventDefault()
                            if (canPrevious) onPageChange(currentPage - 1)
                        }}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="px-4 text-sm text-muted-foreground">
                        {t('teamPage.pageOf', { current: currentPage, last: lastPage })}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        aria-disabled={!canNext}
                        className={!canNext ? 'pointer-events-none opacity-50' : ''}
                        onClick={(e) => {
                            e.preventDefault()
                            if (canNext) onPageChange(currentPage + 1)
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default memo(TeamPagination)
