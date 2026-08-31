import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import ChartCard from "./charts/ChartCard";

const docs = [
  { name: "IT-Strategy Plan", type: "1%", score: "2.05" },
  { name: "Company Handbook", type: "H1", score: "2.00" },
  { name: "Annual Budget Report", type: "1%", score: "1.20" },
  { name: "Customer Survey Results", type: "1%", score: "1.20" },
  { name: "Equipment Inspection", type: "1%", score: "1.05" },
];

export default function MostViewedDocuments() {
  const { t } = useTranslation(["home", "common"]);

  return (
    <ChartCard title={t("home:mostViewedDocuments.title")}>
      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-foreground truncate">{doc.name}</span>
            <span className="text-xs text-muted-foreground">{doc.type}</span>
            <span className="text-xs font-semibold text-foreground">{doc.score}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
