import { AboutConnect } from "@/components/main/about-connect";
import { BuildProcess } from "@/components/main/build-process";
import { GitHubStreak } from "@/components/main/github-streak";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { StarshipScroll } from "@/components/main/starship-scroll";
import { getSocialLinks } from "@/lib/social-links";

export default function Home() {
  const links = getSocialLinks();

  return (
    <main className="h-full w-full">
      <StarshipScroll />
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Projects />
        <GitHubStreak />
        <BuildProcess />
        <AboutConnect instagramUrl={links.instagram} />
      </div>
    </main>
  );
}
