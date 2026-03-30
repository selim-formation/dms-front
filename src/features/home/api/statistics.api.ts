import { apiClient } from "@/core/api/client";
import { buildApiUrl } from "@/config/api.config";
import type { StatisticsData, StatisticsResponse } from "../types/statistics.types";

export const getStatistics = async (): Promise<StatisticsData> => {
    const response = await apiClient.get<StatisticsResponse>(buildApiUrl("/api/bisco-misr/statistics"), {
        withCredentials: true,
    });

    console.log("Raw API response:", response);

    return (response as unknown as StatisticsResponse).data;
};