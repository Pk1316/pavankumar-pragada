import { SectionHeading } from "../components/SectionHeading";
import { SkillGroup } from "../components/SkillGroup";
import { skillGroups } from "../data/skills";

export function SkillsSection() {
  return (
    <section id="skills" className="shell section-y">
      <SectionHeading
        title="Technical Skills"
        subtitle="Grouped by domain. Cyan-bordered tags mark the current professional stack; the rest come from project work."
      />
      <div className="head-gap grid gap-st-3 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <SkillGroup key={group.title} group={group} index={i} />
        ))}
      </div>
    </section>
  );
}
