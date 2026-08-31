import { Progress } from "@/shared/components/ui/progress";

interface ChartProgressStatProps {
  label: string;
  value: number;
  progressClassName?: string;
}

export default function ChartProgressStat({
  label,
  value,
  progressClassName,
}: ChartProgressStatProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">{value}%</span>
        <Progress
          value={value}
          className={`h-2.5 flex-1 ${progressClassName ?? ""}`}
        />
      </div>
    </div>
  );
}
