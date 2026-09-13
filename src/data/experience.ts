export interface ExperienceEntry {
  company: string;
  industry?: string;
  role: string;
  dates: string;
  description: string;
  responsibilities?: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Constelli Signals Pvt. Ltd.",
    industry: "Defense & Aerospace",
    role: "Full-Stack Developer",
    dates: "September 2026 to Present",
    description:
      "Developing and integrating full-stack applications for defense and aerospace use cases, with a focus on real-time data processing, backend services, API integration, operational dashboards and system communication.",
    responsibilities: [
      "Developing React-based web applications",
      "Building reusable frontend components",
      "Integrating frontend applications with backend APIs",
      "Developing Python/FastAPI backend services",
      "Designing and integrating REST APIs",
      "Working with real-time communication",
      "Working with event-driven and streaming architectures",
      "Working with Kafka-based data pipelines",
      "Working with PostgreSQL and other persistence layers",
      "Handling structured telemetry/data streams",
      "Debugging end-to-end data flow across services",
      "Validating streamed data and ensuring frontend/backend consistency",
      "Integrating backend services into operational workflows",
      "Working with Docker-based environments",
      "Testing and troubleshooting distributed services",
      "Understanding data flow between hardware/data sources, backend services and frontend applications",
    ],
  },
  {
    company: "Constelli Signals Pvt. Ltd.",
    role: "Software Developer Intern",
    dates: "February 2026 to September 2026",
    description:
      "Started my professional journey at Constelli Signals as a Software Developer Intern, contributing to full-stack application development and backend service integration before transitioning into a full-time Full-Stack Developer role.",
  },
];

export const confidentialityNote =
  "Selected project details are generalized to respect confidentiality.";

export const careerJourney = [
  {
    date: "2022",
    label: "Education / Engineering Foundation",
  },
  {
    date: "2022 to 2025",
    label: "Vignan's Institute of Information Technology",
  },
  {
    date: "February 2026",
    label: "Joined Constelli Signals as Software Developer Intern",
  },
  {
    date: "September 2026",
    label: "Converted to Full-Time Full-Stack Developer",
  },
  {
    date: "Present",
    label: "Building full-stack and real-time systems in the defense & aerospace domain",
  },
];
