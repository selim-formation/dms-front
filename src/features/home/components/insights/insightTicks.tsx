import { insightAxisTick } from "./insightTheme";
import { DEFAULT_LINE_CHARS, LABEL_LINE_HEIGHT, wrapLabel } from "./wrapLabel";

/** Two-line axis label for "month year" values: the month above, the year (muted) below. Never rotated, so it can't collide with the bars. */
interface TwoLineTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  /** Per-line character budget (WrappedTick) */
  maxChars?: number;
}

export function TwoLineTick({ x = 0, y = 0, payload }: TwoLineTickProps) {
  const text = payload?.value ?? "";
  const cut = text.lastIndexOf(" ");
  const [top, bottom] = cut > 0 ? [text.slice(0, cut), text.slice(cut + 1)] : [text, ""];

  return (
    <text x={x} y={y} textAnchor="middle" fill={insightAxisTick.fill} fontSize={insightAxisTick.fontSize}>
      <tspan x={x} dy="0.9em">{top}</tspan>
      {bottom && (
        <tspan x={x} dy="1.3em" fillOpacity={0.7}>
          {bottom}
        </tspan>
      )}
    </text>
  );
}

/** Straight, centred label that wraps downward line by line; the full text is a tooltip. */
export function WrappedTick({ x = 0, y = 0, payload, maxChars = DEFAULT_LINE_CHARS }: TwoLineTickProps) {
  const text = payload?.value ?? "";
  const lines = wrapLabel(text, maxChars);

  return (
    <text x={x} y={y} textAnchor="middle" fill={insightAxisTick.fill} fontSize={insightAxisTick.fontSize}>
      <title>{text}</title>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? "0.9em" : LABEL_LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
