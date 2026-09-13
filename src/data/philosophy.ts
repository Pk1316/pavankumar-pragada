export interface PhilosophyPrinciple {
  title: string;
  description: string;
}

export const philosophy: PhilosophyPrinciple[] = [
  {
    title: "Understand the Data Flow",
    description: "I like understanding how data moves through the entire system, not just one component.",
  },
  {
    title: "Build for Reliability",
    description: "A feature is not complete until the services around it behave correctly.",
  },
  {
    title: "Keep Systems Observable",
    description: "Health checks, logs, metrics and meaningful errors are part of good engineering.",
  },
  {
    title: "Keep Learning",
    description:
      "I continuously strengthen my fundamentals through projects, algorithms and experimentation with new technologies.",
  },
];

export interface WhatIBuildCard {
  title: string;
  description: string;
  tech: string[];
}

export const whatIBuild: WhatIBuildCard[] = [
  {
    title: "Full-Stack Applications",
    description: "Build complete applications spanning responsive React interfaces, APIs, backend services and databases.",
    tech: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
  },
  {
    title: "Backend Services",
    description: "Build Python/FastAPI services, REST APIs, authentication, business logic and database integrations.",
    tech: ["Python", "FastAPI", "SQLAlchemy", "JWT"],
  },
  {
    title: "Real-Time Systems",
    description: "Work with Kafka, asynchronous workers, WebSockets, SSE and event-driven architectures.",
    tech: ["Kafka", "WebSockets", "SSE", "Asyncio"],
  },
  {
    title: "Data-Driven Dashboards",
    description: "Build operational dashboards that transform backend and streaming data into real-time user experiences.",
    tech: ["React", "Recharts", "WebSockets"],
  },
];
