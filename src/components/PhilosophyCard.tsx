import type { PhilosophyPrinciple } from "../data/philosophy";
import { Reveal } from "./Reveal";

interface Props {
  data: PhilosophyPrinciple;
  index: number;
}

/**
 * An engineering principle.
 *
 * No index number: these are four independent convictions, not four steps, so
 * numbering them would assert an order that does not exist. A short accent rule
 * marks the card instead, and extends on hover.
 */
export function PhilosophyCard({ data, index }: Props) {
  return (
    <Reveal index={index} className="h-full">
      <div className="card-glow group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-st-4 transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:bg-surface-hover motion-reduce:hover:translate-y-0">
        <span className="sheen group-hover:animate-sheen" aria-hidden="true" />
        <span
          className="block h-0.5 w-5 rounded-full bg-accent/70 transition-all duration-300 ease-out group-hover:w-9 group-hover:bg-accent"
          aria-hidden="true"
        />
        <h3 className="mt-st-2 text-h4 text-primary">{data.title}</h3>
        <p className="mt-st-1 text-meta text-secondary">{data.description}</p>
      </div>
    </Reveal>
  );
}
