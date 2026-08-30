import { memo } from 'react';

interface TypesChartLegendItemProps {
    color: string;
    name: string;
    value: number;
}

function TypesChartLegendItem({ color, name, value }: TypesChartLegendItemProps) {
    return (
        <div className="flex items-center justify-between gap-2 min-w-0 rounded-lg border border-border bg-card/50 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
                <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden
                />
                <span className="text-xs text-muted-foreground truncate">{name}</span>
            </div>
            <span className="text-xs font-semibold text-foreground shrink-0">{value}</span>
        </div>
    );
}

export default memo(TypesChartLegendItem);
