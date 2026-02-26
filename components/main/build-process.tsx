"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BUILD_STEPS = [
  {
    step: 1,
    title: "Wireframing",
    description: "Sketch the user flow and core screens on paper or Excalidraw to nail the UX before touching code.",
    emoji: "✏️",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    step: 2,
    title: "Schema Designing",
    description: "Model the data relationships — collections, fields, indexes — using MongoDB or Prisma schemas.",
    emoji: "🗂️",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    step: 3,
    title: "UI Designing",
    description: "Build high-fidelity mockups in Figma with the design system: colors, typography, spacing, components.",
    emoji: "🎨",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    step: 4,
    title: "Architecture Finalization",
    description: "Lock down the tech stack, API structure, auth flow, and deployment strategy before writing a single line.",
    emoji: "🏗️",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    step: 5,
    title: "Steps & Milestones",
    description: "Break the project into sprint-sized chunks with clear deliverables and deadlines.",
    emoji: "📋",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    step: 6,
    title: "Database Setup",
    description: "Spin up MongoDB Atlas / PostgreSQL, configure connection pooling, seed initial data, and write migration scripts.",
    emoji: "💾",
    gradient: "from-teal-500 to-green-500",
  },
  {
    step: 7,
    title: "Building the UI",
    description: "Component-driven development with Next.js, Tailwind CSS, and Framer Motion — mobile-first, always.",
    emoji: "💻",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    step: 8,
    title: "Backend & API Routes",
    description: "RESTful APIs with Next.js Route Handlers or FastAPI. Auth via NextAuth, validation, error boundaries — the works.",
    emoji: "⚙️",
    gradient: "from-emerald-500 to-yellow-500",
  },
  {
    step: 9,
    title: "Connecting AI Models",
    description: "Two approaches depending on the problem:",
    emoji: "🧠",
    gradient: "from-yellow-500 to-orange-500",
    subSteps: [
      { label: "ML Approach", detail: "Train custom models with TensorFlow / OpenCV for vision, NLP, or anomaly detection." },
      { label: "Agentic LLM", detail: "Integrate Gemini / GPT APIs with prompt engineering, RAG pipelines, and background workers." },
    ],
  },
  {
    step: 10,
    title: "Ship & Host 🚀",
    description: "Deploy on Vercel / Railway, configure CI/CD, set up monitoring, and push to production. Done!",
    emoji: "🚀",
    gradient: "from-orange-500 to-red-500",
  },
];

export const BuildProcess = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  // The progress line height grows from 0% to 100% as user scrolls
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="build-process"
      ref={containerRef}
      className="relative w-full py-20 px-6 md:px-20 z-[20] overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How I{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Build
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          From the first wireframe to production — my end-to-end engineering workflow.
        </p>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-4"
        />
      </motion.div>

      {/* Timeline Container */}
      <div className="max-w-3xl mx-auto relative">
        {/* Static background track */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-800/50 rounded-full" />

        {/* Animated progress line */}
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-6 md:left-8 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-green-500 rounded-full origin-top"
        />

        {/* Steps */}
        <div className="flex flex-col gap-12">
          {BUILD_STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative pl-16 md:pl-20"
            >
              {/* Step Node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={`absolute left-3 md:left-5 top-1 w-7 h-7 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-xs font-bold text-white shadow-lg z-10`}
              >
                {step.step}
              </motion.div>

              {/* Card */}
              <div className="build-step-card p-5 md:p-6 rounded-xl group">
                <div className="flex items-center gap-3 mb-2">
                  <motion.span
                    className="text-xl emoji-reset"
                    whileHover={{ rotate: [0, -12, 12, 0], scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    {step.emoji}
                  </motion.span>
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Sub-steps for AI (step 9) */}
                {step.subSteps && (
                  <div className="mt-3 flex flex-col gap-2">
                    {step.subSteps.map((sub, i) => (
                      <motion.div
                        key={sub.label}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                        className="build-substep-card flex items-start gap-3 px-4 py-3 rounded-lg"
                      >
                        <span className="text-purple-400 font-bold text-xs mt-0.5 whitespace-nowrap">
                          {i + 1}.
                        </span>
                        <div>
                          <span className="text-white text-sm font-semibold">
                            {sub.label}
                          </span>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {sub.detail}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
