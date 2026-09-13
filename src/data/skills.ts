export interface SkillGroupData {
  title: string;
  skills: { name: string; badge?: "professional" | "project" }[];
}

const professionalStack = new Set([
  "React",
  "Python",
  "FastAPI",
  "REST APIs",
  "WebSockets",
  "Apache Kafka",
  "PostgreSQL",
  "SQL",
  "MongoDB",
  "Docker",
  "Git",
  "GitHub",
  "JavaScript",
  "TypeScript",
]);

function tag(names: string[]): { name: string; badge?: "professional" | "project" }[] {
  return names.map((name) => ({
    name,
    badge: professionalStack.has(name) ? "professional" : "project",
  }));
}

export const skillGroups: SkillGroupData[] = [
  {
    title: "Frontend",
    skills: tag(["React", "JavaScript", "TypeScript", "HTML", "CSS", "Redux", "Vite", "Axios", "Recharts"]),
  },
  {
    title: "Backend",
    skills: tag(["Python", "FastAPI", "REST APIs", "Asyncio", "WebSockets", "Pydantic", "SQLAlchemy", "Node.js", "Go"]),
  },
  {
    title: "Databases",
    skills: tag(["PostgreSQL", "MySQL", "MongoDB", "SQL", "asyncpg"]),
  },
  {
    title: "Streaming / Distributed Systems",
    skills: tag(["Apache Kafka", "Event-driven architecture", "Async workers", "WebSockets", "SSE", "Ring buffers"]),
  },
  {
    title: "DevOps / Tooling",
    skills: tag(["Docker", "Docker Compose", "Git", "GitHub", "Postman"]),
  },
  {
    title: "AI / Other",
    skills: tag(["Gemini API", "File processing", "API integration"]),
  },
];
