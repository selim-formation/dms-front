import { useCallback, useMemo, useState, type ReactElement } from "react";
import { WrappedTick } from "./insightTicks";
import { LABEL_LINE_HEIGHT, wrapLabel } from "./wrapLabel";

/** Rough glyph width at the axis font size. */
const CHAR_PX = 7;
/** Narrowest slot a category gets: below it the chart scrolls sideways instead of squeezing labels. */
export const MIN_CATEGORY_WIDTH = 72;

/**
 * Straight category labels that wrap downward: the per-line budget follows the width each category
 * really has, and the axis grows to fit the tallest label, so labels never overlap or slant.
 * Wire `onResize` to the ResponsiveContainer and give its parent `minWidth`.
 */
export function useFlatCategoryTick(labels: string[]): {
  tick: ReactElement;
  height: number;
  minWidth: number;
  onResize: (width: number) => void;
} {
  const [width, setWidth] = useState(0);
  const onResize = useCallback((w: number) => setWidth(Math.round(w)), []);
  const count = labels.length;
  const slot = width > 0 && count > 0 ? Math.max(width / count, MIN_CATEGORY_WIDTH) : MIN_CATEGORY_WIDTH;
  const maxChars = Math.max(6, Math.min(18, Math.floor((slot * 0.92) / CHAR_PX)));

  return useMemo(() => {
    const lines = labels.reduce((max, l) => Math.max(max, wrapLabel(l, maxChars).length), 1);
    return {
      tick: <WrappedTick maxChars={maxChars} />,
      height: 14 + lines * LABEL_LINE_HEIGHT,
      minWidth: count * MIN_CATEGORY_WIDTH,
      onResize,
    };
  }, [labels, maxChars, count, onResize]);
}
