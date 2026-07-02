import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiNestjs,
  SiExpress,
  SiFastapi,
  SiNodedotjs,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiPrisma,
  SiDocker,
  SiLinux,
  SiGithubactions,
  SiNginx,
  SiOpenai,
  SiLangchain,
  SiGit,
  SiPostman,
  SiFigma,
} from "react-icons/si";
import { FaAws, FaCode, FaLinux } from "react-icons/fa";

import {
  Code2,
  Database,
  Cloud,
  BrainCircuit,
  Wrench,
} from "lucide-react";

export const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    level: "Advanced",
    backgroundIcon: SiReact,
    technologies: [
      {
        name: "React",
        icon: SiReact,
        color: "#61DAFB",
      },
      {
        name: "Next.js",
        icon: SiNextdotjs,
        color: "#000000",
      },
      {
        name: "TypeScript",
        icon: SiTypescript,
        color: "#3178C6",
      },
      {
        name: "Tailwind CSS",
        icon: SiTailwindcss,
        color: "#38BDF8",
      },
      {
        name: "Framer Motion",
        icon: SiFramer,
        color: "#A259FF",
      },
    ],
  },

  {
    title: "Backend",
    icon: Code2,
    level: "Advanced",
    backgroundIcon: SiNestjs,
    technologies: [
      {
        name: "NestJS",
        icon: SiNestjs,
        color: "#E0234E",
      },
      {
        name: "Express",
        icon: SiExpress,
        color: "#000000",
      },
      {
        name: "FastAPI",
        icon: SiFastapi,
        color: "#009688",
      },
      {
        name: "Node.js",
        icon: SiNodedotjs,
        color: "#5FA04E",
      },
      {
        name: "GraphQL",
        icon: SiGraphql,
        color: "#E10098",
      },
    ],
  },

  {
    title: "Database",
    icon: Database,
    level: "Advanced",
    backgroundIcon: SiPostgresql,
    technologies: [
      {
        name: "PostgreSQL",
        icon: SiPostgresql,
        color: "#4169E1",
      },
      {
        name: "MongoDB",
        icon: SiMongodb,
        color: "#47A248",
      },
      {
        name: "Redis",
        icon: SiRedis,
        color: "#DC382D",
      },
      {
        name: "Prisma",
        icon: SiPrisma,
        color: "#000000",
      },
    ],
  },

  {
    title: "Cloud",
    icon: Cloud,
    level: "Intermediate",
    backgroundIcon: SiDocker,
    technologies: [
      {
        name: "Docker",
        icon: SiDocker,
        color: "#2496ED",
      },
      {
        name: "AWS",
        icon: FaAws,
        color: "#FF9900",
      },
      {
        name: "Linux",
        icon: FaLinux,
        color: "#FCC624",
      },
      {
        name: "GitHub Actions",
        icon: SiGithubactions,
        color: "#2088FF",
      },
      {
        name: "Nginx",
        icon: SiNginx,
        color: "#009639",
      },
    ],
  },

  {
    title: "AI",
    icon: BrainCircuit,
    level: "Intermediate",
    backgroundIcon: SiOpenai,
    technologies: [
      {
        name: "OpenAI",
        icon: SiOpenai,
        color: "#10A37F",
      },
      {
        name: "LangChain",
        icon: SiLangchain,
        color: "#00C853",
      },
      {
        name: "RAG",
        icon: BrainCircuit,
        color: "#8B5CF6",
      },
      {
        name: "Vector Search",
        icon: Database,
        color: "#06B6D4",
      },
      {
        name: "Embeddings",
        icon: BrainCircuit,
        color: "#F59E0B",
      },
    ],
  },

  {
    title: "Tools",
    icon: Wrench,
    level: "Advanced",
    backgroundIcon: SiGit,
    technologies: [
      {
        name: "Git",
        icon: SiGit,
        color: "#F05032",
      },
      {
        name: "VS Code",
        icon: FaCode,
        color: "#007ACC",
      },
      {
        name: "Postman",
        icon: SiPostman,
        color: "#FF6C37",
      },
      {
        name: "Figma",
        icon: SiFigma,
        color: "#F24E1E",
      },
    ],
  },
];