"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030014]"
          >
            {/* Stars background */}
            <div className="loader-stars" />

            {/* Solar system */}
            <div className="loader-solar-system">
              {/* Sun */}
              <div className="loader-sun">
                <div className="loader-sun-glow" />
              </div>

              {/* Orbit 1 — Mercury */}
              <div className="loader-orbit loader-orbit-1">
                <div className="loader-planet loader-mercury" />
              </div>

              {/* Orbit 2 — Venus */}
              <div className="loader-orbit loader-orbit-2">
                <div className="loader-planet loader-venus" />
              </div>

              {/* Orbit 3 — Earth */}
              <div className="loader-orbit loader-orbit-3">
                <div className="loader-planet loader-earth" />
              </div>

              {/* Orbit 4 — Mars */}
              <div className="loader-orbit loader-orbit-4">
                <div className="loader-planet loader-mars" />
              </div>

              {/* Orbit 5 — Jupiter */}
              <div className="loader-orbit loader-orbit-5">
                <div className="loader-planet loader-jupiter" />
              </div>
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-16 text-gray-400 text-sm tracking-[0.3em] uppercase font-medium"
            >
              Initializing Universe
            </motion.p>

            {/* Progress bar */}
            <div className="mt-4 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — always mounted, revealed after fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
};
