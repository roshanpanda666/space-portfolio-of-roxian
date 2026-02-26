"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const fadeInUp = (delay: number = 0) => ({
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
});

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

type ProjectData = {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  highlights: string[];
  gradient: string;
  accentColor: string;
  links: { label: string; url: string }[];
  emoji: string;
};

const PROJECTS: ProjectData[] = [
  {
    title: "Kundalix AI",
    subtitle: "Intelligent Vedic Astrology Platform",
    emoji: "🔮",
    description:
      "A high-performance PWA bridging ancient Vedic astrology with modern AI. Automates Kundali generation through Inngest background pipelines and Gemini 2.5 Flash, with AI-driven chart analysis via Vision LLM.",
    stack: ["Next.js 16", "Inngest", "Gemini 2.5", "MongoDB", "pdf-lib", "Cheerio", "NextAuth"],
    highlights: [
      "Automated AI Kundali via background task pipeline",
      "VED — AI astrological guide with Snapshot Context",
      "Vision LLM for OCR-based chart analysis",
      "Daily horoscope via web scraping",
      "Mobile-first PWA with Service Worker",
    ],
    gradient: "from-indigo-600 to-purple-600",
    accentColor: "text-purple-400",
    links: [
      { label: "GitHub", url: "https://github.com/roshanpanda666/kundalix-ai" },
    ],
  },
  {
    title: "S.A.D.I.A.S.C.",
    subtitle: "Smart AIoT Surveillance & Security System",
    emoji: "🛡️",
    description:
      "A comprehensive full-stack AIoT security ecosystem bridging local edge computing with cloud-based monitoring. Provides face recognition, multi-channel alerts (SMS via Twilio), and real-time cloud dashboards.",
    stack: ["OpenCV", "face_recognition", "Next.js 15", "MongoDB", "Twilio", "Matplotlib", "NextAuth"],
    highlights: [
      "Edge AI face recognition with automated triggers",
      "Multi-channel alerts: Audio, SMS, Visual snapshots",
      "Real-time cloud dashboard with live event streaming",
      "Hybrid sync engine — local AI + cloud push",
      "Matplotlib-based intrusion analytics",
    ],
    gradient: "from-red-600 to-orange-600",
    accentColor: "text-red-400",
    links: [
      { label: "Dashboard", url: "https://github.com/roshanpanda666/sadiasc-web-dashboard" },
      { label: "Local Interface", url: "https://github.com/roshanpanda666/S.A.D.I.A.S.C.-local-interface" },
    ],
  },
  {
    title: "Querify",
    subtitle: "AI-Driven Query Dispatch & Moderator System",
    emoji: "🧠",
    description:
      "A sophisticated ecosystem using an AI Dispatcher (R.O.S.E) that monitors MongoDB Change Streams in real-time and uses Gemini to match user questions with qualified human moderators based on skill profiles.",
    stack: ["Next.js 15", "FastAPI", "Gemini 2.5", "MongoDB", "Pymongo", "NextAuth", "Framer Motion"],
    highlights: [
      "R.O.S.E — AI background worker via FastAPI",
      "Semantic skill-matching with Gemini LLM",
      "Real-time MongoDB Change Streams pipeline",
      "Role-based ecosystem: Learners + Moderators",
      "Auto-assignment with atomic $push operations",
    ],
    gradient: "from-cyan-600 to-blue-600",
    accentColor: "text-cyan-400",
    links: [
      { label: "App", url: "https://github.com/roshanpanda666/querify-app" },
      { label: "AI Engine", url: "https://github.com/roshanpanda666/fast-api-querify-engine" },
    ],
  },
  {
    title: "CPGS Hub",
    subtitle: "AI-Integrated Academic Ecosystem",
    emoji: "🎓",
    description:
      "A comprehensive resource-sharing platform centralizing university life. Combines a multi-branch academic repository with a Gemini AI assistant that answers student queries about syllabi, routines, and exams.",
    stack: ["Next.js 15", "TypeScript", "MongoDB", "Gemini AI", "Tailwind CSS", "NextAuth"],
    highlights: [
      "Multi-branch hub for notes, PYQs, syllabi",
      "Built-in Gemini AI campus assistant",
      "Admin-moderated approval workflows",
      "Dynamic routine & exam schedule trackers",
      "Glassmorphism UI with dynamic theme engine",
    ],
    gradient: "from-violet-600 to-fuchsia-600",
    accentColor: "text-violet-400",
    links: [
      { label: "GitHub", url: "https://github.com/roshanpanda666/hub101" },
    ],
  },
  {
    title: "R.O.S.E",
    subtitle: "Multi-Personality AI Chat Ecosystem",
    emoji: "🌹",
    description:
      "A dynamic chat app featuring a versatile AI engine with distinct personas — from Gen Z 'slay queen' R.O.S.E to brooding Batman. Demonstrates advanced prompt engineering and real-time AI interaction with per-persona UI theming.",
    stack: ["Next.js 15", "React 19", "Gemini 2.5 Flash", "Tailwind CSS 4"],
    highlights: [
      "Multi-persona architecture with UI theme switching",
      "Advanced prompt engineering for consistent voices",
      "R.O.S.E, Nana Patekar, Bruce Wayne personas",
      "Auto-scrolling optimized chat interface",
      "Route Handlers for high-perf streaming",
    ],
    gradient: "from-pink-600 to-rose-600",
    accentColor: "text-pink-400",
    links: [
      { label: "GitHub", url: "https://github.com/roshanpanda666/rose-web-app" },
    ],
  },
  {
    title: "Egg Shop",
    subtitle: "Inventory & POS SaaS for Wholesalers",
    emoji: "🥚",
    description:
      "A full-stack application for poultry wholesalers to manage bulk inventory and retail sales. Automates complex calculations for stock tracking (boxes vs. crates) with real-time COGS-based financial reporting.",
    stack: ["Next.js 14", "MongoDB", "Mongoose", "NextAuth", "jsPDF", "Tailwind CSS"],
    highlights: [
      "Multi-tier purchase & hybrid sales tracking",
      "Automated daily/monthly P&L via COGS model",
      "Downloadable PDF business summaries",
      "Multi-user data isolation with JWT + Bcrypt",
      "Real-time inventory dashboard",
    ],
    gradient: "from-amber-600 to-yellow-600",
    accentColor: "text-amber-400",
    links: [
      { label: "GitHub", url: "https://github.com/roshanpanda666/egg-shop" },
    ],
  },
  {
    title: "Stoxy",
    subtitle: "Smart Store with Computer Vision",
    emoji: "📦",
    description:
      "A modern inventory and order management system with TensorFlow.js COCO-SSD integration for automated stock entry via webcam. Features a real-time admin dashboard for user and order lifecycle management.",
    stack: ["Next.js 13", "TensorFlow.js", "COCO-SSD", "MongoDB", "Mongoose", "Tailwind CSS"],
    highlights: [
      "AI object detection via webcam for stock entry",
      "Real-time admin order lifecycle management",
      "Auto-refreshing dashboard (1s polling)",
      "Active user monitoring panel",
      "Atomic PATCH routes for order status sync",
    ],
    gradient: "from-emerald-600 to-green-600",
    accentColor: "text-emerald-400",
    links: [
      { label: "GitHub", url: "https://github.com/roshanpanda666/stoxy" },
    ],
  },
];

export const Projects = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.05 });

  return (
    <section
      id="projects"
      ref={ref}
      className="relative w-full py-20 px-6 md:px-20 z-[20] overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp(0)}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Projects
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Production-grade systems spanning AI, IoT, SaaS, and full-stack engineering.
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 96 } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-4"
        />
      </motion.div>

      {/* Project Cards */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} inView={inView} />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  inView,
}: {
  project: ProjectData;
  index: number;
  inView: boolean;
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -60 : 60, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.015,
        transition: { duration: 0.25 },
      }}
      className="project-card rounded-2xl overflow-hidden group"
    >
      {/* Gradient Top Accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.3, ease: "easeOut" }}
        style={{ transformOrigin: isEven ? "left" : "right" }}
        className={`h-1.5 bg-gradient-to-r ${project.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.span
                className="text-2xl emoji-reset"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                {project.emoji}
              </motion.span>
              <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                {project.title}
              </h3>
            </div>
            <p className={`${project.accentColor} font-semibold text-sm md:text-base`}>
              {project.subtitle}
            </p>
          </div>
          {/* GitHub Links */}
          <div className="flex gap-2 flex-shrink-0">
            {project.links.map((link) => (
              <motion.div key={link.label} whileHover={{ scale: 1.08, y: -2 }}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="project-link-btn px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all inline-block"
                >
                  {link.label} ↗
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-5 text-sm md:text-base">
          {project.description}
        </p>

        {/* Highlights */}
        <div className="mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.highlights.map((highlight, i) => (
              <motion.div
                key={highlight}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: index * 0.12 + 0.4 + i * 0.06,
                }}
                className="flex items-start gap-2 text-sm text-gray-400"
              >
                <span className={`${project.accentColor} mt-0.5`}>▸</span>
                <span>{highlight}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: index * 0.12 + 0.6 + i * 0.05,
                ease: "backOut",
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="project-tech-tag px-3 py-1 rounded-full text-xs font-medium text-gray-300 cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
