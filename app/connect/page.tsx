"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  RxGithubLogo,
  RxLinkedinLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxEnvelopeClosed,
} from "react-icons/rx";
import { SiMedium, SiPinterest } from "react-icons/si";

import { Typewriter } from "react-simple-typewriter";

const SOCIALS = [
  { icon: RxGithubLogo, link: "https://github.com/roshanpanda666", label: "GitHub", color: "hover:text-gray-100" },
  { icon: RxLinkedinLogo, link: "https://www.linkedin.com/in/sabyasachi-panda-351870256/", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: RxInstagramLogo, link: "https://www.instagram.com/0xsabyasachi/", label: "Instagram", color: "hover:text-pink-400" },
  { icon: RxTwitterLogo, link: "https://x.com/Roshan_panda007", label: "X", color: "hover:text-sky-400" },
  { icon: RxEnvelopeClosed, link: "mailto:sabyasachipanda410@gmail.com", label: "Email", color: "hover:text-yellow-400" },
  { icon: SiMedium, link: "https://medium.com/@sabyasachipanda410", label: "Medium", color: "hover:text-green-400" },
  { icon: SiPinterest, link: "https://in.pinterest.com/sabyasachipanda410/", label: "Pinterest", color: "hover:text-red-400" },
];

export default function ConnectPage() {
  const [roseInput, setRoseInput] = useState("");
  const [roseReply, setRoseReply] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const askRose = async () => {
    const trimmed = roseInput.trim();
    if (!trimmed || isAsking) return;

    setIsAsking(true);
    setRoseReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: [] }),
      });
      const data = await res.json();
      setRoseReply(data.response || data.error || "hmm, try again? 💀");
    } catch {
      setRoseReply("oops, something broke 😵‍💫");
    } finally {
      setIsAsking(false);
      setRoseInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      askRose();
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#030014]">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm mb-10 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left min-h-[220px]"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Let&apos;s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                  Connect
                </span>
              </h1>
              <div className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 h-[100px]">
                I&apos;m <strong className="text-white">Sabyasachi Panda</strong> (Roshan) —
                a{" "}
                <span className="text-purple-400 font-bold">
                  <Typewriter
                    words={[
                      "Fullstack Engineer",
                      "AI Enthusiast",
                      "IoT Systems Tinkerer",
                      "Creative Developer"
                    ]}
                    loop={true}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
                <br />
                Always down to collaborate on ambitious projects or just geek out about tech.
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {SOCIALS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: "backOut" }}
                >
                  <Link
                    href={s.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`connect-social-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 ${s.color} transition-all duration-300 text-sm font-medium border border-transparent`}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div 
               initial={{ opacity: 0, scaleX: 0 }}
               whileInView={{ opacity: 1, scaleX: 1 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent origin-center" 
            />

            {/* R.O.S.E. Prompt Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="emoji-reset text-xl">🌹</span>
                <h2 className="text-white font-semibold text-lg">
                  Ask{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    R.O.S.E.
                  </span>
                </h2>
                <span className="text-gray-600 text-xs ml-1">— my AI assistant</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Ask about my projects, tech stack, experience, or anything else. R.O.S.E. knows it all.
              </p>

              <div className="connect-rose-input flex items-center gap-2 px-4 py-3 rounded-xl border border-white/5 bg-white/2 shadow-inner">
                <input
                  type="text"
                  value={roseInput}
                  onChange={(e) => setRoseInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about Roshan..."
                  disabled={isAsking}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none"
                />
                <button
                  onClick={askRose}
                  disabled={isAsking || !roseInput.trim()}
                  className="rose-hero-send px-4 py-2 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-30 relative overflow-hidden group"
                >
                  <span className="relative z-10">{isAsking ? "..." : "Ask"}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>

              {/* Reply */}
              {roseReply && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rose-hero-reply mt-4 px-5 py-4 rounded-xl text-sm text-gray-200 leading-relaxed border border-purple-500/20 bg-purple-500/5 shadow-2xl backdrop-blur-xl"
                >
                  <span className="text-purple-400 font-semibold text-xs mr-1">
                    R.O.S.E.
                  </span>
                  {roseReply}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Interactive Image */}
          <ConnectVisual />
        </div>
      </div>
    </main>
  );
}

/* ---------- Interactive 3D Visual ---------- */
const ConnectVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 80,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 80,
    damping: 25,
  });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
      className="relative flex justify-center items-center h-[500px]"
    >
      {/* Central Nucleus */}
      <div className="absolute w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] animate-pulse" />
      <div className="absolute w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] z-10" />

      {/* Orbiting ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full border border-purple-500/10 shadow-[0_0_20px_rgba(112,66,248,0.05)]"
      />
      
      {/* Orbiting ring 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute w-[340px] h-[340px] md:w-[440px] md:h-[440px] rounded-full border border-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
      />

      {/* Orbiting Atom 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[420px] h-[420px] md:w-[520px] md:h-[520px]"
        style={{ transformOrigin: "center" }}
      >
        <div className="absolute top-0 left-1/2 -ms-2 w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)] z-30" />
      </motion.div>

      {/* Orbiting Atom 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[340px] h-[340px] md:w-[440px] md:h-[440px]"
        style={{ transformOrigin: "center" }}
      >
        <div className="absolute bottom-0 left-1/2 -ms-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-30" />
      </motion.div>
      
      {/* 3D Tilt Image */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="relative cursor-pointer z-20"
      >
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotateZ: [-1, 1, -1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/hero-bg.svg"
            alt="tech visualization"
            width={480}
            height={480}
            draggable={false}
            className="select-none drop-shadow-[0_0_80px_rgba(112,66,248,0.25)] filter blur-[0.3px] hover:blur-0 transition-all duration-700"
          />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20 * (i + 1), 0],
            x: [0, 10 * (i % 2 ? 1 : -1), 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
          className={`absolute w-${1 + (i % 2)} h-${1 + (i % 2)} rounded-full bg-purple-500/30 blur-sm`}
          style={{
            top: `${20 + i * 15}%`,
            left: `${30 + i * 10}%`,
          }}
        />
      ))}
    </motion.div>
  );
};
