"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

// Seeded random for stable SSR/CSR output
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function TwinklingStars({
  count = 150,
  dark = true,
}: {
  count?: number;
  dark?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const stars = useMemo(() => {
    const generated: Star[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        x: seededRandom(i * 7 + 1) * 100,
        y: seededRandom(i * 13 + 2) * 100,
        size: seededRandom(i * 17 + 3) * 2 + 0.5,
        baseOpacity: seededRandom(i * 23 + 4) * 0.5 + 0.1,
        twinkleSpeed: seededRandom(i * 29 + 5) * 3 + 1,
        twinkleOffset: seededRandom(i * 31 + 6) * Math.PI * 2,
      });
    }
    return generated;
  }, [count]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {stars.map((star, i) => {
        // Each star twinkles based on scroll position
        const twinkle =
          Math.sin(scrollY * 0.005 * star.twinkleSpeed + star.twinkleOffset) *
            0.5 +
          0.5;
        const opacity = star.baseOpacity + twinkle * 0.6;
        const color = dark ? "245, 245, 240" : "60, 60, 90";

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              backgroundColor: `rgba(${color}, ${dark ? opacity : opacity * 0.5})`,
              boxShadow:
                opacity > 0.5
                  ? `0 0 ${star.size * 3}px rgba(${color}, ${(dark ? opacity : opacity * 0.3) * 0.4})`
                  : "none",
              transition: "opacity 0.1s ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
