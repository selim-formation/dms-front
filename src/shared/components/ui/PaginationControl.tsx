import { memo } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from '@/shared/components/ui/pagination';

interface PaginationControlProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    label: string;
    className?: string;
}

/**
 * Generic prev/next pagination control. Pass a translated `label`
 * (e.g. "Page 2 of 5") so this stays feature-agnostic.
 */
function PaginationControl({ currentPage, lastPage, onPageChange, disabled, label, className }: PaginationControlProps) {
    if (lastPage <= 1) return null;

    const canPrevious = currentPage > 1 && !disabled;
    const canNext = currentPage < lastPage && !disabled;

    return (
        <Pagination className={className ?? 'mt-8'}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        aria-disabled={!canPrevious}
                        className={!canPrevious ? 'pointer-events-none opacity-50' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            if (canPrevious) onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="px-4 text-sm text-muted-foreground">{label}</span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        aria-disabled={!canNext}
                        className={!canNext ? 'pointer-events-none opacity-50' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            if (canNext) onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default memo(PaginationControl);
