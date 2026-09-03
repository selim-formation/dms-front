import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface DynamicSliderTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  label?: string;
}

export default function DynamicSliderTabs({
  tabs,
  activeTab,
  onTabChange,
  label,
}: DynamicSliderTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isDragging = useRef(false);
  const isPointerDown = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  // Below this many px of movement, a pointerdown->pointerup is a click,
  // not a drag — matters because setPointerCapture (below) redirects the
  // resulting `click` event to the scroll container instead of whatever
  // button is under the cursor, silently swallowing taps on the tab
  // buttons if captured unconditionally on every press.
  const DRAG_THRESHOLD_PX = 5;

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 1);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    const ro = new ResizeObserver(checkScroll);
    if (el) ro.observe(el);
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      ro.disconnect();
    };
  }, [tabs, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.6, 200);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Vertical wheel input scrolls the row horizontally
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  // Click-and-drag scrolling for mouse users. Pointer capture is claimed
  // lazily — only once movement crosses DRAG_THRESHOLD_PX — so a plain
  // click on a tab button never triggers capture and its `click` event
  // reaches the button normally instead of being redirected to this div.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isPointerDown.current = true;
    isDragging.current = false;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el || !isPointerDown.current) return;
    const delta = e.clientX - dragStartX.current;
    if (!isDragging.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      isDragging.current = true;
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = dragScrollLeft.current - delta;
  };

  const stopDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    isPointerDown.current = false;
    if (isDragging.current && el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    isDragging.current = false;
  };

  return (
    <div className="mb-6">
      {label && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {label}
        </p>
      )}

      <div className="relative">
        {/* Left fade + arrow */}
        {showLeftArrow && (
          <>
            <div className="pointer-events-none absolute inset-y-0 start-0 w-10 bg-gradient-to-r from-background to-transparent z-10" />
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute start-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-8 w-8 rounded-full bg-card border border-border text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          className="overflow-x-auto scrollbar-hide scroll-smooth cursor-grab select-none active:cursor-grabbing"
        >
          <div className="flex gap-2 px-1 pb-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right fade + arrow */}
        {showRightArrow && (
          <>
            <div className="pointer-events-none absolute inset-y-0 end-0 w-10 bg-gradient-to-l from-background to-transparent z-10" />
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute end-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-8 w-8 rounded-full bg-card border border-border text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight size={16} className="rtl:rotate-180" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
