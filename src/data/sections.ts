/**
 * The page's anchored sections, in document order.
 *
 * One list, shared by the top navigation, the edge navigator and the command
 * palette, so a section can never appear in one of them and be missing from
 * another. `ids` is a module constant rather than a mapped array at the call
 * site: `useScrollSpy` keys its observer on identity, and a fresh array on
 * every render would tear the observer down and rebuild it every render.
 */
export interface SectionItem {
  id: string;
  label: string;
  /** One-line description, shown in the command palette. */
  hint: string;
}

export const SECTIONS: SectionItem[] = [
  { id: "home", label: "Home", hint: "Intro and the pipeline this site is about" },
  { id: "about", label: "About", hint: "Background, career journey, how I think about software" },
  { id: "experience", label: "Experience", hint: "Constelli Signals, intern through full-stack developer" },
  { id: "projects", label: "Projects", hint: "Engineering case studies with architecture diagrams" },
  { id: "skills", label: "Skills", hint: "Frontend, backend, data and infrastructure" },
  { id: "problem-solving", label: "Problem Solving", hint: "LeetCode, CodeChef, HackerRank, GitHub" },
  { id: "education", label: "Education", hint: "Degree and certifications" },
  { id: "contact", label: "Contact", hint: "Email and profiles" },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
