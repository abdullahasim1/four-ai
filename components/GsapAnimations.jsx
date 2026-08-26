"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Site-wide GSAP effects:
 *  - top scroll progress bar (scrubbed)
 *  - [data-reveal="up|left|right|zoom"] scroll reveals
 *  - [data-reveal-group] staggered children reveal
 *  - [data-parallax="80"] subtle parallax on scroll
 * Re-runs on every route change.
 */
export default function GsapAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: "power3.out", force3D: true });

    const ctx = gsap.context(() => {
      // Scroll progress bar
      const bar = document.querySelector("[data-progress-bar]");
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.35 },
          }
        );
      }

      // Single-element reveals
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const dir = el.getAttribute("data-reveal") || "up";
        const from = { opacity: 0 };
        if (dir === "left") from.x = -56;
        else if (dir === "right") from.x = 56;
        else if (dir === "zoom") from.scale = 0.86;
        else from.y = 48;

        gsap.from(el, {
          ...from,
          duration: 0.9,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Staggered group reveals
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 42,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      // Parallax drift
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const strength = parseFloat(el.getAttribute("data-parallax")) || 80;
        gsap.to(el, {
          y: strength,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div
      data-progress-bar
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400"
    />
  );
}
