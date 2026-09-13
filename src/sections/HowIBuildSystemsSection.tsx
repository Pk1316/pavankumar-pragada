import { SectionHeading } from "../components/SectionHeading";
import { ArchitectureDiagram, type DiagramNode } from "../components/ArchitectureDiagram";
import { Reveal } from "../components/Reveal";
import { systemArchitecture } from "../data/projects";

const nodes: DiagramNode[] = systemArchitecture.map((stage) => ({
  id: stage.id,
  label: stage.label,
  caption: stage.fill,
  detail: stage.projectEvidence.map((e) => `${e.project}: ${e.note}`).join(" · "),
}));

export function HowIBuildSystemsSection() {
  return (
    <section className="shell section-y relative">
      <div
        className="absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent_80%)]"
        aria-hidden="true"
      />

      <SectionHeading
        title="How I Build Systems"
        subtitle="The shape I reach for across projects, wired end to end. Hover a stage to see which project demonstrates it."
      />

      <Reveal className="head-gap rounded-2xl border border-border bg-surface/60 p-st-4 sm:p-st-5">
        <ArchitectureDiagram nodes={nodes} layout="split" columnLabels={["Request path", "Data path"]} />
      </Reveal>
    </section>
  );
}
