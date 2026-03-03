"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useVelocity } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

export const StarshipScroll = () => {
  const { scrollYProgress } = useScroll();
  const [message, setMessage] = useState<string>("Ready for launch!");
  const [showMechazilla, setShowMechazilla] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [hideMessage, setHideMessage] = useState(false);
  const [isLandingBurn, setIsLandingBurn] = useState(false);
  const [armsClosed, setArmsClosed] = useState(false);
  const [boosterDetached, setBoosterDetached] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Map scroll progress to vertical position (from top to bottom of viewport)
  // We use 10vh to 80vh so it stops right between the Mechazilla arms at the bottom
  const yPos = useTransform(scrollYProgress, [0, 1], ["10vh", "82vh"]);

  // Subtle horizontal sway on the way down
  const xPos = useTransform(scrollYProgress, (p) => {
    // Stop swaying if we are at the very bottom (landing) or launching up
    if (p > 0.95 || isLaunching) return 0;
    return Math.sin(p * Math.PI * 6) * 15;
  });

  const scrollVel = useVelocity(scrollYProgress);
  const xVel = useVelocity(xPos);

  // When scrolling down (positive vel), flaps angle up to brake
  const flapAngleLeft = useTransform(scrollVel, [-0.5, 0, 0.5], [-15, 0, 50]);
  const flapAngleRight = useTransform(scrollVel, [-0.5, 0, 0.5], [15, 0, -50]);
  
  // Thrusters (fire opposite to lateral movement)
  // positive xVel = moving right = fire left thruster
  const thrustLeftOp = useTransform(xVel, [5, 30], [0, 0.8]);
  // negative xVel = moving left = fire right thruster
  const thrustRightOp = useTransform(xVel, [-5, -30], [0, 0.8]);

  // Hide message after 5 seconds of landing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasLanded && !isLaunching) {
      timer = setTimeout(() => {
        setHideMessage(true);
      }, 5000);
    } else {
      setHideMessage(false);
    }
    return () => clearTimeout(timer);
  }, [hasLanded, isLaunching]);

  // Checkpoints mapping based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isLaunching) return;

    if (latest >= 0.98) {
      setMessage("Launch the rocket to get to the top by clicking me! 🚀");
      setShowMechazilla(true);
      setHasLanded(true);
      setIsLandingBurn(false);
      setArmsClosed(true);
    } else if (latest > 0.92) {
      setMessage("Preparing for landing catch...");
      setIsLandingBurn(true);
      setArmsClosed(false);
      setShowMechazilla(true);
      setHasLanded(false);
    } else if (latest > 0.75) {
      setMessage("Processing the Build... almost there.");
      setShowMechazilla(false);
      setHasLanded(false);
      setIsLandingBurn(false);
      setArmsClosed(false);
    } else if (latest > 0.55) {
      setMessage("GitHub streak is on fire! 🔥");
      setShowMechazilla(false);
      setHasLanded(false);
      setIsLandingBurn(false);
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
      setBoosterDetached(false);
    }
  });

  const launchToTop = useCallback(() => {
    if (!hasLanded) return;
    
    setIsLaunching(true);
    setArmsClosed(false);
    setMessage("Ignition... Lift off!");
    
    // Stage separation logic (happens later, when approaching the top)
    setTimeout(() => {
      setBoosterDetached(true);
      setMessage("Stage separation... Booster returning to base.");
      setTimeout(() => {
        setMessage("We escaped the orbit and now in space! 🌌");
      }, 800);
    }, 1000);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Reset launch state after scroll finishes (roughly 2s)
    setTimeout(() => {
      setIsLaunching(false);
      setMessage("Ready for launch!");
      setBoosterDetached(false);
    }, 2000);
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
            style={{ 
              width: isMobile ? "40px" : "60px", 
              height: isMobile ? "55px" : "80px" 
            }}
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
              <motion.g
                animate={{ rotate: armsClosed ? 10 : 0, y: armsClosed ? 5 : 0 }}
                style={{ originX: "70px", originY: "62.5px" }}
              >
                <path d="M70 60 L10 60 L10 65 L70 65 Z" fill="#b0b0c0" />
                <path d="M20 65 L30 75 L70 75 Z" fill="#808090" />
                <rect x="15" y="55" width="10" height="12" fill="#ff4d4d" rx="2" />
              </motion.g>

              {/* Bottom Arm */}
              <motion.g
                animate={{ rotate: armsClosed ? -10 : 0, y: armsClosed ? -5 : 0 }}
                style={{ originX: "70px", originY: "112.5px" }}
              >
                <path d="M70 110 L10 110 L10 115 L70 115 Z" fill="#b0b0c0" />
                <path d="M20 110 L30 100 L70 100 Z" fill="#808090" />
                <rect x="15" y="103" width="10" height="12" fill="#ff4d4d" rx="2" />
              </motion.g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Starship Rocket (Fixed position traveling up/down) */}
      <motion.div
        className={`fixed z-50 ${isMobile ? "right-2" : "right-6 md:right-16"} flex flex-col items-center`}
        style={{
          y: isLaunching ? "-20vh" : yPos,
          x: xPos,
          scale: isMobile ? 0.7 : 1,
        }}
        animate={isLaunching ? { y: "-20vh" } : {}}
        transition={isLaunching ? { duration: 1.2, ease: "easeIn" } : { type: "tween", ease: "linear", duration: 0.1 }}
      >
        {/* Chat Bubble / Speech Text */}
        <AnimatePresence mode="wait">
          {!hideMessage && message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${isMobile ? "right-[25px]" : "right-[35px]"} top-1 whitespace-nowrap bg-[rgba(3,0,20,0.85)] border border-[rgba(112,66,248,0.4)] text-[rgba(255,255,255,0.9)] px-2 py-1 rounded-xl rounded-tr-none text-[8px] shadow-[0_0_10px_rgba(112,66,248,0.3)] backdrop-blur-md font-medium ${hasLanded ? "cursor-pointer hover:bg-[rgba(112,66,248,0.2)]" : ""}`}
              onClick={launchToTop}
            >
              <span className="mr-1 text-purple-400">Elon:</span> {message}
              {/* Tail of the speech bubble */}
              <div className="absolute top-0 -right-1.5 w-0 h-0 border-t-[5px] border-t-[rgba(3,0,20,0.85)] border-r-[8px] border-r-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Rocket */}
        <div 
          className={`relative w-[25px] h-[60px] ${hasLanded ? "cursor-pointer" : ""}`}
          onClick={launchToTop}
          style={{ filter: "drop-shadow(0 5px 8px rgba(0,0,0,0.5))" }}
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

            {/* Left Thruster Gas (fires when moving right) */}
            <motion.g style={{ opacity: thrustLeftOp }}>
              <ellipse cx="14" cy="18" rx="6" ry="1.5" fill="#ffffff" filter="blur(1px)" />
              <ellipse cx="10" cy="18" rx="3" ry="1" fill="#a0e0ff" filter="blur(1px)" />
            </motion.g>

            {/* Right Thruster Gas (fires when moving left) */}
            <motion.g style={{ opacity: thrustRightOp }}>
              <ellipse cx="46" cy="18" rx="6" ry="1.5" fill="#ffffff" filter="blur(1px)" />
              <ellipse cx="50" cy="18" rx="3" ry="1" fill="#a0e0ff" filter="blur(1px)" />
            </motion.g>

            {/* Top Flaps */}
            <motion.path d="M18 20 L5 35 L12 45 Z" fill="#888" style={{ rotate: flapAngleLeft, originX: 1, originY: 0 }} />
            <motion.path d="M42 20 L55 35 L48 45 Z" fill="#222" style={{ rotate: flapAngleRight, originX: 0, originY: 0 }} />

            {/* Bottom Flaps */}
            <motion.path d="M12 80 L0 105 L10 115 Z" fill="#888" style={{ rotate: flapAngleLeft, originX: 1, originY: 0 }} />
            <motion.path d="M48 80 L60 105 L50 115 Z" fill="#222" style={{ rotate: flapAngleRight, originX: 0, originY: 0 }} />

            {/* Engine Skirt */}
            <rect x="15" y="110" width="30" height="10" fill="#333" rx="2" />
            <rect x="20" y="120" width="8" height="5" fill="#111" />
            <rect x="32" y="120" width="8" height="5" fill="#111" />

            {/* Super Heavy Booster (Only visible during launch before separation) */}
            {isLaunching && !boosterDetached && (
              <motion.g
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <path d="M15 125 L45 125 L45 180 L15 180 Z" fill="url(#steelGradient)" />
                <rect x="15" y="180" width="30" height="8" fill="#222" rx="1" />
                {/* Booster grid fins */}
                <rect x="10" y="130" width="5" height="10" fill="#444" />
                <rect x="45" y="130" width="5" height="10" fill="#444" />
              </motion.g>
            )}

            {/* Falling Booster (After separation) */}
            {isLaunching && boosterDetached && (
               <motion.g
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 200, opacity: 0 }}
                transition={{ duration: 2, ease: "easeIn" }}
              >
                <path d="M15 125 L45 125 L45 180 L15 180 Z" fill="url(#steelGradient)" />
                <rect x="15" y="180" width="30" height="8" fill="#222" rx="1" />
                <rect x="10" y="130" width="5" height="10" fill="#444" />
                <rect x="45" y="130" width="5" height="10" fill="#444" />
              </motion.g>
            )}

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
          <div className="absolute top-[17px] left-[8px] w-[5px] h-[5px] rounded-full bg-transparent overflow-hidden pointer-events-none">
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
                className={`absolute ${boosterDetached ? "top-[54px]" : "top-[100px]"} left-[6px] w-[13px] h-[35px] origin-top pointer-events-none`}
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
                    fill={boosterDetached ? "url(#vacGradient)" : "url(#flameGradient)"}
                  />
                  <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="20%" stopColor="#4df" />
                      <stop offset="60%" stopColor="#f40" />
                      <stop offset="100%" stopColor="rgba(255,0,0,0)" />
                    </linearGradient>
                    <linearGradient id="vacGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="20%" stopColor="#a0e0ff" />
                      <stop offset="60%" stopColor="#4df" />
                      <stop offset="100%" stopColor="rgba(0,191,255,0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Landing Burn Flame (Only visible when descending near bottom) */}
          <AnimatePresence>
            {isLandingBurn && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="absolute top-[54px] left-[6px] w-[13px] h-[20px] origin-top pointer-events-none"
              >
                <svg viewBox="0 0 30 50" className="w-full h-full">
                  <motion.path
                    animate={{
                      d: [
                        "M5 0 L15 40 L25 0 Z",
                        "M10 0 L15 30 L20 0 Z",
                        "M5 0 L15 45 L25 0 Z",
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    fill="url(#landingFlameGradient)"
                  />
                  <defs>
                    <linearGradient id="landingFlameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="40%" stopColor="#4df" />
                      <stop offset="100%" stopColor="rgba(0,191,255,0)" />
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
