import { AboutConnect } from "@/components/main/about-connect";
import { BuildProcess } from "@/components/main/build-process";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Projects />
        <BuildProcess />
        <AboutConnect />
      </div>
    </main>
  );
}
