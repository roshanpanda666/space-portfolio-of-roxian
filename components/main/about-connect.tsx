"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  RxGithubLogo,
  RxLinkedinLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxEnvelopeClosed,
} from "react-icons/rx";
import { SiMedium, SiPinterest } from "react-icons/si";
import { useInView } from "react-intersection-observer";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    icon: RxGithubLogo,
    link: "https://github.com/roshanpanda666",
    color: "hover:text-gray-300",
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: "https://www.linkedin.com/in/sabyasachi-panda-351870256/",
    color: "hover:text-blue-400",
  },
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://www.instagram.com/0xsabyasachi/",
    color: "hover:text-pink-400",
  },
  {
    name: "X (Twitter)",
    icon: RxTwitterLogo,
    link: "https://x.com/Roshan_panda007",
    color: "hover:text-sky-400",
  },
  {
    name: "Email",
    icon: RxEnvelopeClosed,
    link: "mailto:sabyasachipanda410@gmail.com",
    color: "hover:text-yellow-400",
  },
  {
    name: "Medium",
    icon: SiMedium,
    link: "https://medium.com/@sabyasachipanda410",
    color: "hover:text-green-400",
  },
  {
    name: "Pinterest",
    icon: SiPinterest,
    link: "https://in.pinterest.com/sabyasachipanda410/",
    color: "hover:text-red-400",
  },
];

const COMPETENCIES = [
  {
    title: "Full-Stack Engineering",
    description:
      "Expert in the Next.js ecosystem (v13–16), utilizing TypeScript and Tailwind CSS to build high-performance, responsive web applications.",
    icon: "🚀",
  },
  {
    title: "AI Integration",
    description:
      "Proficient in orchestrating LLMs (Gemini API) for specialized tasks like astrological chart generation, automated content moderation, and semantic query routing.",
    icon: "🧠",
  },
  {
    title: "Computer Vision & Edge",
    description:
      "Experienced in building real-time detection systems using OpenCV and TensorFlow.js for security and inventory automation.",
    icon: "👁️",
  },
  {
    title: "Backend & Cloud",
    description:
      "Skilled in architecting scalable backends with FastAPI (Python) and Node.js, managed via MongoDB Atlas and automated pipelines like Inngest.",
    icon: "☁️",
  },
  {
    title: "Security & SaaS Logic",
    description:
      "Specialized in multi-user data isolation, role-based access control (RBAC), and secure authentication using Next-Auth.",
    icon: "🔒",
  },
];

const CURRENTLY_EXPLORING = [
  {
    title: "Agentic AI Systems",
    description:
      "Building autonomous agents that go beyond simple chat — event-driven dispatchers, background AI workers, and multi-step reasoning pipelines.",
    icon: "🤖",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Edge Computing & AIoT",
    description:
      "Deploying vision models on Raspberry Pi and ESP32 for real-time surveillance, inventory scanning, and smart campus infrastructure.",
    icon: "📡",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Developer Tooling",
    description:
      "Leveraging Claude Code, Ollama, and custom LLM workflows to accelerate development velocity and automate repetitive engineering tasks.",
    icon: "⚡",
    gradient: "from-green-500 to-teal-500",
  },
  {
    title: "SaaS Architecture",
    description:
      "Designing multi-tenant systems with RBAC, COGS-based financial engines, and real-time data sync for niche industry verticals.",
    icon: "🏗️",
    gradient: "from-orange-500 to-yellow-500",
  },
];

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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const AboutConnect = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <section
      id="connect"
      ref={ref}
      className="relative w-full py-20 px-6 md:px-20 z-[20]"
    >
      {/* Section Header */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp(0)}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          About Me &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Connect
          </span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
      </motion.div>

      {/* Bio Card */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp(0.1)}
        className="about-glass-card max-w-4xl mx-auto p-8 md:p-10 mb-16 rounded-2xl"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Sabyasachi Panda
        </h3>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold text-lg mb-6">
          Full-Stack Developer & AI Systems Engineer
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          I am a results-driven software engineer and university student with a deep passion
          for building intelligent, full-stack ecosystems. My work sits at the intersection of{" "}
          <span className="text-purple-400 font-medium">Artificial Intelligence</span>,{" "}
          <span className="text-cyan-400 font-medium">Computer Vision</span>, and{" "}
          <span className="text-pink-400 font-medium">SaaS architecture</span>, where I
          transform complex technical challenges into user-centric digital products.
        </p>
        <p className="text-gray-400 leading-relaxed italic border-l-2 border-purple-500 pl-4">
          Driven by the philosophy of &quot;AI Beyond Chatbots,&quot; I specialize in creating
          autonomous systems that interact with the real world—from event-driven query
          dispatchers to AIoT surveillance frameworks.
        </p>
      </motion.div>

      {/* Core Competencies */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="max-w-6xl mx-auto mb-16"
      >
        <motion.h3
          variants={fadeInUp()}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
        >
          Core{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Competencies
          </span>
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPETENCIES.map((comp) => (
            <motion.div
              key={comp.title}
              variants={fadeInUp()}
              className="about-glass-card p-6 rounded-xl group hover:scale-[1.03] transition-transform duration-300"
            >
              <span className="text-3xl mb-3 block">{comp.icon}</span>
              <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                {comp.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {comp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Currently Exploring */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="max-w-6xl mx-auto mb-16"
      >
        <motion.h3
          variants={fadeInUp()}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
        >
          Currently{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Exploring
          </span>
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURRENTLY_EXPLORING.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp()}
              className="about-glass-card p-6 rounded-xl group hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="text-white font-semibold text-lg">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What I Bring */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp(0.2)}
        className="about-glass-card max-w-4xl mx-auto p-8 md:p-10 mb-16 rounded-2xl text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          What I Bring to the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Table
          </span>
        </h3>
        <p className="text-gray-300 leading-relaxed">
          I don&apos;t just write code; I design systems. Whether it&apos;s building a mobile-first
          PWA or training a vision model to identify warehouse stock, I focus on{" "}
          <span className="text-purple-400 font-medium">reliability</span>,{" "}
          <span className="text-cyan-400 font-medium">speed</span>, and{" "}
          <span className="text-pink-400 font-medium">real-world utility</span>. I am always
          looking for opportunities to leverage emerging AI technologies to solve niche
          industrial and academic problems.
        </p>
      </motion.div>

      {/* Connect / Social Links */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h3
          variants={fadeInUp()}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Let&apos;s{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Connect
          </span>
        </motion.h3>
        <motion.p
          variants={fadeInUp()}
          className="text-gray-400 mb-8"
        >
          Feel free to reach out via any of these platforms.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-4"
        >
          {SOCIAL_LINKS.map((social) => (
            <motion.div key={social.name} variants={fadeInUp()}>
              <Link
                href={social.link}
                target="_blank"
                rel="noreferrer noopener"
                className={`about-social-btn flex items-center gap-2 px-5 py-3 rounded-xl text-gray-300 ${social.color} transition-all duration-300`}
              >
                <social.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{social.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
