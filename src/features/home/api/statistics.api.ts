import { apiClient } from "@/core/api/client";
import { buildApiUrl } from "@/config/api.config";
import type { StatisticsData, StatisticsResponse } from "../types/statistics.types";

export const getStatistics = async (): Promise<StatisticsData> => {
    const { data } = await apiClient.getInstance().get<StatisticsResponse>(
        buildApiUrl("/api/bisco-misr/statistics"),
        { withCredentials: true },
    );

    return data.data;
};