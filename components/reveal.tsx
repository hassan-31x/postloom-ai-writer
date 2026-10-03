"use client";
import { useEffect, useRef } from "react";
export function Tagline() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("word-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 },
    );
    ref.current?.querySelectorAll("span").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <h2 ref={ref} className="tagline">
      {"Less time staring at a blank page.".split(" ").map((word, i) => (
        <span key={i} style={{ transitionDelay: `${i * 45}ms` }}>
          {word}{" "}
        </span>
      ))}
      <br />
      {"More ideas out in the world.".split(" ").map((word, i) => (
        <span key={i} style={{ transitionDelay: `${(i + 9) * 45}ms` }}>
          {word}{" "}
        </span>
      ))}
    </h2>
  );
}
