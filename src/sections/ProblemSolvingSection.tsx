import { SectionHeading } from "../components/SectionHeading";
import { CodingProfileCard } from "../components/CodingProfileCard";
import { ProblemSolvingVisual } from "../components/ProblemSolvingVisual";
import { codingProfiles } from "../data/codingProfiles";

/**
 * Grouped by whether a profile carries a stat grid.
 *
 * Four across put the two stat-heavy cards next to two short text cards, and
 * because grid rows stretch, the short ones grew ~300px of dead space to match.
 * Splitting them into two rows lets each row settle at its own height.
 */
const withStats = codingProfiles.filter((p) => p.stats.length > 0);
const withoutStats = codingProfiles.filter((p) => p.stats.length === 0);

export function ProblemSolvingSection() {
  return (
    <section id="problem-solving" className="shell section-y">
      <SectionHeading
        title="Problem Solving"
        subtitle="Building software is only half the job. I continuously practice the fundamentals behind it."
      />

      <div className="head-gap grid gap-st-3 md:grid-cols-2">
        {withStats.map((p, i) => (
          <CodingProfileCard key={p.id} profile={p} index={i} />
        ))}
      </div>

      <div className="mt-st-3 grid gap-st-3 md:grid-cols-2">
        {withoutStats.map((p, i) => (
          <CodingProfileCard key={p.id} profile={p} index={i} />
        ))}
      </div>

      <div className="mt-st-3">
        <ProblemSolvingVisual />
      </div>
    </section>
  );
}
