import { FileText, FolderOpen, Clock, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { StatisticsData } from "../types/statistics.types";

interface StatsRowProps {
  data: StatisticsData | undefined;
}

export default function StatsRow({ data }: StatsRowProps) {
  const { t } = useTranslation(["home", "common"]);

  const STATS: {
    label: string;
    value: number;
    icon: typeof FileText;
    iconBg: string;
    iconColor: string;
    change?: string;
  }[] = [
    {
      label: t("statsRow.totalDocuments"),
      value: data?.total_documents ?? 0,
      icon: FileText,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: t("common:common.users"),
      value: data?.total_users ?? 0,
      icon: FolderOpen,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      label: t("statsRow.totalTasks"),
      value: data?.total_tasks ?? 0,
      icon: Clock,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      label: t("statsRow.renewalDocuments"),
      value: data?.total_renewal_documents ?? 0,
      icon: RefreshCw,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      change: t("statsRow.renewalPercentage", {
        percent: data?.total_renewal_documents_by_percentage ?? 0,
      }),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s) => (
        <Card key={s.label} className="border-border rounded-xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}
            >
              <s.icon className={`h-6 w-6 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              {s.change && (
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  {s.change}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
