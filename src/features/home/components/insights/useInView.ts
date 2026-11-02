import { useEffect, useRef, useState } from "react";

/**
 * One-shot visibility gate. Flips to true the first time the element
 * nears the viewport, then disconnects — charts below the fold don't
 * fetch or mount recharts until the user scrolls to them.
 */
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  // No IntersectionObserver (old browsers/SSR) → show immediately.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}
