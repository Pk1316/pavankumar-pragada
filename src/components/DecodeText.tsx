import { useEffect, useRef, useState } from "react";
import { useMotion } from "../hooks/useMotionTier";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*+=";
const FRAME_MS = 34;

interface Props {
  text: string;
  /** Wait this long after mount before starting, in ms. */
  delay?: number;
  /** Run the effect. Pass false to hold the plain text. */
  active?: boolean;
  className?: string;
}

/**
 * Resolves a string character by character out of noise.
 *
 * Used once, on the hero's role line, where it says something true about the
 * page: this is a site about signal being decoded into something legible. A
 * typewriter would have read as a generic web flourish; this reads as the
 * subject matter.
 *
 * The final text is in the DOM from first render and the animated glyphs are
 * `aria-hidden`, so a screen reader and a reduced-motion visitor get the real
 * string immediately and never see the noise.
 */
export function DecodeText({ text, delay = 0, active = true, className }: Props) {
  const { transitions } = useMotion();
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(true);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!transitions || !active) {
      setDisplay(text);
      setDone(true);
      return;
    }

    setDone(false);
    setDisplay("");

    let start: number | null = null;
    let timer: number | null = null;

    function tick(now: number) {
      if (start === null) start = now;
      const elapsed = now - start;
      // One character locks in per frame; the two after it are still noise, so
      // the resolved edge always has a little static running ahead of it.
      const settled = Math.floor(elapsed / FRAME_MS);

      if (settled >= text.length) {
        setDisplay(text);
        setDone(true);
        return;
      }

      let out = text.slice(0, settled);
      for (let i = settled; i < Math.min(settled + 3, text.length); i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }

      setDisplay(out);
      frame.current = requestAnimationFrame(tick);
    }

    timer = window.setTimeout(() => {
      frame.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timer !== null) clearTimeout(timer);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [text, delay, active, transitions]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {display}
        {!done && <span className="text-accent">_</span>}
      </span>
    </span>
  );
}
