import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '@/shared/components/layout/Navbar'
import { useDebounce } from '@/shared/hooks/useDebounce'
import TeamPageHeader from '../components/TeamPageHeader'
import TeamStatsRow from '../components/TeamStatsRow'
import TeamSearchAndFilters from '../components/TeamSearchAndFilters'
import TeamMembersGrid from '../components/TeamMembersGrid'
import TeamPagination from '../components/TeamPagination'
import { TeamEmptyState, TeamErrorState, TeamGridSkeleton } from '../components/TeamStates'
import { useTeamMembers } from '../hooks/useTeamMembers'

const PER_PAGE = 15

export default function TeamPage() {
    const { t } = useTranslation('teams')
    const [search, setSearch] = useState('')
    const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search, 300)

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value)
        setPage(1)
    }, [])

    const handleDepartmentChange = useCallback((id: number | undefined) => {
        setDepartmentId(id)
        setPage(1)
    }, [])

    const handlePageChange = useCallback((nextPage: number) => {
        setPage(nextPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const { members, meta, isLoading, isFetching, isError, error, refetch } = useTeamMembers({
        search: debouncedSearch || undefined,
        department_id: departmentId,
        per_page: PER_PAGE,
        page,
    })

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    <TeamPageHeader />

                    {/* Independent of search/filter — pinned to the full visible roster */}
                    <TeamStatsRow />

                    <TeamSearchAndFilters
                        search={search}
                        onSearchChange={handleSearchChange}
                        departmentId={departmentId}
                        onDepartmentChange={handleDepartmentChange}
                    />

                    {isLoading ? (
                        <TeamGridSkeleton count={PER_PAGE} />
                    ) : isError ? (
                        <TeamErrorState
                            message={error?.message || t('teamPage.errorTitle')}
                            onRetry={() => refetch()}
                        />
                    ) : members.length === 0 ? (
                        <TeamEmptyState />
                    ) : (
                        <>
                            <TeamMembersGrid members={members} />
                            <TeamPagination
                                currentPage={meta?.current_page ?? page}
                                lastPage={meta?.last_page ?? 1}
                                onPageChange={handlePageChange}
                                disabled={isFetching}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
