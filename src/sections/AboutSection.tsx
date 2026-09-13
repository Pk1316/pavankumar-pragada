import { SectionHeading } from "../components/SectionHeading";
import { PhilosophyCard } from "../components/PhilosophyCard";
import { CareerJourneyTimeline } from "../components/CareerJourneyTimeline";
import { CurrentlyBuilding } from "../components/CurrentlyBuilding";
import { Reveal } from "../components/Reveal";
import { profile } from "../data/profile";
import { philosophy } from "../data/philosophy";

export function AboutSection() {
  return (
    <section id="about" className="shell section-y">
      <SectionHeading title={profile.about.title} />

      {/* Prose and timeline are both short, so they pair up; the Currently
          Building card then runs full width underneath. Nesting it inside the
          left column instead left the timeline column with ~230px of dead
          space below it. */}
      <div className="head-gap grid gap-st-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-st-2">
          {profile.about.paragraphs.map((p, i) => (
            <Reveal as="p" key={p} index={i} className="max-w-prose text-body text-secondary">
              {p}
            </Reveal>
          ))}
        </div>

        <div>
          <p className="mb-st-3 font-mono text-micro uppercase text-secondary">Career journey</p>
          <CareerJourneyTimeline />
        </div>
      </div>

      <div className="mt-st-4">
        <CurrentlyBuilding />
      </div>

      <div className="mt-st-7">
        <SectionHeading title="How I Think About Software" />
        <div className="head-gap grid gap-st-3 sm:grid-cols-2 lg:grid-cols-4">
          {philosophy.map((item, i) => (
            <PhilosophyCard key={item.title} data={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
