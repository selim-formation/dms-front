import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "../api/statistics.api";

export const statisticsQueryKey = ["statistics"];

export const useStatistics = () => {
    return useQuery({
        queryKey: statisticsQueryKey,
        queryFn: getStatistics,
        staleTime: 1000 * 60 * 5,
    });
};