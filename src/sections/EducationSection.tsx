import { SectionHeading } from "../components/SectionHeading";
import { EducationTimeline } from "../components/EducationTimeline";

export function EducationSection() {
  return (
    <section id="education" className="shell section-y">
      <SectionHeading title="Education & Certifications" />
      <div className="head-gap">
        <EducationTimeline />
      </div>
    </section>
  );
}
