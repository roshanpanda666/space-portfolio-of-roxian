import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-240px] left-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      {/* Bottom fade — smooths the visible edge */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#030014] via-[#030014]/80 to-transparent -z-10 pointer-events-none" />
      {/* Top fade */}
      <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#030014] to-transparent -z-10 pointer-events-none" />

      <HeroContent />
    </div>
  );
};
