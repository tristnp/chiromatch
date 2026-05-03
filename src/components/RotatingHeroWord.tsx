"use client";

import { useEffect, useState } from "react";

type RotatingHeroWordProps = {
  words: string[];
  intervalMs?: number;
};

export function RotatingHeroWord({ words, intervalMs = 2200 }: RotatingHeroWordProps) {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (words.length <= 1 || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, prefersReducedMotion, words.length]);

  const currentWord = words[index] ?? words[0] ?? "";
  const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), words[0] ?? "");

  return (
    <span className="hero-rotating-word">
      <span className="hero-rotating-word__prefix">without the </span>
      <span className="hero-rotating-word__viewport" aria-live="polite">
        <span className="hero-rotating-word__sizer" aria-hidden="true">
          {longestWord}.
        </span>
        <span key={currentWord} className="hero-rotating-word__text">
          {currentWord}.
        </span>
      </span>
    </span>
  );
}
