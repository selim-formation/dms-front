import { apiClient } from "@/core/api/client";
import type { HomeSummary, HomeActivityItem, AssignedItem, DocumentItem, HomeStatistics } from "../types/home.types";

export const homeService = {
  getHomeSummary: async (): Promise<HomeSummary> => {
    const response = await apiClient.getInstance().get<HomeSummary>("/dashboard/summary");
    return response.data;
  },

  getRecentDocuments: async (): Promise<DocumentItem[]> => {
    const response = await apiClient.getInstance().get<DocumentItem[]>("/documents/recent");
    return response.data;
  },

  getAssignedToMe: async (): Promise<AssignedItem[]> => {
    const response = await apiClient.getInstance().get<AssignedItem[]>("/tasks/assigned");
    return response.data;
  },

  getActivity: async (): Promise<HomeActivityItem[]> => {
    const response = await apiClient.getInstance().get<HomeActivityItem[]>("/dashboard/activity");
    return response.data;
  },

  getStatistics: async (): Promise<HomeStatistics> => {
    const response = await apiClient.getInstance().get<HomeStatistics>("/dashboard/statistics");
    return response.data;
  }
};
