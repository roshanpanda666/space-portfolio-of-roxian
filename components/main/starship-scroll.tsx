"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

export const StarshipScroll = () => {
  const { scrollYProgress } = useScroll();
  const [message, setMessage] = useState<string>("Ready for launch!");
  const [showMechazilla, setShowMechazilla] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  // Map scroll progress to vertical position (from top to bottom of viewport)
  // We use 10vh to 80vh so it stops right between the Mechazilla arms at the bottom
  const yPos = useTransform(scrollYProgress, [0, 1], ["10vh", "82vh"]);

  // Subtle horizontal sway on the way down
  const xPos = useTransform(scrollYProgress, (p) => {
    // Stop swaying if we are at the very bottom (landing) or launching up
    if (p > 0.95 || isLaunching) return 0;
    return Math.sin(p * Math.PI * 6) * 15;
  });

  // Checkpoints mapping based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isLaunching) return;

    if (latest >= 0.98) {
      setMessage("Launch the rocket to get to the top by clicking me! 🚀");
      setShowMechazilla(true);
      setHasLanded(true);
    } else if (latest > 0.75) {
      setMessage("Processing the Build... almost there.");
      setShowMechazilla(false);
      setHasLanded(false);
    } else if (latest > 0.55) {
      setMessage("GitHub streak is on fire! 🔥");
      setShowMechazilla(false);
      setHasLanded(false);
    } else if (latest > 0.35) {
      setMessage("Deploying Projects...");
      setShowMechazilla(false);
      setHasLanded(false);
    } else if (latest > 0.15) {
      setMessage("Scanning the Skills... impressive.");
      setShowMechazilla(false);
      setHasLanded(false);
    } else {
      setMessage("Ready for launch!");
      setShowMechazilla(false);
      setHasLanded(false);
    }
  });

  const launchToTop = useCallback(() => {
    if (!hasLanded) return;
    
    setIsLaunching(true);
    setMessage("We escaped the orbit and now in space! 🌌");
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Reset launch state after scroll finishes (roughly 1.5s)
    setTimeout(() => {
      setIsLaunching(false);
      setMessage("Ready for launch!");
    }, 1500);
  }, [hasLanded]);

  return (
    <>
      {/* Mechazilla Arms (Fixed at bottom right) */}
      <AnimatePresence>
        {showMechazilla && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed bottom-0 right-2 md:right-8 z-40 pointer-events-none"
            style={{ width: "100px", height: "130px" }}
          >
            {/* SVG for Mechazilla Arms/Tower */}
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
              {/* Tower Base */}
              <rect x="70" y="20" width="30" height="130" fill="#2d2d3a" />
              <rect x="75" y="25" width="20" height="125" fill="#1a1a24" />
              
              {/* Cross braces */}
              <path d="M75 30 L95 50 M95 30 L75 50 M75 70 L95 90 M95 70 L75 90 M75 110 L95 130 M95 110 L75 130" stroke="#3d3d4a" strokeWidth="2" />
              
              {/* Chopstick Arms open to catch the rocket */}
              {/* Top Arm */}
              <path d="M70 60 L10 60 L10 65 L70 65 Z" fill="#b0b0c0" />
              <path d="M20 65 L30 75 L70 75 Z" fill="#808090" />
              {/* Bottom Arm */}
              <path d="M70 110 L10 110 L10 115 L70 115 Z" fill="#b0b0c0" />
              <path d="M20 110 L30 100 L70 100 Z" fill="#808090" />
              
              {/* Catch pads */}
              <rect x="15" y="55" width="10" height="12" fill="#ff4d4d" rx="2" />
              <rect x="15" y="103" width="10" height="12" fill="#ff4d4d" rx="2" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Starship Rocket (Fixed position traveling up/down) */}
      <motion.div
        className="fixed z-50 right-6 md:right-16 flex flex-col items-center"
        style={{
          y: isLaunching ? "-20vh" : yPos,
          x: xPos,
        }}
        animate={isLaunching ? { y: "-20vh" } : {}}
        transition={isLaunching ? { duration: 1.2, ease: "easeIn" } : { type: "tween", ease: "linear", duration: 0.1 }}
      >
        {/* Chat Bubble / Speech Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-[55px] top-2 whitespace-nowrap bg-[rgba(3,0,20,0.85)] border border-[rgba(112,66,248,0.4)] text-[rgba(255,255,255,0.9)] px-3 py-1.5 rounded-2xl rounded-tr-none text-[10px] md:text-xs shadow-[0_0_15px_rgba(112,66,248,0.3)] backdrop-blur-md font-medium ${hasLanded ? "cursor-pointer hover:bg-[rgba(112,66,248,0.2)]" : ""}`}
            onClick={launchToTop}
          >
            <span className="mr-1 text-purple-400">Elon:</span> {message}
            {/* Tail of the speech bubble */}
            <div className="absolute top-0 -right-2 w-0 h-0 border-t-[8px] border-t-[rgba(3,0,20,0.85)] border-r-[12px] border-r-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* The Rocket */}
        <div 
          className={`relative w-[45px] h-[105px] ${hasLanded ? "cursor-pointer" : ""}`}
          onClick={launchToTop}
          style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))" }}
        >
          {/* Main Starship SVG */}
          <svg viewBox="0 0 60 140" className="w-full h-full">
            {/* Rocket Body (Silver/Steel) */}
            <path
              d="M30 0 C45 20, 50 60, 50 110 L10 110 C10 60, 15 20, 30 0 Z"
              fill="url(#steelGradient)"
            />
            
            {/* Heat Shield (Black tiles on right side) */}
            <path
              d="M30 0 C45 20, 50 60, 50 110 L30 110 Z"
              fill="#1e1e1e"
            />
            
            {/* Heat shield horizontal tile lines (subtle) */}
            <path d="M32 20 L44 23 M34 40 L48 43 M32 60 L49 60 M34 80 L50 78 M32 100 L49 97" stroke="#0a0a0a" strokeWidth="1" opacity="0.5" />

            {/* Top Flaps */}
            <path d="M18 20 L5 35 L12 45 Z" fill="#888" />
            <path d="M42 20 L55 35 L48 45 Z" fill="#222" />

            {/* Bottom Flaps */}
            <path d="M12 80 L0 105 L10 115 Z" fill="#888" />
            <path d="M48 80 L60 105 L50 115 Z" fill="#222" />

            {/* Engine Skirt */}
            <rect x="15" y="110" width="30" height="10" fill="#333" rx="2" />
            <rect x="20" y="120" width="8" height="5" fill="#111" />
            <rect x="32" y="120" width="8" height="5" fill="#111" />

            {/* The Window */}
            <circle cx="25" cy="45" r="8" fill="#a0e0ff" stroke="#444" strokeWidth="1.5" />
            {/* Window glare */}
            <path d="M20 42 Q25 38 28 42" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />

            {/* Gradients */}
            <defs>
              <linearGradient id="steelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dcdcdc" />
                <stop offset="50%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#999" />
              </linearGradient>
            </defs>
          </svg>

          {/* Elon in the Window (HTML over SVG for easier positioning) */}
          <div className="absolute top-[29px] left-[14px] w-[9px] h-[9px] rounded-full bg-transparent overflow-hidden pointer-events-none">
            {/* Simplified Elon Face SVG */}
            <svg viewBox="0 0 20 20" className="w-full h-full">
              {/* Face */}
              <circle cx="10" cy="10" r="8" fill="#fcdbb4" />
              {/* Hair (Brown) */}
              <path d="M2 10 C2 4, 18 4, 18 10 C16 6, 4 6, 2 10 Z" fill="#4a3020" />
              {/* Eyes */}
              <circle cx="7" cy="9" r="1.5" fill="#000" />
              <circle cx="13" cy="9" r="1.5" fill="#000" />
              {/* Smile */}
              <path d="M7 13 Q10 16 13 13" stroke="#000" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Exhaust Flame (Only visible when launching) */}
          <AnimatePresence>
            {isLaunching && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="absolute top-[94px] left-[11px] w-[22px] h-[60px] origin-top pointer-events-none"
              >
                <svg viewBox="0 0 30 80" className="w-full h-full">
                  <motion.path
                    animate={{
                      d: [
                        "M0 0 L15 80 L30 0 Z",
                        "M5 0 L15 60 L25 0 Z",
                        "M-5 0 L15 90 L35 0 Z",
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    fill="url(#flameGradient)"
                  />
                  <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="20%" stopColor="#4df" />
                      <stop offset="60%" stopColor="#f40" />
                      <stop offset="100%" stopColor="rgba(255,0,0,0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
