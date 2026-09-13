import { useEffect, useRef, useState } from "react";

interface Options {
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  /** Grow/shrink the viewport used for the test. */
  rootMargin?: string;
  /** Keep reporting visibility instead of latching on first entry. */
  repeat?: boolean;
}

/**
 * Reports when an element enters the viewport.
 *
 * Diagrams use this to mount their animated parts only while on screen, so an
 * off-screen pipeline costs nothing. By default it latches on first entry
 * (`repeat: false`), which is what scroll reveals want. Continuous animations
 * pass `repeat: true` so they also stop when scrolled back out.
 */
export function useInViewOnce<T extends Element = HTMLDivElement>({
  amount = 0.25,
  rootMargin = "0px 0px -10% 0px",
  repeat = false,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, rootMargin, repeat]);

  return { ref, inView };
}
