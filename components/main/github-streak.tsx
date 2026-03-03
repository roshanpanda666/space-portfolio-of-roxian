"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Types ─── */
interface ContributionDay {
  date: string;
  contributionCount: number;
}
interface ContributionWeek {
  contributionDays: ContributionDay[];
}
interface StreakData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  weeks: ContributionWeek[];
}

interface CannonballData {
  id: number;
  target: THREE.Vector3;
  start: THREE.Vector3;
}

interface ExplosionData {
  id: number;
  position: THREE.Vector3;
  startTime: number;
}

/* ─── Color helpers ─── */
function getBlockColor(count: number): string {
  if (count === 0) return "rgba(112, 66, 248, 0.06)";
  if (count <= 2) return "rgba(112, 66, 248, 0.3)";
  if (count <= 5) return "rgba(138, 99, 249, 0.5)";
  if (count <= 8) return "rgba(160, 80, 235, 0.7)";
  return "rgba(180, 74, 223, 0.9)";
}

function getGlowColor(count: number): string {
  if (count === 0) return "transparent";
  if (count <= 2) return "rgba(112, 66, 248, 0.15)";
  if (count <= 5) return "rgba(112, 66, 248, 0.25)";
  return "rgba(180, 74, 223, 0.4)";
}

function getBuildingThreeColor(count: number): string {
  if (count === 0) return "#1a0a3e";
  if (count <= 2) return "#5a35b5";
  if (count <= 5) return "#7042f8";
  if (count <= 8) return "#9060e8";
  return "#b44adf";
}

function getEmissiveColor(count: number): string {
  if (count === 0) return "#000000";
  if (count <= 2) return "#2a1570";
  if (count <= 5) return "#3a2090";
  if (count <= 8) return "#5030a0";
  return "#7040c0";
}

/* ─── Cannonball Projectile ─── */
function Cannonball({
  startPos,
  targetPos,
  onImpact,
}: {
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  onImpact: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const startTime = useRef<number | null>(null);
  const hasImpacted = useRef(false);
  const FLIGHT_DURATION = 0.6;
  const ARC_HEIGHT = 3.5;

  // Trail particle positions
  const trailPositions = useMemo(() => new Float32Array(30 * 3), []);
  const trailIdx = useRef(0);

  useFrame((state) => {
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const t = Math.min(elapsed / FLIGHT_DURATION, 1);

    if (meshRef.current) {
      // Parabolic arc
      const pos = new THREE.Vector3().lerpVectors(startPos, targetPos, t);
      pos.y += Math.sin(t * Math.PI) * ARC_HEIGHT;
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x += 0.15;
      meshRef.current.rotation.z += 0.1;

      // Update trail
      if (trailRef.current) {
        const geo = trailRef.current.geometry;
        const idx = (trailIdx.current % 10) * 3;
        trailPositions[idx] = pos.x;
        trailPositions[idx + 1] = pos.y;
        trailPositions[idx + 2] = pos.z;
        trailIdx.current++;
        geo.attributes.position.needsUpdate = true;
      }
    }

    if (t >= 1 && !hasImpacted.current) {
      hasImpacted.current = true;
      onImpact();
    }
  });

  return (
    <>
      {/* Cannonball */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.2}
          emissive="#ff4400"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Fire trail glow */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={10}
            array={trailPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ff6600"
          size={0.06}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
}

/* ─── Explosion Debris ─── */
function Explosion({ position, startTime: explosionStart }: { position: THREE.Vector3; startTime: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const debrisData = useMemo(() => {
    return Array.from({ length: 18 }, () => ({
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2 + 0.5,
        (Math.random() - 0.5) * 2,
      ).normalize(),
      speed: 1.5 + Math.random() * 3,
      rotSpeed: new THREE.Vector3(
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
      ),
      size: 0.03 + Math.random() * 0.08,
      color: ["#ff6b35", "#ffa500", "#ff4444", "#7042f8", "#b44adf", "#ffcc00"][
        Math.floor(Math.random() * 6)
      ],
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.elapsedTime - explosionStart;

    groupRef.current.children.forEach((child, i) => {
      const d = debrisData[i];
      if (!d) return;
      const mesh = child as THREE.Mesh;
      // Physics: velocity + gravity
      mesh.position.set(
        position.x + d.dir.x * d.speed * elapsed,
        position.y + d.dir.y * d.speed * elapsed - 4.9 * elapsed * elapsed,
        position.z + d.dir.z * d.speed * elapsed,
      );
      mesh.rotation.x += d.rotSpeed.x * 0.016;
      mesh.rotation.y += d.rotSpeed.y * 0.016;
      mesh.rotation.z += d.rotSpeed.z * 0.016;

      // Fade out
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.max(0, 1 - elapsed / 1.8);
    });
  });

  return (
    <group ref={groupRef}>
      {debrisData.map((d, i) => (
        <mesh key={i} position={[position.x, position.y, position.z]}>
          <boxGeometry args={[d.size, d.size, d.size]} />
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={0.8}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
      {/* Central flash */}
      <pointLight position={[position.x, position.y + 0.3, position.z]} color="#ff8800" intensity={3} distance={4} decay={2} />
    </group>
  );
}

/* ─── Cannon (ground-mounted) ─── */
function Cannon({ position, lookAt }: { position: THREE.Vector3; lookAt: THREE.Vector3 | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && lookAt) {
      const dir = new THREE.Vector3().subVectors(lookAt, position).normalize();
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = angle;
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.12, 12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.15, -0.15]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 10]} />
        <meshStandardMaterial
          color="#2d2d44"
          metalness={0.8}
          roughness={0.2}
          emissive="#7042f8"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Muzzle ring */}
      <mesh position={[0, 0.28, -0.32]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.065, 0.015, 8, 16]} />
        <meshStandardMaterial color="#7042f8" emissive="#7042f8" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.18, 0.08, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
          <meshStandardMaterial color="#1a1020" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Three.js Building ─── */
function Building({
  position,
  count,
  maxCount,
  date,
  delay,
  destroyed,
  onHover,
  onUnhover,
  onClick,
}: {
  position: [number, number, number];
  count: number;
  maxCount: number;
  date: string;
  delay: number;
  destroyed: boolean;
  onHover: (info: string) => void;
  onUnhover: () => void;
  onClick: (pos: THREE.Vector3) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const targetScale = useRef(0);
  const startTime = useRef<number | null>(null);
  const rebuildStart = useRef<number | null>(null);

  const color = new THREE.Color(getBuildingThreeColor(count));
  const emissive = new THREE.Color(getEmissiveColor(count));
  const buildingHeight = count === 0 ? 0.08 : Math.max(0.15, (count / Math.max(maxCount, 1)) * 2.5);

  // Reset animation when destroyed changes
  useEffect(() => {
    if (destroyed) {
      targetScale.current = 0;
      setAnimProgress(0);
      rebuildStart.current = null;
    }
  }, [destroyed]);

  useFrame((state) => {
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
    }

    if (destroyed) {
      // After destruction, rebuild after 3 seconds
      if (rebuildStart.current === null) {
        rebuildStart.current = state.clock.elapsedTime;
      }
      const rebuildElapsed = state.clock.elapsedTime - rebuildStart.current;
      if (rebuildElapsed > 3) {
        const rt = Math.min((rebuildElapsed - 3) / 1.2, 1);
        const p = 0.4;
        const eased = rt === 1 ? 1 : Math.pow(2, -10 * rt) * Math.sin((rt - p / 4) * (2 * Math.PI) / p) + 1;
        targetScale.current = eased;
        setAnimProgress(eased);
      }
    } else {
      const elapsed = state.clock.elapsedTime - startTime.current;
      const delayedTime = Math.max(0, elapsed - delay);

      if (delayedTime > 0 && targetScale.current < 1) {
        const t = Math.min(delayedTime / 0.8, 1);
        const p = 0.4;
        targetScale.current = t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        setAnimProgress(targetScale.current);
      }
    }

    if (meshRef.current) {
      const currentHeight = buildingHeight * animProgress;
      meshRef.current.scale.y = Math.max(0.001, animProgress);
      meshRef.current.position.y = currentHeight / 2;

      if (hovered && !destroyed) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.15 + 0.85;
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      }
    }
  });

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(count > 0 ? `🎯 ${date}: ${count} contributions — Click to fire!` : `${date}: No contributions`);
    document.body.style.cursor = count > 0 ? "crosshair" : "default";
  }, [date, count, onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onUnhover();
    document.body.style.cursor = "auto";
  }, [onUnhover]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (count > 0 && !destroyed && animProgress > 0.5) {
      const worldPos = new THREE.Vector3(position[0], buildingHeight * animProgress * 0.5, position[2]);
      onClick(worldPos);
    }
  }, [count, destroyed, animProgress, position, buildingHeight, onClick]);

  if (destroyed && animProgress < 0.01) return <group position={position} />;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.35, buildingHeight, 0.35]} />
        <meshStandardMaterial
          color={hovered && count > 0 ? "#ff8060" : color}
          emissive={hovered && count > 0 ? "#ff4020" : emissive}
          emissiveIntensity={hovered ? 0.8 : count > 5 ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.6}
          transparent={count === 0}
          opacity={count === 0 ? 0.15 : 1}
        />
      </mesh>

      {/* Windows */}
      {count > 3 && animProgress > 0.5 && !(destroyed && animProgress < 0.3) && (
        <>
          {Array.from({ length: Math.min(Math.floor(count / 2), 4) }).map((_, i) => (
            <mesh
              key={i}
              position={[0, buildingHeight * animProgress * (0.2 + i * 0.2), 0.176]}
            >
              <planeGeometry args={[0.08, 0.05]} />
              <meshStandardMaterial
                color="#ffee88"
                emissive="#ffcc44"
                emissiveIntensity={0.5 + Math.sin(Date.now() / 1000 + i) * 0.3}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Antenna */}
      {count >= maxCount * 0.75 && count > 0 && animProgress > 0.8 && (
        <group position={[0, buildingHeight * animProgress, 0]}>
          <mesh>
            <cylinderGeometry args={[0.008, 0.008, 0.3, 4]} />
            <meshStandardMaterial color="#9070d0" emissive="#7050b0" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ff5050" emissive="#ff3030" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[0, 0.18, 0]} color="#ff3030" intensity={0.3} distance={1} />
        </group>
      )}
    </group>
  );
}

/* ─── Ground Plane ─── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 15]} />
      <meshStandardMaterial color="#0a0025" transparent opacity={0.8} metalness={0.5} roughness={0.8} />
    </mesh>
  );
}

/* ─── Grid Lines ─── */
function GridLines({ weeks }: { weeks: number }) {
  const gridWidth = weeks * 0.42;
  const gridDepth = 7 * 0.42;

  return (
    <group position={[0, 0.001, 0]}>
      {Array.from({ length: Math.floor(gridWidth / 2) + 1 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[i * 2 - gridWidth / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.005, gridDepth]} />
          <meshBasicMaterial color="#7042f8" transparent opacity={0.08} />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(gridDepth / 2) + 1 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[0, 0, i * 2 - gridDepth / 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.005, gridWidth]} />
          <meshBasicMaterial color="#7042f8" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── 3D City Scene ─── */
function CityScene({
  weeks,
  maxCount,
  onHover,
  onUnhover,
  destroyedBuildings,
  onDestroyBuilding,
}: {
  weeks: ContributionWeek[];
  maxCount: number;
  onHover: (info: string) => void;
  onUnhover: () => void;
  destroyedBuildings: Set<string>;
  onDestroyBuilding: (key: string) => void;
}) {
  const totalWeeks = weeks.length;
  const offsetX = (totalWeeks * 0.42) / 2;
  const offsetZ = (7 * 0.42) / 2;

  const [cannonballs, setCannonballs] = useState<CannonballData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [lastTarget, setLastTarget] = useState<THREE.Vector3 | null>(null);
  const cannonballIdRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  // Cannon position — front-right corner of the city
  const cannonPos = useMemo(
    () => new THREE.Vector3(offsetX + 1.5, 0, offsetZ + 1),
    [offsetX, offsetZ]
  );

  const handleBuildingClick = useCallback(
    (key: string, targetPos: THREE.Vector3) => {
      if (destroyedBuildings.has(key)) return;

      const id = cannonballIdRef.current++;
      setLastTarget(targetPos);
      setCannonballs((prev) => [
        ...prev,
        { id, target: targetPos, start: cannonPos.clone().setY(0.35) },
      ]);

      // Schedule destruction on impact
      setTimeout(() => {
        onDestroyBuilding(key);
        setCannonballs((prev) => prev.filter((c) => c.id !== id));
      }, 620);
    },
    [cannonPos, destroyedBuildings, onDestroyBuilding]
  );

  // Store clock for explosion timing
  useFrame((state) => {
    if (!clockRef.current) clockRef.current = state.clock;

    // Clean up old explosions
    setExplosions((prev) =>
      prev.filter((e) => state.clock.elapsedTime - e.startTime < 2)
    );
  });

  const handleImpact = useCallback(
    (id: number, target: THREE.Vector3) => {
      if (clockRef.current) {
        setExplosions((prev) => [
          ...prev,
          { id, position: target, startTime: clockRef.current!.elapsedTime },
        ]);
      }
    },
    []
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[8, 12, 5]}
        intensity={0.8}
        color="#c8b8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} color="#6040c0" />
      <pointLight position={[0, 6, 0]} intensity={0.4} color="#7042f8" distance={20} />

      {/* Ground glow */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial color="#7042f8" transparent opacity={0.03} />
      </mesh>

      <Ground />
      <GridLines weeks={totalWeeks} />

      {/* Cannon */}
      <Cannon position={cannonPos} lookAt={lastTarget} />

      {/* Buildings */}
      {weeks.map((week, wi) =>
        week.contributionDays.map((day, di) => {
          const key = `${wi}-${di}`;
          return (
            <Building
              key={key}
              position={[wi * 0.42 - offsetX + 0.21, 0, di * 0.42 - offsetZ + 0.21]}
              count={day.contributionCount}
              maxCount={maxCount}
              date={day.date}
              delay={wi * 0.03 + di * 0.015}
              destroyed={destroyedBuildings.has(key)}
              onHover={onHover}
              onUnhover={onUnhover}
              onClick={(pos) => handleBuildingClick(key, pos)}
            />
          );
        })
      )}

      {/* Active cannonballs */}
      {cannonballs.map((cb) => (
        <Cannonball
          key={cb.id}
          startPos={cb.start}
          targetPos={cb.target}
          onImpact={() => handleImpact(cb.id, cb.target)}
        />
      ))}

      {/* Active explosions */}
      {explosions.map((exp) => (
        <Explosion key={exp.id} position={exp.position} startTime={exp.startTime} />
      ))}

      {/* Floating title */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.35}
          color="#9080d0"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.4}
        >
          CONTRIBUTION CITY
        </Text>
      </Float>

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={18}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

/* ─── Main Component ─── */
export const GitHubStreak = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<StreakData | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [viewMode, setViewMode] = useState<"heatmap" | "buildings">("heatmap");
  const [heatmapReady, setHeatmapReady] = useState(false);
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const [destroyedBuildings, setDestroyedBuildings] = useState<Set<string>>(new Set());
  const [selectedYear, setSelectedYear] = useState<string>("latest");
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = ["latest", ...Array.from({ length: 3 }, (_, i) => String(currentYear - i))];

  // Fetch data (re-fetches when year changes)
  useEffect(() => {
    setIsLoading(true);
    const url = selectedYear === "latest"
      ? "/api/github-streak"
      : `/api/github-streak?year=${selectedYear}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setDestroyedBuildings(new Set());
        setIsLoading(false);
      })
      .catch(() => {
        const weeks: ContributionWeek[] = [];
        const now = new Date();
        for (let w = 51; w >= 0; w--) {
          const days: ContributionDay[] = [];
          for (let d = 0; d < 7; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() - (w * 7 + (6 - d)));
            days.push({
              date: date.toISOString().split("T")[0],
              contributionCount: Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0,
            });
          }
          weeks.push({ contributionDays: days });
        }
        setData({ totalContributions: 847, currentStreak: 12, longestStreak: 34, weeks });
        setIsLoading(false);
      });
  }, [selectedYear]);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-transition: heatmap → buildings
  useEffect(() => {
    if (isInView && data && !heatmapReady) {
      const totalBlocks = data.weeks.reduce(
        (sum, w) => sum + w.contributionDays.length, 0
      );
      const animDuration = Math.min(totalBlocks * 8, 3000) + 1500;
      const timer = setTimeout(() => {
        setHeatmapReady(true);
        setTimeout(() => setViewMode("buildings"), 800);
      }, animDuration);
      return () => clearTimeout(timer);
    }
  }, [isInView, data, heatmapReady]);

  // Use ALL weeks from API (full year)
  const visibleWeeks = useMemo(() => data?.weeks || [], [data]);
  // For 3D city, use last 26 weeks to keep it manageable
  const cityWeeks = useMemo(() => data?.weeks.slice(-26) || [], [data]);

  const maxCount = useMemo(
    () =>
      visibleWeeks.reduce(
        (max, w) =>
          w.contributionDays.reduce((m, d) => Math.max(m, d.contributionCount), max),
        0
      ),
    [visibleWeeks]
  );

  const cityMaxCount = useMemo(
    () =>
      cityWeeks.reduce(
        (max, w) =>
          w.contributionDays.reduce((m, d) => Math.max(m, d.contributionCount), max),
        0
      ),
    [cityWeeks]
  );

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = "";
    visibleWeeks.forEach((week, wi) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const month = new Date(firstDay.date).toLocaleString("default", { month: "short" });
        if (month !== lastMonth) {
          labels.push({ label: month, col: wi });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [visibleWeeks]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleHover = useCallback((info: string) => setTooltipText(info), []);
  const handleUnhover = useCallback(() => setTooltipText(null), []);

  const handleDestroyBuilding = useCallback((key: string) => {
    setDestroyedBuildings((prev) => {
      const next = new Set(Array.from(prev));
      next.add(key);
      return next;
    });
    // Auto-rebuild after 6 seconds
    setTimeout(() => {
      setDestroyedBuildings((prev) => {
        const next = new Set(Array.from(prev));
        next.delete(key);
        return next;
      });
    }, 6000);
  }, []);

  return (
    <section
      id="github-streak"
      ref={containerRef}
      className="relative w-full py-20 px-4 md:px-20 z-[20] overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            GitHub
          </span>{" "}
          Streak
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Live contributions — watch them rise into a city. Click any building to unleash the cannon!
        </p>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mt-4"
        />
      </motion.div>

      {/* Stats Cards */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 max-w-3xl mx-auto">
        {[
          { label: "Current Streak", value: data?.currentStreak ?? "—", icon: "🔥", gradient: "from-orange-500 to-red-500" },
          { label: "Longest Streak", value: data?.longestStreak ?? "—", icon: "🏆", gradient: "from-yellow-500 to-orange-500" },
          { label: "Total Contributions", value: data?.totalContributions ?? "—", icon: "⭐", gradient: "from-purple-500 to-cyan-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="streak-stat-card flex-1 min-w-[140px] max-w-[200px] p-4 rounded-xl text-center cursor-default"
          >
            <span className="text-2xl block mb-1">{stat.icon}</span>
            <div className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Year Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {yearOptions.map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
              setViewMode("heatmap");
              setHeatmapReady(false);
            }}
            className={`streak-year-btn px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedYear === year
                ? "streak-year-active"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {year === "latest" ? "Latest" : year}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="streak-loading-dot" />
          <div className="streak-loading-dot" style={{ animationDelay: "0.15s" }} />
          <div className="streak-loading-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      )}

      {/* View Toggle */}
      {heatmapReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-2 mb-6"
        >
          <button
            onClick={() => setViewMode("heatmap")}
            className={`streak-toggle-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "heatmap" ? "streak-toggle-active" : "text-gray-400 hover:text-white"
            }`}
          >
            📊 Contribution Grid
          </button>
          <button
            onClick={() => setViewMode("buildings")}
            className={`streak-toggle-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "buildings" ? "streak-toggle-active" : "text-gray-400 hover:text-white"
            }`}
          >
            🏙️ 3D City View
          </button>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="streak-glass-card max-w-5xl mx-auto rounded-2xl p-4 md:p-6 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {viewMode === "heatmap" ? (
            /* ──────── HEATMAP VIEW ──────── */
            <motion.div
              key="heatmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="overflow-x-auto"
            >
              <div className="min-w-[560px]">
                {/* Month labels */}
                <div className="flex ml-[36px] mb-1 relative h-4">
                  {monthLabels.map((m) => (
                    <span
                      key={`${m.label}-${m.col}`}
                      className="text-[10px] text-gray-500 absolute"
                      style={{ left: `${m.col * 17}px` }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-0">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[3px] pr-2 pt-0">
                    {dayLabels.map((label, i) => (
                      <div
                        key={i}
                        className="text-[9px] text-gray-500 h-[13px] flex items-center justify-end"
                        style={{ width: "28px" }}
                      >
                        {i % 2 === 1 ? label : ""}
                      </div>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="flex gap-[3px]">
                    {visibleWeeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.contributionDays.map((day, di) => {
                          const blockDelay = (wi * 7 + di) * 0.012;
                          return (
                            <motion.div
                              key={`${wi}-${di}`}
                              className="streak-block"
                              initial={isInView ? { scale: 0, opacity: 0 } : false}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                duration: 0.25,
                                delay: blockDelay,
                                ease: [0.34, 1.56, 0.64, 1],
                              }}
                              whileHover={{ scale: 1.6, zIndex: 10 }}
                              style={{
                                width: "13px",
                                height: "13px",
                                borderRadius: "2.5px",
                                background: getBlockColor(day.contributionCount),
                                boxShadow:
                                  day.contributionCount > 3
                                    ? `0 0 6px ${getGlowColor(day.contributionCount)}`
                                    : undefined,
                                cursor: "default",
                                position: "relative",
                              }}
                              title={`${day.date}: ${day.contributionCount} contributions`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 pr-1">
                  <span className="text-gray-500 text-xs">Less</span>
                  {[0, 2, 4, 7, 10].map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        background: getBlockColor(level),
                        boxShadow: level > 0 ? `0 0 4px ${getGlowColor(level)}` : undefined,
                      }}
                    />
                  ))}
                  <span className="text-gray-500 text-xs">More</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ──────── 3D THREE.JS CITY VIEW ──────── */
            <motion.div
              key="buildings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="streak-three-canvas" style={{ height: "450px", borderRadius: "12px", overflow: "hidden" }}>
                <Canvas
                  shadows
                  camera={{ position: [6, 5, 8], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ background: "transparent" }}
                >
                  <Suspense fallback={null}>
                    <CityScene
                      weeks={cityWeeks}
                      maxCount={cityMaxCount}
                      onHover={handleHover}
                      onUnhover={handleUnhover}
                      destroyedBuildings={destroyedBuildings}
                      onDestroyBuilding={handleDestroyBuilding}
                    />
                  </Suspense>
                  <fog attach="fog" args={["#030014", 12, 25]} />
                </Canvas>

                {/* Tooltip */}
                <AnimatePresence>
                  {tooltipText && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="streak-tooltip"
                    >
                      {tooltipText}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="streak-controls-hint"
                >
                  <span>🖱️ Drag to rotate • Scroll to zoom • Click a building to fire! 💣</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              background: i % 2 === 0 ? "rgba(112, 66, 248, 0.15)" : "rgba(180, 74, 223, 0.1)",
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </section>
  );
};
