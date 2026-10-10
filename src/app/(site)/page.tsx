import Contact from "@/components/sections/contact/contact";
import About from "@/components/sections/about/about";
import Hero from "@/components/sections/hero/hero";
import { ProofStrip } from "@/components/sections/proof/proof-strip";
import { FeaturedCase } from "@/components/sections/featured/featured-case";
import Projects from "@/components/sections/projects/projects";
import Skills from "@/components/sections/skills/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedCase />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}