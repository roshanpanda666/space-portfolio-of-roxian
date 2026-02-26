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

const SOCIALS = [
  { icon: RxGithubLogo, link: "https://github.com/roshanpanda666", label: "GitHub" },
  { icon: RxLinkedinLogo, link: "https://www.linkedin.com/in/sabyasachi-panda-351870256/", label: "LinkedIn" },
  { icon: RxInstagramLogo, link: "https://www.instagram.com/0xsabyasachi/", label: "Instagram" },
  { icon: RxTwitterLogo, link: "https://x.com/Roshan_panda007", label: "X" },
  { icon: RxEnvelopeClosed, link: "mailto:sabyasachipanda410@gmail.com", label: "Email" },
  { icon: SiMedium, link: "https://medium.com/@sabyasachipanda410", label: "Medium" },
  { icon: SiPinterest, link: "https://in.pinterest.com/sabyasachipanda410/", label: "Pinterest" },
];

export const Footer = () => {
  return (
    <footer className="relative w-full py-10 px-6 z-[20]">
      {/* Gradient Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-8" />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Social Icons Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.link}
              target="_blank"
              rel="noreferrer noopener"
              className="footer-icon-btn w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all duration-300"
              aria-label={s.label}
            >
              <s.icon className="w-4 h-4" />
            </Link>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-500 text-sm text-center"
        >
          Designed & built by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium">
            Sabyasachi Panda
          </span>{" "}
          — powered by caffeine, code & curiosity ☕
        </motion.p>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-gray-600 text-xs"
        >
          © {new Date().getFullYear()} Roshan Panda. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};
