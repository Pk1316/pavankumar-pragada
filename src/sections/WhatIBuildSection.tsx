import { Boxes, Cpu, LayoutDashboard, Server } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { DataFlowDiagram } from "../components/DataFlowDiagram";
import { WhatIBuildCard } from "../components/WhatIBuildCard";
import { Reveal } from "../components/Reveal";
import { whatIBuild } from "../data/philosophy";

const ICONS = [Boxes, Server, Cpu, LayoutDashboard];

export function WhatIBuildSection() {
  return (
    <section className="shell section-y">
      <SectionHeading title="From interfaces to real-time pipelines" />

      <div className="head-gap grid gap-st-3 sm:grid-cols-2 lg:grid-cols-4">
        {whatIBuild.map((card, i) => (
          <WhatIBuildCard key={card.title} data={card} icon={ICONS[i]} index={i} />
        ))}
      </div>

      {/* The pipeline gets the full width here, where its labels stay legible;
          the hero carries the same topology unlabelled. */}
      <Reveal className="mt-st-3 rounded-2xl border border-border bg-surface/60 p-st-4 sm:p-st-5">
        <p className="font-mono text-micro uppercase text-secondary">Data flow, end to end</p>
        <div className="mx-auto mt-st-3 max-w-2xl">
          <DataFlowDiagram />
        </div>
      </Reveal>
    </section>
  );
}
