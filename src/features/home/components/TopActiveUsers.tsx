import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import ChartCard from "./charts/ChartCard";

const users = [
  { rank: 1, name: "Mohammed Ali", role: "Renewal actions", count: 134 },
  { rank: 2, name: "Ahmed Said", role: "Renewal actions", count: 130 },
  { rank: 3, name: "Sara Ahmed", role: "Viewed documents", count: 114 },
];

export default function TopActiveUsers() {
  const { t } = useTranslation(["home", "common"]);

  return (
    <ChartCard title={t("home:topActiveUsers.title")}>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.rank} className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground w-4">{user.rank}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-destructive">{user.count}</span>
              <TrendingUp className="h-3.5 w-3.5 text-destructive" />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
