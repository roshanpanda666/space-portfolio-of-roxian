import { AboutConnect } from "@/components/main/about-connect";
import { BuildProcess } from "@/components/main/build-process";
import { GitHubStreak } from "@/components/main/github-streak";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { StarshipScroll } from "@/components/main/starship-scroll";

export default function Home() {
  return (
    <main className="h-full w-full">
      <StarshipScroll />
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Projects />
        <GitHubStreak />
        <BuildProcess />
        <AboutConnect />
      </div>
    </main>
  );
}
