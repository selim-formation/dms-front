import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface ChartCardProps {
  title: string;
  height?: number;
  children: ReactNode;
  footer?: ReactNode;
}

export default function ChartCard({
  title,
  height,
  children,
  footer,
}: ChartCardProps) {
  return (
    <Card className="border-border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {height ? (
          <div style={{ height }} className="w-full">
            {children}
          </div>
        ) : (
          children
        )}
        {footer}
      </CardContent>
    </Card>
  );
}
