import { useCallback, useState } from "react";
import { Navbar } from "../components/Navbar";
import { AmbientBackground } from "../components/AmbientBackground";
import { BOOT_HANDOFF_S, BootSequence, bootShouldRun } from "../components/BootSequence";
import { CommandPalette } from "../components/CommandPalette";
import { CursorProbe } from "../components/CursorProbe";
import { SectionNav } from "../components/SectionNav";
import { SignalTicker } from "../components/SignalTicker";
import { Footer } from "../components/Footer";
import { HeroSection } from "../sections/HeroSection";
import { WhatIBuildSection } from "../sections/WhatIBuildSection";
import { AboutSection } from "../sections/AboutSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { HowIBuildSystemsSection } from "../sections/HowIBuildSystemsSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ProblemSolvingSection } from "../sections/ProblemSolvingSection";
import { EducationSection } from "../sections/EducationSection";
import { ContactSectionWrapper } from "../sections/ContactSectionWrapper";
import { useSpotlightField } from "../hooks/useSpotlightField";

export function HomePage() {
  // Decided once, during the first render, so the hero never paints and then
  // gets covered back up by the intro panel. The hero is handed a delay rather
  // than a ready flag: it always sets, on its own timer, whatever the panel
  // does.
  const [introDelay] = useState(() => (bootShouldRun() ? BOOT_HANDOFF_S : 0));
  const [booting, setBooting] = useState(() => introDelay > 0);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const finishBoot = useCallback(() => setBooting(false), []);

  useSpotlightField();

  return (
    // `bg-bg` lives on <body>, so the wrapper stays transparent and the fixed
    // ambient layer behind it stays visible.
    <div className="relative min-h-screen text-primary font-sans antialiased">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-lg focus:bg-surface focus:px-st-3 focus:py-st-2 focus:text-meta focus:text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to content
      </a>

      <AmbientBackground />
      <CursorProbe />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <SectionNav />

      <main className="relative">
        <HeroSection introDelay={introDelay} />
        <SignalTicker />
        <WhatIBuildSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <HowIBuildSystemsSection />
        <SkillsSection />
        <ProblemSolvingSection />
        <EducationSection />
        <ContactSectionWrapper />
      </main>

      <Footer onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      {booting && <BootSequence onDone={finishBoot} />}

      {/* Grain sits above everything except the intro, the palette and the
          cursor, at an opacity that only shows up on the large flat fields. */}
      <div className="pointer-events-none fixed inset-0 z-[120] grain opacity-[0.16] mix-blend-soft-light" aria-hidden="true" />
    </div>
  );
}
