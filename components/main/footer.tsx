"use client";

import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="relative w-full py-10 px-6 z-[20]">
      {/* Gradient Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-8" />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="text-gray-500 text-sm text-center"
        >
          Designed & built by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium">
            Sabyasachi Panda
          </span>{" "}
          — powered by caffeine, code & curiosity{" "}
          <span className="emoji-reset">☕</span>
        </motion.p>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-600 text-xs"
        >
          © {new Date().getFullYear()} Roshan Panda. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};
