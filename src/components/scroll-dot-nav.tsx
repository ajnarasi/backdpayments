"use client";

import { useEffect, useState } from "react";

interface ScrollSection {
  id: string;
  label: string;
}

export function ScrollDotNav({ sections }: { sections: ScrollSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.4 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="scroll-dot-nav" aria-label="Section navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={activeId === s.id ? "active" : ""}
          title={s.label}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      ))}
    </nav>
  );
}
