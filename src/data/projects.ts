export type ProjectCategory = "Full Stack" | "Backend" | "Real-Time" | "AI" | "APIs" | "Frontend";

export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  github: string;
  extraLinks?: { label: string; url: string }[];
  categories: ProjectCategory[];
  featured: boolean;
  overview: string;
  problem: string;
  solution: string;
  architecture?: ArchitectureNode[];
  contribution: {
    frontend?: string;
    backend?: string;
    database?: string;
    realtime?: string;
  };
  challenges: string[];
  conceptTags?: string[];
  technologies: string[];
  highlight?: string;
}

export const projects: Project[] = [
  {
    slug: "packetbridge",
    name: "PacketBridge",
    tagline: "Real-Time Telemetry Processing System",
    github: "https://github.com/Pk1316/PacketBridge",
    categories: ["Full Stack", "Backend", "Real-Time"],
    featured: true,
    overview:
      "A complete real-time telemetry processing pipeline that ingests packet data, decodes it into structured telemetry, streams it through Kafka, persists it in PostgreSQL, processes business logic and exposes live updates through FastAPI/WebSockets to a React dashboard.",
    problem:
      "Raw packet-level telemetry (from PCAPNG captures or synthetic traffic) needs to become clean, structured, real-time data usable by operators, without losing events under load or coupling ingestion tightly to processing.",
    solution:
      "A staged pipeline with bounded ring buffers between each stage, Kafka as the event backbone between ingestion and processing, and a WebSocket layer pushing processed results straight to a React dashboard.",
    architecture: [
      { id: "source", label: "Packet Source", description: "Origin of raw packet-like traffic, either PCAPNG captures or synthetic streams." },
      { id: "generator", label: "Packet Generator", description: "Produces packet-like telemetry from PCAPNG files or synthetic traffic." },
      { id: "bridge", label: "Bridge Service", description: "Integration layer between packet ingestion and the rest of the platform. Handles ingestion, decoding, Kafka publishing, response consumption, WebSocket broadcasting." },
      { id: "raw-buffer", label: "Raw Packet Ring Buffer", description: "Bounded asynchronous buffer holding raw packets before decoding, absorbing bursts." },
      { id: "decoder", label: "Decoder Worker Pool", description: "Extracts business payloads from packets and converts them into structured telemetry objects." },
      { id: "decoded-buffer", label: "Decoded JSON Ring Buffer", description: "Bounded buffer holding decoded telemetry before it's published to Kafka." },
      { id: "producer", label: "Kafka Producer", description: "Publishes structured telemetry events onto Kafka topics." },
      { id: "topics", label: "Kafka Topics", description: "Handles event streaming between the bridge and the processing server." },
      { id: "processing", label: "Processing Server", description: "Consumes Kafka events, processes telemetry and applies business logic." },
      { id: "postgres", label: "PostgreSQL", description: "Provides durable storage for telemetry data." },
      { id: "response-topics", label: "Response Topics", description: "Kafka topics carrying processed results back toward the bridge." },
      { id: "response-consumer", label: "Bridge Response Consumer", description: "Consumes response events from Kafka and hands them to the WebSocket layer." },
      { id: "websocket", label: "WebSocket", description: "Pushes live processing responses to connected frontend clients." },
      { id: "dashboard", label: "React Dashboard", description: "Displays telemetry and live events in real time." },
    ],
    contribution: {
      frontend: "React + TypeScript dashboard consuming live WebSocket data.",
      backend: "Python 3.12, FastAPI, asyncio-based services, SQLAlchemy + asyncpg.",
      database: "PostgreSQL.",
      realtime: "Kafka event streaming, WebSocket broadcasting, bounded ring buffers for backpressure handling.",
    },
    challenges: [
      "Handling backpressure between async pipeline stages via bounded ring buffers",
      "Keeping decode/process/broadcast stages decoupled through Kafka",
      "Maintaining consistency between streamed backend state and the live frontend view",
      "Observability across a multi-stage async pipeline",
    ],
    conceptTags: [
      "Packet Processing",
      "Async Workers",
      "Kafka Streaming",
      "Event-Driven Architecture",
      "Database Persistence",
      "Real-Time WebSockets",
      "Backpressure Handling",
      "Observability",
      "Dockerized Services",
    ],
    technologies: [
      "Python 3.12",
      "FastAPI",
      "Kafka",
      "PostgreSQL",
      "SQLAlchemy",
      "asyncpg",
      "asyncio",
      "React",
      "TypeScript",
      "WebSockets",
      "Scapy",
      "Prometheus",
      "Grafana",
      "Docker Compose",
      "pytest",
    ],
  },
  {
    slug: "surveillance-monitoring",
    name: "Defence Surveillance & Threat Monitoring System",
    tagline: "Operational monitoring, deployment and real-time alerting",
    github: "https://github.com/Pk1316/surveilence-and-monitoring",
    categories: ["Full Stack", "Backend"],
    featured: true,
    overview:
      "A full-stack surveillance and threat-monitoring application designed around operational monitoring, threat detection, personnel deployment, equipment management and real-time alerts.",
    problem:
      "Coordinating threat detection, personnel deployment and equipment readiness across a monitoring operation needs a unified, role-aware system with live alerting.",
    solution:
      "A role-based FastAPI backend (Admin, Command Officer, Analyst, Operator roles) with JWT auth, backing a React dashboard for monitoring, deployment and equipment management, with Server-Sent Events pushing live alerts.",
    contribution: {
      frontend: "React, Redux, Axios, Recharts, React Hook Form, Vite.",
      backend: "FastAPI, SQLAlchemy, MySQL, JWT, Pydantic.",
      database: "MySQL.",
      realtime:
        "Server-Sent Events (SSE) for intrusion notifications, equipment alerts and high-priority warnings; email notifications.",
    },
    challenges: [
      "Designing a role-based authorization model across 4 distinct roles",
      "Keeping the SSE alert stream consistent with dashboard state",
      "Modeling deployment/equipment domain entities cleanly in MySQL via SQLAlchemy",
    ],
    conceptTags: [
      "Role-Based Access Control",
      "JWT Authentication",
      "Server-Sent Events",
      "Threat Detection",
      "Deployment Management",
      "Analytics Dashboards",
    ],
    technologies: [
      "React",
      "Redux",
      "Axios",
      "Recharts",
      "React Hook Form",
      "Vite",
      "FastAPI",
      "SQLAlchemy",
      "MySQL",
      "JWT",
      "Pydantic",
    ],
    highlight:
      "Monitoring dashboard, threat detection, troop deployment, equipment management and analytics, built with JWT auth and role-based access control across Admin, Command Officer, Analyst and Operator roles.",
  },
  {
    slug: "slot-swapper",
    name: "Slot Swapper",
    tagline: "Scheduling and swap-request platform",
    github: "https://github.com/Pk1316/slot-swapper",
    extraLinks: [
      { label: "Backend repo", url: "https://github.com/Pk1316/slot-swapper-backend" },
      { label: "Frontend repo", url: "https://github.com/Pk1316/slot-swapper-frontend" },
    ],
    categories: ["Backend", "Full Stack", "APIs"],
    featured: true,
    overview:
      "A scheduling and collaboration platform for managing time/assignment slots and requesting swaps between users.",
    problem:
      "Users need to manage assigned time slots and negotiate swaps with each other in an auditable, conflict-safe way.",
    solution:
      "A REST API (Node.js/TypeScript backend, JWT-secured) modeling Users, Slots, SwapRequests and AuditEvents, with a client frontend for slot browsing, filtering and swap requests.",
    contribution: {
      backend:
        "REST API (/api/v1) with JWT auth, CRUD for slots (create/update/delete/filter/paginate), swap request lifecycle (create/approve/reject), user profiles, audit/history tracking, conflict detection, resource authorization.",
      database: "User, Slot, SwapRequest and AuditEvent entities on a PostgreSQL / SQL-compatible database via Prisma/TypeORM.",
      frontend: "Client frontend for slot browsing, filtering and swap requests.",
    },
    challenges: [
      "Conflict detection when two users compete for the same slot",
      "Designing an auditable swap-approval workflow",
      "Resource-level authorization, so only the right users can approve or reject",
    ],
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "JWT", "REST API", "Redis (optional)", "Docker Compose (optional)"],
    highlight:
      "An example of business-oriented backend development. Not just CRUD, but approval workflows, audit trails and conflict handling.",
  },
  {
    slug: "ecommerce-backend",
    name: "E-Commerce Backend",
    tagline: "REST API for buyers, sellers, products and carts",
    github: "https://github.com/Pk1316/ecommerce-backend",
    categories: ["Backend", "APIs"],
    featured: true,
    overview:
      "A backend API for an e-commerce platform supporting authentication, buyers, sellers, products, categories and cart management.",
    problem:
      "An e-commerce platform needs role-based product and cart workflows shared across buyers and sellers, backed by secure authentication.",
    solution:
      "A TypeScript REST API with access-token + refresh-token auth, buyer flows (search, cart add/reduce/remove), seller flows (create/update/delete/list products) and full category CRUD.",
    contribution: {
      backend:
        "TypeScript REST API with a structured src directory; Postman collections for auth, buyer, seller and category flows. Auth: registration, login, access token, refresh token. Products: search, product details, seller product management. Buyer flows: search, cart add/reduce/remove. Seller flows: create/update/delete/list products. Categories: full CRUD.",
    },
    challenges: [
      "Structuring role-based (buyer vs seller) product and cart workflows on a shared product/category schema",
      "Access-token + refresh-token authentication flow",
    ],
    technologies: ["TypeScript", "REST API", "Node.js", "JWT (access + refresh tokens)"],
    highlight: "REST API design, authentication, role-based workflows, CRUD, validation and backend architecture.",
  },
  {
    slug: "doc-summarizer-api",
    name: "Document Summarization API",
    tagline: "Go REST API for AI-powered document summarization",
    github: "https://github.com/Pk1316/doc-summarizer-api",
    categories: ["Backend", "APIs", "AI"],
    featured: true,
    overview:
      "A REST API built in Go that accepts documents/files and generates summaries using Google's Gemini API (Gemini 1.5 Flash).",
    problem:
      "Consumers need a single endpoint that can accept documents in many different forms, whether files, base64 or headers, and reliably produce a summary.",
    solution:
      "A Go REST API exposing POST /summarize with automatic MIME type detection, custom prompt support, and Gemini 1.5 Flash integration for generating summaries.",
    contribution: {
      backend:
        "Go REST API. Supports PDF upload, text upload, markdown input, image input, multipart file upload, base64 input (via JSON body or 'File-Data' header), automatic MIME type detection, custom prompts and Gemini API integration. Endpoints: POST /summarize, GET /health.",
    },
    challenges: [
      "Supporting multiple input encodings (multipart, base64-in-JSON, base64 header) through one endpoint",
      "MIME detection with fallback",
    ],
    technologies: ["Go", "REST API", "Gemini API (Gemini 1.5 Flash)", "File processing"],
    highlight: "API Engineering + File Processing + AI Integration.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const filterCategories: ProjectCategory[] = ["Full Stack", "Backend", "Real-Time", "AI", "APIs"];

// Generic architecture used in "How I Build Systems" section
export interface GenericStage {
  id: string;
  label: string;
  fill: string;
  projectEvidence: { project: string; note: string }[];
}

export const systemArchitecture: GenericStage[] = [
  { id: "frontend", label: "Frontend", fill: "React", projectEvidence: [{ project: "PacketBridge", note: "React + TypeScript dashboard" }, { project: "Surveillance System", note: "React + Redux dashboard" }] },
  { id: "api", label: "API Layer", fill: "FastAPI / REST", projectEvidence: [{ project: "PacketBridge", note: "FastAPI REST + WebSocket layer" }, { project: "Slot Swapper", note: "REST API (/api/v1)" }] },
  { id: "backend", label: "Backend Services", fill: "Python services", projectEvidence: [{ project: "PacketBridge", note: "asyncio-based Python services" }, { project: "E-Commerce Backend", note: "TypeScript REST services" }] },
  { id: "event", label: "Event Layer", fill: "Kafka", projectEvidence: [{ project: "PacketBridge", note: "Kafka event streaming between bridge and processing server" }] },
  { id: "processing", label: "Processing", fill: "Async workers / business logic", projectEvidence: [{ project: "PacketBridge", note: "Decoder worker pool + processing server" }, { project: "Surveillance System", note: "Threat detection & analytics logic" }] },
  { id: "database", label: "Database", fill: "PostgreSQL / MySQL / MongoDB", projectEvidence: [{ project: "PacketBridge", note: "PostgreSQL for telemetry persistence" }, { project: "Surveillance System", note: "MySQL for deployment & equipment data" }] },
  { id: "realtime", label: "Real-Time", fill: "WebSockets / SSE", projectEvidence: [{ project: "PacketBridge", note: "WebSocket broadcasting to dashboard" }, { project: "Surveillance System", note: "SSE for live alerts" }] },
  { id: "visualization", label: "Visualization", fill: "React dashboards", projectEvidence: [{ project: "PacketBridge", note: "Live telemetry dashboard" }, { project: "Surveillance System", note: "Monitoring & analytics dashboard" }] },
];
