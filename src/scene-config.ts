import { Braces, Cpu, Database } from "lucide-react";

export const sceneModes = [
  {
    id: "core",
    label: "Core",
    number: "01",
    title: "Backend engineering",
    description: "Mengubah aturan bisnis menjadi sistem yang saling terhubung.",
    stack: "PHP / LARAVEL / NODE.JS",
    accent: "#2563eb",
    rgb: "37, 99, 235",
    rotation: 0,
    Icon: Braces,
  },
  {
    id: "data",
    label: "Data",
    number: "02",
    title: "Connected by data",
    description:
      "Menelusuri relasi, menjaga konsistensi, dan membuat data bermakna.",
    stack: "POSTGRESQL / ORACLE / REDIS",
    accent: "#1675c5",
    rgb: "22, 117, 197",
    rotation: -0.32,
    Icon: Database,
  },
  {
    id: "ai",
    label: "AI",
    number: "03",
    title: "Curiosity, amplified",
    description:
      "Mengeksplorasi agents dan AI untuk workflow developer yang lebih baik.",
    stack: "CLAUDE CODE / CODEX / AGENTS",
    accent: "#4966cf",
    rgb: "73, 102, 207",
    rotation: 0.32,
    Icon: Cpu,
  },
] as const;

export type SceneMode = (typeof sceneModes)[number];
