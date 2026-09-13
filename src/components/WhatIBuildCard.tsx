import type { LucideIcon } from "lucide-react";
import type { WhatIBuildCard as WhatIBuildCardData } from "../data/philosophy";
import { Reveal } from "./Reveal";

interface Props {
  data: WhatIBuildCardData;
  icon: LucideIcon;
  index: number;
}

export function WhatIBuildCard({ data, icon: Icon, index }: Props) {
  return (
    <Reveal index={index} className="h-full">
      <div className="card-glow group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-st-4 transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:bg-surface-hover motion-reduce:hover:translate-y-0">
        <span className="sheen group-hover:animate-sheen" aria-hidden="true" />
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-accent transition-colors duration-300 group-hover:bg-accent/10">
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h3 className="mt-st-2 text-h3 text-primary">{data.title}</h3>
        <p className="mt-st-1 text-meta text-secondary">{data.description}</p>
        <div className="mt-st-3 flex flex-wrap gap-st-1">
          {data.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-bg/60 px-2 py-0.5 font-mono text-nano text-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
