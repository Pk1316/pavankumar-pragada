import { Award, GraduationCap } from "lucide-react";
import { certifications, education } from "../data/education";
import { Reveal } from "./Reveal";

export function EducationTimeline() {
  return (
    <div className="grid gap-st-3 md:grid-cols-2">
      <Reveal index={0} className="h-full">
        <div className="card-glow h-full rounded-2xl border border-border bg-surface p-st-4 hover:border-accent/30">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-accent">
            <GraduationCap size={19} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h3 className="mt-st-3 text-h3 text-primary">{education.institution}</h3>
          <p className="mt-1 font-mono text-micro text-accent">{education.dates}</p>
          <p className="mt-st-2 text-meta text-secondary">{education.cgpa}</p>
        </div>
      </Reveal>

      <Reveal index={1} className="h-full">
        <div className="card-glow h-full rounded-2xl border border-border bg-surface p-st-4 hover:border-accent/30">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-accent">
            <Award size={19} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h3 className="mt-st-3 text-h3 text-primary">Certifications</h3>
          {/* Issuer and certificate name stack instead of running together on
              one line: paired on a phone they wrapped mid-title, which read as
              two unrelated fragments. */}
          <ul className="mt-st-2 space-y-st-2">
            {certifications.map((cert) => (
              <li key={cert.name} className="border-l border-border pl-st-2 text-meta text-secondary">
                <span className="block font-mono text-nano text-accent">{cert.issuer}</span>
                <span className="block text-primary">{cert.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
