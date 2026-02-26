import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/home.service";
import { useTenant } from "@/core/tenant/hooks/useTenant";

export const useHomeData = () => {
  const { tenantId } = useTenant();
  const currentTenantId = tenantId || "default"; 

  const summaryQuery = useQuery({
    queryKey: ["home", currentTenantId, "summary"],
    queryFn: () => homeService.getHomeSummary(),
  });

  const recentDocsQuery = useQuery({
    queryKey: ["home", currentTenantId, "recentDocs"],
    queryFn: () => homeService.getRecentDocuments(),
  });

  const assignedTasksQuery = useQuery({
    queryKey: ["home", currentTenantId, "assignedTasks"],
    queryFn: () => homeService.getAssignedToMe(),
  });

  const activityQuery = useQuery({
    queryKey: ["home", currentTenantId, "activity"],
    queryFn: () => homeService.getActivity(),
  });

  const statisticsQuery = useQuery({
    queryKey: ["home", currentTenantId, "statistics"],
    queryFn: () => homeService.getStatistics(),
  });

  return {
    summary: summaryQuery.data,
    recentDocs: recentDocsQuery.data,
    assignedTasks: assignedTasksQuery.data,
    activity: activityQuery.data,
    statistics: statisticsQuery.data,
    isLoading:
      summaryQuery.isLoading ||
      recentDocsQuery.isLoading ||
      assignedTasksQuery.isLoading ||
      activityQuery.isLoading ||
      statisticsQuery.isLoading,
    isError:
      summaryQuery.isError ||
      recentDocsQuery.isError ||
      assignedTasksQuery.isError ||
      activityQuery.isError ||
      statisticsQuery.isError,
    // Expose individual states if needed
    summaryStatus: summaryQuery.status,
  };
};
