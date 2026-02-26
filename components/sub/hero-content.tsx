"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
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
      className="relative flex flex-col lg:flex-row items-center justify-center px-4 md:px-20 mt-28 lg:mt-40 w-full z-[20] overflow-hidden gap-10 lg:gap-0"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-center lg:text-start relative z-10">
        {/* 🔮 Welcome Badge */}
        <div className="flex justify-center items-center lg:justify-start">
          <motion.div
            variants={slideInFromTop}
            className="Welcome-box py-4 px-6 bg-[#0702158e] shadow-lg lg:shadow-[#2A0E61]/50 lg:bg-[#03001427] backdrop-blur-md rounded-xl "
          >
            <div className="flex items-center">
              <SparklesIcon className="text-[#b49bff] mr-3 h-6 w-6" />
              <div className="Welcome-text text- lg:text-3xl text-white font-semibold">
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
          className="text-lg text-gray-400 my-5 max-w-[600px] text-center lg:text-start mx-auto lg:mx-0"
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

      {/* 👨‍💻 Hero Image — Interactive 3D */}
      <HeroImage3D />
    </motion.div>
  );
};

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ---------- True 3D Hero Image (Three.js Solar System) ---------- */
const HeroImage3D = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="lg:relative lg:w-[800px] lg:max-w-none lg:h-[400px] lg:mt-0 lg:translate-x-4 lg:opacity-100 absolute bottom-[-30px] left-0 w-full h-[280px] opacity-25 pointer-events-none lg:pointer-events-auto cursor-pointer overflow-hidden"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 18], fov: 32 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={180} color="#f59e0b" decay={2} />
        
        <Scene mouseX={smoothX} mouseY={smoothY} />
        
        <ContactShadows 
          opacity={0.4} 
          scale={30} 
          blur={1.5} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />
      </Canvas>
    </div>
  );
};

const Scene = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Interactive Tilt (Additive to base tilt)
  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = mouseY.get() * 0.3;
    const targetY = mouseX.get() * 0.3;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 1.1 + targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* Central Sun */}
      <Sun3D />

      {/* Orbits & Planets (Pico Expansion) */}
      <Planet3D radius={3} speed={1.2} size={0.2} color="#9e9e9e" name="Mercury" />
      <Planet3D radius={4.5} speed={0.8} size={0.35} color="#e3bb76" name="Venus" />
      <Planet3D 
        radius={6.5} 
        speed={0.5} 
        size={0.55} 
        color="#2b82c9" 
        name="Earth" 
        isEarth 
        label="Where I live" 
      />
      <Planet3D 
        radius={8.5} 
        speed={0.3} 
        size={0.3} 
        color="#e27b58" 
        name="Mars" 
        label="Next Home"
      />
      <Planet3D radius={11.5} speed={0.15} size={0.9} color="#d39c7e" name="Jupiter" hasRing />
      <Planet3D radius={14.5} speed={0.08} size={0.8} color="#f4d442" name="Saturn" hasRing />
      <Planet3D radius={17.5} speed={0.04} size={0.65} color="#45a2d1" name="Neptune" />
      
      {/* Background Dust */}
      <Stars3D />
    </group>
  );
};

const Sun3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Sun Core */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial 
            emissive="#ff5500" 
            emissiveIntensity={7} 
            color="#ffaa00" 
            roughness={0.1}
          />
          {/* Intense Internal Glow */}
          <pointLight intensity={70} distance={15} color="#ff7700" />
        </mesh>

        {/* Volumetric Corona (Outer Glow) */}
        <mesh scale={1.5}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshBasicMaterial 
            color="#ff4400" 
            transparent 
            opacity={0.15} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Outer Haze */}
        <mesh scale={2.2}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshBasicMaterial 
            color="#ffcc00" 
            transparent 
            opacity={0.05} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Planet3D = ({ 
  radius, 
  speed, 
  size, 
  color, 
  name, 
  isEarth, 
  label, 
  hasRing 
}: { 
  radius: number; 
  speed: number; 
  size: number; 
  color: string; 
  name: string;
  isEarth?: boolean;
  label?: string;
  hasRing?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.z += delta * speed * 0.2;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Orbital Path (Visual Line) */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
        <meshBasicMaterial 
          color="white" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide} 
          depthWrite={false}
        />
      </mesh>

      <group ref={orbitRef}>
        <group position={[radius, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            {/* Planet Body */}
            <mesh 
              ref={meshRef}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.8} 
                metalness={0.1}
                emissive={isEarth ? "#0066ff" : (name === "Mars" ? "#ff4400" : "#000")}
                emissiveIntensity={isEarth ? 0.4 : (name === "Mars" ? 0.2 : 0)}
              />
              
              {/* Extra Layer for Realism (Clouds/Atmos) */}
              {(isEarth || name === "Jupiter" || name === "Saturn") && (
                <mesh scale={1.03}>
                  <sphereGeometry args={[size, 32, 32]} />
                  <meshStandardMaterial 
                    color="white" 
                    transparent 
                    opacity={0.15} 
                    roughness={1} 
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              )}
            </mesh>

            {/* Atmosphere Glow */}
            <mesh scale={1.2}>
              <sphereGeometry args={[size, 32, 32]} />
              <meshBasicMaterial 
                color={isEarth ? "#4facfe" : (name === "Mars" ? "#ff7744" : color)} 
                transparent 
                opacity={0.1} 
                side={THREE.BackSide}
              />
            </mesh>
            
            {hasRing && (
               <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                 <ringGeometry args={[size * 1.5, size * 2.8, 64]} />
                 <meshStandardMaterial 
                   color={name === "Saturn" ? "#d4af37" : "#8b5e3c"} 
                   transparent 
                   opacity={0.3} 
                   side={THREE.DoubleSide} 
                 />
               </mesh>
            )}

            {/* Label (Only visible on HOVER) */}
            {label && hovered && (
              <Html distanceFactor={12} position={[0, size + 0.6, 0]}>
                <div className="pointer-events-none select-none">
                  <div className="flex flex-col items-center">
                    <div className="px-3 py-1.5 bg-black/90 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl whitespace-nowrap">
                       <span className="text-[9px] text-purple-400 font-extrabold tracking-widest block mb-0.5 uppercase">
                         {name === "Mars" ? "Colonization" : (isEarth ? "Civilization" : "Discovery")}
                       </span>
                       <div className="flex items-center gap-1.5">
                          <span className="text-white text-[11px] font-bold tracking-tight">{label}</span>
                          <span className="emoji-reset text-[11px]">{isEarth ? "🌏" : (name === "Mars" ? "🚀" : "📍")}</span>
                       </div>
                    </div>
                    {/* Only show connector line for non-Earth/non-Mars planets */}
                    {!isEarth && name !== "Mars" && (
                      <div className="w-px h-6 bg-gradient-to-b from-white/80 to-transparent" />
                    )}
                  </div>
                </div>
              </Html>
            )}

            {/* Earth Special Glow (Pulse) */}
            {isEarth && (
              <>
                <mesh scale={1.4}>
                  <sphereGeometry args={[size, 32, 32]} />
                  <meshBasicMaterial 
                    color="#4facfe" 
                    transparent 
                    opacity={0.15} 
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
                {/* The Moon */}
                <Moon3D parentSize={size} />
              </>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};

const Moon3D = ({ parentSize }: { parentSize: number }) => {
  const moonOrbitRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group ref={moonOrbitRef}>
      <mesh position={[parentSize + 0.4, 0, 0]}>
        <sphereGeometry args={[parentSize * 0.25, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} roughness={0.9} />
      </mesh>
    </group>
  );
};

const Stars3D = () => {
  const starsRef = useRef<THREE.Points>(null);
  const [coords] = useState(() => {
    const arr = new Float32Array(600);
    for (let i = 0; i < 600; i++) {
       arr[i] = (Math.random() - 0.5) * 60;
    }
    return arr;
  });

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={coords.length / 3} 
          array={coords} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="white" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};
