import React, { useMemo } from "react";

const SYMBOLS = ["💗", "💕", "❤️", "💖", "🌸", "✨"];

// Seeded pseudo-random so hearts are stable between re-renders
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function FloatingHearts({ count = 22 }) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = (offset) => seededRand(i * 7 + offset);
      const duration  = 7 + r(0) * 7;          // 7s – 14s
      const left      = r(1) * 100;             // 0% – 100%
      const size      = 0.85 + r(2) * 1.5;     // 0.85rem – 2.35rem

      // Half the hearts get a NEGATIVE delay so they're already mid-flight on load.
      // The other half start with a small positive delay for a staggered fill effect.
      const isMidFlight = i < Math.ceil(count / 2);
      const delay = isMidFlight
        ? -(r(3) * duration)          // already somewhere on screen
        : r(3) * 4;                   // starts within 4s

      return { duration, left, size, delay, symbol: SYMBOLS[i % SYMBOLS.length] };
    });
  }, [count]);

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}

export default FloatingHearts;
