import { SectionHeading } from "../components/SectionHeading";
import { ExperienceTimeline, InternToFullTimeIndicator } from "../components/ExperienceTimeline";
import { confidentialityNote, experience } from "../data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="shell section-y">
      <SectionHeading
        title="Professional Experience"
        subtitle="Building full-stack and real-time systems in the defense and aerospace domain."
      />

      <div className="head-gap">
        <InternToFullTimeIndicator />
      </div>

      <div className="mt-st-3">
        <ExperienceTimeline entries={experience} />
      </div>

      <p className="mt-st-4 text-meta italic text-secondary/70">{confidentialityNote}</p>
    </section>
  );
}
