import Contact from "@/components/sections/contact/contact";
import About from "@/components/sections/about/about";
import Hero from "@/components/sections/hero/hero";
import Projects from "@/components/sections/projects/projects";
import Skills from "@/components/sections/skills/skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}