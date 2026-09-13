import { Atom, Boxes, Container, Database, FastForward, Radio, Waves } from "lucide-react";
import { profile } from "../data/profile";
import { Reveal } from "./Reveal";
import { StatusDot } from "./StatusDot";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  React: Atom,
  Python: FastForward,
  FastAPI: Boxes,
  Kafka: Waves,
  PostgreSQL: Database,
  WebSockets: Radio,
  Docker: Container,
};

export function CurrentlyBuilding() {
  const { currentlyBuilding } = profile;

  return (
    <Reveal className="card">
      <div className="flex flex-wrap items-center justify-between gap-st-2">
        <h3 className="font-mono text-micro uppercase text-secondary">{currentlyBuilding.title}</h3>
        <StatusDot label="Building" color="green" />
      </div>

      <p className="mt-st-3 text-h3 text-primary">{currentlyBuilding.heading}</p>
      <p className="mt-st-2 max-w-prose text-meta text-secondary">{currentlyBuilding.description}</p>

      <div className="mt-st-3 flex flex-wrap gap-st-1">
        {currentlyBuilding.techIcons.map((tech) => {
          const Icon = ICON_MAP[tech];
          return (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg/50 px-st-2 py-1.5 font-mono text-nano text-secondary transition-colors duration-200 hover:border-accent/30 hover:text-primary"
            >
              {Icon && <Icon size={13} strokeWidth={1.75} />}
              {tech}
            </span>
          );
        })}
      </div>
    </Reveal>
  );
}
