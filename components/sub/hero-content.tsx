"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
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
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-center lg:text-start w">
        {/* 🔮 Welcome Badge */}
        <div className="flex justify-center items-center lg:justify-start">
          <motion.div
            variants={slideInFromTop}
            className="Welcome-box py-4 px-6 bg-[#0702158e] shadow-lg lg:shadow-[#2A0E61]/50 lg:bg-[#03001427] backdrop-blur-md rounded-xl "
          >
            <div className="flex items-center">
              <SparklesIcon className="text-[#b49bff] mr-3 h-6 w-6" />
              <div className="Welcome-text text-3xl text-white font-semibold">
                <Typewriter
                  words={[
                    "Sabyasachi Panda (Roshan)",
                    "• Fullstack Developer",
                    "• AI enthusiast",
                    "• IoT Systems tinkerer",
                    "• GUI Designer",
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={50}
                  deleteSpeed={30}
                  delaySpeed={2000}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🚀 Hero Title */}
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              next-gen
            </span>{" "}
            intelligent systems.
          </span>
        </motion.div>

        {/* 🧠 Hero Description */}
        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          I&apos;m{" "}
          <strong className="text-white">Sabyasachi</strong>, a multi-stack
          developer obsessed with innovation. I specialize in{" "}
          <span className="text-purple-400 font-semibold">
            Fullstack Development
          </span>
          ,{" "}
          <span className="text-cyan-400 font-semibold">AI/ML</span>,{" "}
          <span className="text-pink-400 font-semibold">IoT Systems</span>, and{" "}
          <span className="text-green-400 font-semibold">GUI Design</span>.
          With tools like <strong>Next.js</strong>,{" "}
          <strong>TensorFlow</strong>, <strong>LangChain</strong>,{" "}
          <strong>MongoDB</strong> &amp; more — I craft tech that&apos;s not
          just functional but futuristic.
        </motion.p>

        {/* 🌹 R.O.S.E. Quick Input */}
        <motion.div
          variants={slideInFromLeft(1)}
          className="max-w-[480px] w-full"
        >
          <div className="rose-hero-input-wrapper flex items-center gap-2 px-3 py-2 rounded-xl">
            <span className="text-lg flex-shrink-0">🌹</span>
            <input
              type="text"
              value={roseInput}
              onChange={(e) => setRoseInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask R.O.S.E. anything..."
              disabled={isAsking}
              className="rose-hero-input flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            />
            <button
              onClick={askRose}
              disabled={isAsking || !roseInput.trim()}
              className="rose-hero-send px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-30"
            >
              {isAsking ? "..." : "Ask"}
            </button>
          </div>

          {/* R.O.S.E. Reply Bubble */}
          {roseReply && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rose-hero-reply mt-3 px-4 py-3 rounded-xl text-sm text-gray-200 leading-relaxed"
            >
              <span className="text-purple-400 font-semibold text-xs mr-1">
                R.O.S.E.
              </span>
              {roseReply}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 👨‍💻 Hero Image */}
      <div className="lg:block hidden">
        <motion.div
          variants={slideInFromRight(0.8)}
          className="w-full h-full flex justify-center items-center "
        >
          <Image
            src="/hero-bg.svg"
            alt="work icons"
            height={650}
            width={650}
            draggable={false}
            className="select-none"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
