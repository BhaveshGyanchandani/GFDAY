import React, { useState, useEffect, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FONT LOADER
// ─────────────────────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("lbq-fonts")) return;
    const l = document.createElement("link");
    l.id = "lbq-fonts";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEEDED PRNG — deterministic, no re-render jitter
// ─────────────────────────────────────────────────────────────────────────────
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 1 | s) + Math.imul(s ^ (s >>> 7), 61 | s)) ^ s;
    return (s >>> 0) / 0x100000000;
  };
}
const RNG = mulberry(20260731);

// ─────────────────────────────────────────────────────────────────────────────
// 20 images: all 14 MyFlowers + 6 Nuu portraits for the extra blooms
// ─────────────────────────────────────────────────────────────────────────────
const PHOTO_SRCS = [
  // ── 14 flower photos ──
  "/assets/MyFlowers/red_rose.jpg",
  "/assets/MyFlowers/rose.jpg",
  "/assets/MyFlowers/pink_rose.jpg",
  "/assets/MyFlowers/whitelily.jpg",
  "/assets/MyFlowers/lavender.jpg",
  "/assets/MyFlowers/hotpink.jpg",
  "/assets/MyFlowers/yellow.jpg",
  "/assets/MyFlowers/hotyellow.jpg",
  "/assets/MyFlowers/cyan.jpg",
  "/assets/MyFlowers/blue.jpg",
  "/assets/MyFlowers/red.jpg",
  "/assets/MyFlowers/redd.jpg",
  "/assets/MyFlowers/white.jpg",
  "/assets/MyFlowers/black.jpg",
  // ── 6 Nuu portraits — fill the extra bloom spots ──
  "/assets/Nuu/eyes.jpg",
  "/assets/Nuu/smile.png",
  "/assets/Nuu/hair.jpg",
  "/assets/Nuu/lips.jpeg",
  "/assets/Nuu/cheeks.jpg",
  "/assets/Nuu/collarbone.jpeg",
];

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO BLOOM LAYOUT — 20 positions spread across the whole bouquet dome.
// x/y = fraction of canvas (W=1400, H=920) | r = radius px | rot = tilt° | z = paint order
// ─────────────────────────────────────────────────────────────────────────────
const BLOOMS = [
  // ── Ring 0: Crown (3) ─────────────────────────────────────────────────────
  { x: 0.430, y: 0.055, r: 66, rot:  6, z: 24 },
  { x: 0.500, y: 0.032, r: 74, rot: -2, z: 30 },
  { x: 0.570, y: 0.055, r: 64, rot: -7, z: 24 },

  // ── Ring 1: Upper-wide (4) ────────────────────────────────────────────────
  { x: 0.230, y: 0.130, r: 62, rot:-12, z: 20 },
  { x: 0.390, y: 0.145, r: 68, rot: -4, z: 26 },
  { x: 0.610, y: 0.145, r: 68, rot:  4, z: 26 },
  { x: 0.770, y: 0.130, r: 62, rot: 12, z: 20 },

  // ── Ring 2: Mid (5) ───────────────────────────────────────────────────────
  { x: 0.100, y: 0.255, r: 58, rot:-16, z: 16 },
  { x: 0.290, y: 0.275, r: 64, rot: -8, z: 22 },
  { x: 0.500, y: 0.285, r: 72, rot:  0, z: 28 },
  { x: 0.710, y: 0.275, r: 64, rot:  8, z: 22 },
  { x: 0.900, y: 0.255, r: 58, rot: 16, z: 16 },

  // ── Ring 3: Lower-mid (5) ─────────────────────────────────────────────────
  { x: 0.155, y: 0.400, r: 60, rot:-14, z: 18 },
  { x: 0.330, y: 0.425, r: 65, rot: -6, z: 24 },
  { x: 0.500, y: 0.440, r: 70, rot:  0, z: 28 },
  { x: 0.670, y: 0.425, r: 65, rot:  6, z: 24 },
  { x: 0.845, y: 0.400, r: 60, rot: 14, z: 18 },

  // ── Ring 4: Outer flanks (3) ──────────────────────────────────────────────
  { x: 0.070, y: 0.160, r: 55, rot:-18, z: 14 },
  { x: 0.500, y: 0.570, r: 62, rot:  2, z: 22 },
  { x: 0.930, y: 0.160, r: 55, rot: 18, z: 14 },
];




// ─────────────────────────────────────────────────────────────────────────────
// SVG CANVAS SIZE
// ─────────────────────────────────────────────────────────────────────────────
const W = 1400;
const H = 920;
const cx = W / 2;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const px = (frac) => frac * W;
const py = (frac) => frac * H;

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO BLOOM COMPONENT — circular photo with scalloped petal frame
// ─────────────────────────────────────────────────────────────────────────────
function scallop(n, ro, ri) {
  const step = (Math.PI * 2) / (n * 2);
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 === 0 ? ro : ri;
    const a = i * step - Math.PI / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i <= pts.length; i++) {
    const [cx2, cy2] = pts[i % pts.length];
    if (i < pts.length) {
      const [nx, ny] = pts[(i + 1) % pts.length];
      d += ` Q ${cx2.toFixed(2)} ${cy2.toFixed(2)} ${((cx2 + nx) / 2).toFixed(2)} ${((cy2 + ny) / 2).toFixed(2)}`;
    } else {
      d += ` Q ${cx2.toFixed(2)} ${cy2.toFixed(2)} ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    }
  }
  return d + " Z";
}

const PETAL_COLORS = ["#F7C8D4", "#FBE0D8", "#F2AABF", "#FDEEF2", "#F9D5C2", "#F0B8C8"];

// PhotoBloom — photo is shown by filling a circle with a <pattern> defined at
// top-level SVG defs. Patterns resolve correctly regardless of any ancestor
// transform or filter, unlike clipPath with userSpaceOnUse.
function PhotoBloom({ patId, r, petalIdx, onTap }) {
  const scallopPath = useMemo(() => scallop(10, r * 1.32, r * 1.06), [r]);
  const petalFill = PETAL_COLORS[petalIdx % PETAL_COLORS.length];

  return (
    <g onClick={onTap} style={{ cursor: "pointer" }}>
      {/* outer gold halo ring */}
      <circle r={r * 1.38} fill="none" stroke="url(#goldRing)" strokeWidth={3} opacity={0.7} />
      {/* scalloped petal surround */}
      <path d={scallopPath} fill={petalFill} opacity={0.92} />
      <path d={scallopPath} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={1.2} />
      {/* pearl dots on scallop tips */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI * 2) / 10 - Math.PI / 2;
        const pr = r * 1.32;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * pr}
            cy={Math.sin(a) * pr}
            r={3.5}
            fill="url(#pearlGrad)"
            stroke="#D8C4A2"
            strokeWidth={0.5}
          />
        );
      })}
      {/* photo circle — filled with top-level pattern, no clipPath needed */}
      <circle r={r} fill={`url(#${patId})`} />
      {/* inner white glow rim */}
      <circle r={r} fill="none" stroke="#fff" strokeWidth={2.5} strokeOpacity={0.55} />
      {/* gold border ring */}
      <circle r={r + 4} fill="none" stroke="url(#goldRing)" strokeWidth={1.5} opacity={0.55} />
      {/* soft lens sheen highlight */}
      <ellipse
        cx={-r * 0.25}
        cy={-r * 0.3}
        rx={r * 0.45}
        ry={r * 0.22}
        fill="rgba(255,255,255,0.15)"
        style={{ pointerEvents: "none" }}
      />
    </g>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ULTRA-DETAILED ROSE
// ─────────────────────────────────────────────────────────────────────────────
function petal(len, w, bulge = 0.44) {
  const hw = w / 2;
  const by = -len * bulge;
  return `M0 0 Q${-hw * 1.2} ${by * 0.5} ${-hw} ${by} Q${-hw * 0.3} ${-len * 0.9} 0 ${-len} Q${hw * 0.3} ${-len * 0.9} ${hw} ${by} Q${hw * 1.2} ${by * 0.5} 0 0 Z`;
}

function Rose({ x, y, s = 1, hue = "red" }) {
  const pal =
    hue === "red"
      ? { g: ["#4A0E1C", "#7A1F3D", "#A83050", "#C9476A", "#E8839A", "#F5BEC8"],
          disc: "#8C2240", mid: "#B83A58" }
      : { g: ["#C97A8E", "#E0A0B0", "#EFC0C8", "#F7D8DF", "#FDE8EC", "#FFF4F6"],
          disc: "#D890A0", mid: "#EDB8C4" };

  const ring = (count, len, w, rad, fill, start = 0, opacity = 1) =>
    Array.from({ length: count }, (_, i) => {
      const angle = start + (360 / count) * i;
      return (
        <g key={i} transform={`rotate(${angle})`}>
          <path d={petal(len, w)} fill={fill} opacity={opacity} transform={`translate(0 ${-rad})`} />
        </g>
      );
    });

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* stem */}
      <line x1={0} y1={20} x2={0} y2={58} stroke="#3D6640" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      {/* sepal */}
      <ellipse cx={-4} cy={26} rx={5} ry={10} fill="#4E7A50" transform="rotate(-20 -4 26)" opacity={0.8} />
      <ellipse cx={4} cy={28} rx={5} ry={10} fill="#4E7A50" transform="rotate(20 4 28)" opacity={0.8} />
      {/* base disc */}
      <circle r={22} fill={pal.disc} opacity={0.95} />
      {/* guard petals */}
      <g>{ring(8, 30, 26, 12, pal.g[0], 8, 0.97)}</g>
      {/* mid-outer ring */}
      <g>{ring(7, 24, 20, 9, pal.g[1], 22, 1)}</g>
      {/* mid ring */}
      <g>{ring(6, 18, 16, 6.5, pal.g[2], 14, 1)}</g>
      {/* inner cup */}
      <g>{ring(5, 12, 12, 4, pal.g[3], 30, 1)}</g>
      {/* furled center */}
      <g>{ring(4, 7, 8, 2, pal.g[4], 10, 1)}</g>
      <circle r={3} fill={pal.g[5]} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ULTRA-DETAILED TULIP
// ─────────────────────────────────────────────────────────────────────────────
function Tulip({ x, y, s = 1, hue = "pink" }) {
  const c =
    hue === "white"
      ? { outer: "#F2EDE0", mid: "#FBF8F2", vein: "#D9D0BC", base: "#C9C2AE" }
      : { outer: "#D9849E", mid: "#F0B4C4", vein: "#B8708A", base: "#A05878" };

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* stem */}
      <path d="M0 10 Q-3 40 0 70" fill="none" stroke="#3A6040" strokeWidth={4.5} strokeLinecap="round" />
      {/* leaf */}
      <path d="M0 38 C-20 28 -28 12 -18 2" fill="#4E7A50" stroke="#3A6040" strokeWidth={0.8} opacity={0.8} />
      {/* back petals */}
      {[-28, 28].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <path d={petal(44, 18, 0.64)} fill={c.outer} opacity={0.88} />
          <path d="M0 0 L0 -38" stroke={c.vein} strokeWidth={0.8} opacity={0.5} />
        </g>
      ))}
      {/* front petals */}
      {[-14, 0, 14].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <path d={petal(48, 20, 0.65)} fill={i === 1 ? c.mid : c.outer} />
          <path d="M0 0 L0 -42" stroke={c.vein} strokeWidth={0.8} opacity={0.45} />
        </g>
      ))}
      {/* inner throat glow */}
      <ellipse cx={0} cy={-8} rx={5} ry={9} fill={c.base} opacity={0.35} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ULTRA-DETAILED LILY
// ─────────────────────────────────────────────────────────────────────────────
function Lily({ x, y, s = 1 }) {
  const tepal = (a, back) => (
    <g key={a} transform={`rotate(${a})`}>
      <path d={petal(54, 26, 0.58)} fill="#FDFBF5" stroke="#E8E0CC" strokeWidth={0.7} opacity={back ? 0.9 : 1} />
      <path d="M0 -3 L0 -48" stroke="#DDD4BC" strokeWidth={0.9} opacity={0.45} />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* stem */}
      <line x1={0} y1={20} x2={0} y2={70} stroke="#3D6040" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      {/* back tepals */}
      {[20, 140, 260].map((a) => tepal(a, true))}
      {/* throat glow */}
      <circle r={14} fill="#F2E2A0" opacity={0.18} />
      {/* front tepals */}
      {[80, 200, 320].map((a) => tepal(a, false))}
      {/* freckles */}
      {[0, 52, 104, 156, 208, 260, 312].map((a) => (
        <ellipse
          key={a}
          rx={1.8}
          ry={1.1}
          fill="#B8401A"
          opacity={0.38}
          transform={`rotate(${a}) translate(0 -13)`}
        />
      ))}
      {/* stamens */}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={`M0 0 Q ${3} -16 0 -24`} stroke="#9CAA60" strokeWidth={1.4} fill="none" />
          <ellipse cx={0} cy={-24} rx={3} ry={1.8} fill="#D4B84A" />
        </g>
      ))}
      <circle r={4} fill="#ECDEAD" />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GREENERY
// ─────────────────────────────────────────────────────────────────────────────
function Eucalyptus({ x, y, s = 1, flip = 1 }) {
  const leaves = 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * s} ${s})`}>
      <path d={`M0 0 C3 50 -3 100 0 150`} fill="none" stroke="#6B8E6B" strokeWidth={2.5} />
      {Array.from({ length: leaves }, (_, i) => {
        const t = i / (leaves - 1);
        const yy = t * 140;
        const side = i % 2 === 0 ? 1 : -1;
        const r = 10 - t * 3;
        return <circle key={i} cx={side * (10 + t * 4)} cy={yy} r={r} fill="#8DB88A" opacity={0.88 - t * 0.18} />;
      })}
    </g>
  );
}

function Ruscus({ x, y, s = 1, flip = 1 }) {
  const leaves = 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * s} ${s})`}>
      <path d={`M0 0 C2 55 -2 115 0 165`} fill="none" stroke="#4A6A4E" strokeWidth={2} />
      {Array.from({ length: leaves }, (_, i) => {
        const t = i / (leaves - 1);
        const yy = 8 + t * 150;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={side * 11}
            cy={yy}
            rx={12}
            ry={6}
            fill="#5A7A5C"
            transform={`rotate(${side * 30} ${side * 11} ${yy})`}
            opacity={0.88}
          />
        );
      })}
    </g>
  );
}

function LeatherFern({ x, y, s = 1, flip = 1 }) {
  const fronds = 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * s} ${s})`}>
      <path d={`M0 0 C4 70 -4 140 0 200`} fill="none" stroke="#3E5E42" strokeWidth={2.2} />
      {Array.from({ length: fronds }, (_, i) => {
        const t = i / (fronds - 1);
        const yy = 10 + t * 185;
        const side = i % 2 === 0 ? 1 : -1;
        const len = 18 - t * 6;
        return (
          <path
            key={i}
            d={`M0 ${yy} Q${side * len * 0.6} ${yy - 4} ${side * len} ${yy - 2}`}
            fill="none"
            stroke="#4E7252"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.82}
          />
        );
      })}
    </g>
  );
}

function SalalLeaf({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M0 0 C20 -8 38 -22 34 -48 C30 -68 14 -74 0 -60 C-14 -74 -30 -68 -34 -48 C-38 -22 -20 -8 0 0 Z"
        fill="#6A9A70"
        stroke="#4A7050"
        strokeWidth={0.8}
        opacity={0.9}
      />
      <path d="M0 0 L0 -56" stroke="#4A7050" strokeWidth={0.9} opacity={0.45} />
    </g>
  );
}

function BabysBreath({ x, y, s = 1 }) {
  const localR = mulberry(Math.round(x * 7 + y * 13));
  const dots = Array.from({ length: 18 }, (_, i) => ({
    dx: (localR() - 0.5) * 70,
    dy: (localR() - 0.5) * 70,
    r: 2 + localR() * 2,
  }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* delicate branching stems */}
      {dots.slice(0, 6).map((d, i) => (
        <line key={i} x1={0} y1={0} x2={d.dx * 0.6} y2={d.dy * 0.6} stroke="#B0C4A8" strokeWidth={0.8} opacity={0.45} />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.dx} cy={d.dy} r={d.r} fill="#FBFAF7" stroke="#E8E0D0" strokeWidth={0.5} opacity={0.9} />
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-GENERATE ALL BOTANICAL ELEMENTS (seeded so stable)
// ─────────────────────────────────────────────────────────────────────────────
function genField(count, seed, yBias = 0) {
  const r = mulberry(seed);
  return Array.from({ length: count }, (_, i) => {
    const angle = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.5) * 0.46;
    return {
      x: cx + Math.cos(angle) * rad * W,
      y: H * 0.3 + Math.sin(angle) * rad * H * 0.38 + yBias + r() * 30,
      s: 0.55 + r() * 0.7,
      rot: (r() - 0.5) * 60,
      flip: r() > 0.5 ? 1 : -1,
      z: r() > 0.66 ? 3 : r() > 0.33 ? 2 : 1,
    };
  });
}

const RED_ROSES    = genField(22, 1001);
const PINK_ROSES   = genField(18, 1002);
const W_TULIPS     = genField(14, 1003);
const P_TULIPS     = genField(14, 1004);
const LILIES_F     = genField(10, 1005);
const EUCAS        = genField(24, 1006);
const RUSCUS_F     = genField(20, 1007);
const FERNS        = genField(16, 1008);
const SALALS       = genField(18, 1009);
const BREATH_F     = genField(30, 1010);

// ─────────────────────────────────────────────────────────────────────────────
// STEM PATHS — gathered fan from wrap base to every bloom
// ─────────────────────────────────────────────────────────────────────────────
const BASE_Y = H * 0.92;
const BASE_X = cx;

function buildStems() {
  const r = mulberry(555);
  const stems = [];
  // Stems to each photo bloom
  BLOOMS.forEach((b) => {
    const tx = px(b.x);
    const ty = py(b.y);
    const midX = BASE_X + (tx - BASE_X) * 0.42 + (r() - 0.5) * 60;
    const midY = BASE_Y - (BASE_Y - ty) * 0.55;
    stems.push(`M${BASE_X} ${BASE_Y} C${midX} ${midY} ${tx} ${ty + b.r * 0.8} ${tx} ${ty}`);
  });
  // Extra filler stems
  for (let i = 0; i < 28; i++) {
    const tx = cx + (r() - 0.5) * W * 0.8;
    const ty = H * (0.1 + r() * 0.45);
    const midX = BASE_X + (tx - BASE_X) * 0.38 + (r() - 0.5) * 80;
    const midY = BASE_Y - (BASE_Y - ty) * 0.5;
    stems.push(`M${BASE_X} ${BASE_Y} C${midX} ${midY} ${tx} ${ty + 30} ${tx} ${ty}`);
  }
  return stems;
}
const STEMS = buildStems();

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX — fullscreen photo viewer on tap
// ─────────────────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(30,10,20,0.72)",
        backdropFilter: "blur(12px) saturate(1.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "lbFadeIn 220ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "linear-gradient(145deg,#FFF9F2,#F4E6D8)",
          borderRadius: 20, padding: 14,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)",
          maxWidth: "min(480px, 90vw)",
          animation: "lbSlideUp 280ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <img
          src={src}
          alt="Photo bloom enlarged"
          style={{ width: "100%", borderRadius: 12, display: "block", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
        />
        <button
          onClick={onClose}
          style={{
            marginTop: 12, width: "100%", padding: "11px 0",
            background: "linear-gradient(135deg,#7A1F3D,#A8305A)",
            color: "#FFF8F1", border: "none", borderRadius: 10,
            fontSize: 15, cursor: "pointer", fontWeight: 500,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: "0.06em", boxShadow: "0 4px 14px rgba(122,31,61,0.4)",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function LuxuryPhotoBouquet() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes lbFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes lbSlideUp { from{transform:translateY(24px) scale(0.94);opacity:0} to{transform:none;opacity:1} }
        @keyframes bouquetSway {
          0%  { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
          100%{ transform: rotate(-0.5deg); }
        }
        @keyframes bloomFade {
          from { opacity:0; transform: scale(0.88); }
          to   { opacity:1; transform: scale(1); }
        }
        .lbq-bloom { animation: bloomFade 600ms cubic-bezier(0.22,1,0.36,1) both; }
        .lbq-sway  { animation: bouquetSway 9s ease-in-out infinite; transform-origin: ${cx}px ${BASE_Y}px; }
        @media (prefers-reduced-motion: reduce) {
          .lbq-bloom,.lbq-sway { animation: none; }
        }
      `}</style>

      <div style={{
        width: "100%", minHeight: "100vh",
        background: "radial-gradient(ellipse 130% 90% at 50% 0%, #FFF6EE 0%, #FCEADE 30%, #F5D8C4 62%, #ECC9B0 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "44px 12px 60px",
        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
        position: "relative", overflow: "hidden",
      }}>

        {/* ── Cinematic ambient bokeh lighting ── */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(circle at 10% 12%, rgba(255,235,200,0.65) 0%, transparent 28%)," +
            "radial-gradient(circle at 90% 10%, rgba(252,218,190,0.55) 0%, transparent 26%)," +
            "radial-gradient(circle at 50%  5%, rgba(255,250,240,0.80) 0%, transparent 22%)," +
            "radial-gradient(circle at 85% 68%, rgba(250,230,210,0.50) 0%, transparent 22%)," +
            "radial-gradient(circle at 12% 72%, rgba(245,208,215,0.45) 0%, transparent 20%)",
        }} />
        {/* sun-ray streaks */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "55%",
          pointerEvents: "none",
          background:
            "linear-gradient(162deg, rgba(255,240,210,0.18) 0%, transparent 40%)," +
            "linear-gradient(198deg, rgba(255,240,210,0.12) 0%, transparent 35%)",
        }} />

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
          <p style={{
            fontSize: 13, letterSpacing: "0.34em", textTransform: "uppercase",
            color: "#B07840", margin: "0 0 6px",
            fontFamily: "'Inter', sans-serif", fontWeight: 400,
          }}>
            ✦ For You, Always ✦
          </p>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 52px)", color: "#6A1E3C",
            margin: "0 0 6px", fontWeight: 600, fontStyle: "italic", lineHeight: 1.1,
            textShadow: "0 2px 18px rgba(106,30,60,0.18)",
          }}>
            The Most Beautiful Bouquet
          </h1>
          <p style={{
            fontSize: "clamp(13px, 1.8vw, 17px)", color: "#9A6050",
            margin: "0 0 4px", fontStyle: "italic", fontWeight: 600,
          }}>
            of the Most Beautiful Flowers 🌹
          </p>
          <p style={{
            fontSize: "clamp(13px, 1.8vw, 16px)", color: "#9A6050",
            margin: 0, fontStyle: "italic",
          }}>
            every bloom you fell in love with — gathered here, just for you
          </p>
        </div>

        {/* ── Bouquet SVG Stage ── */}
        <div style={{
          position: "relative",
          width: "min(1400px, 98vw)",
          aspectRatio: `${W} / ${H}`,
          zIndex: 2,
        }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%" height="100%"
            style={{ display: "block", overflow: "visible" }}
            role="img"
            aria-label="Luxury photo bouquet arrangement"
          >
            <defs>
              {/* Shared gradients */}
              <linearGradient id="champagneWrap" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor="#F9EDDB" />
                <stop offset="50%" stopColor="#F0DFC3" />
                <stop offset="100%" stopColor="#E2C9A4" />
              </linearGradient>
              <linearGradient id="blushWrap" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAE0E6" />
                <stop offset="100%" stopColor="#EFC0CC" />
              </linearGradient>
              <linearGradient id="whiteWrap" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="100%" stopColor="#F5EDE0" />
              </linearGradient>
              <linearGradient id="ribbonSatin" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#C89838" />
                <stop offset="25%"  stopColor="#F0D080" />
                <stop offset="50%"  stopColor="#FDEDB0" />
                <stop offset="75%"  stopColor="#E8C060" />
                <stop offset="100%" stopColor="#C89838" />
              </linearGradient>
              <linearGradient id="ribbonSatin2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#D8A8C0" />
                <stop offset="50%"  stopColor="#F4D0E0" />
                <stop offset="100%" stopColor="#D8A8C0" />
              </linearGradient>
              <radialGradient id="pearlGrad" cx="0.3" cy="0.25" r="0.8">
                <stop offset="0%"   stopColor="#FFFFFF" />
                <stop offset="55%"  stopColor="#F4EAD8" />
                <stop offset="100%" stopColor="#D8C4A4" />
              </radialGradient>
              <linearGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#F4D88A" />
                <stop offset="50%"  stopColor="#C89A3A" />
                <stop offset="100%" stopColor="#E8C060" />
              </linearGradient>
              <radialGradient id="centerGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#5A2030" floodOpacity="0.22" />
              </filter>
              <filter id="stemBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2A4A2A" floodOpacity="0.28" />
              </filter>
              <filter id="wrapShadow">
                <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#5A3010" floodOpacity="0.32" />
              </filter>
              <filter id="bloomGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#C84060" floodOpacity="0.28" />
              </filter>
              {/* ── Per-bloom image patterns ──
                   patternUnits="userSpaceOnUse" coordinates are resolved in
                   the LOCAL space of the referencing element (after its
                   transform). The bloom circle sits at local origin (0,0),
                   so the pattern tile must be x=-r, y=-r, w=2r, h=2r.
                   DO NOT use canvas px()/py() coords here — those are the
                   parent (canvas) space, not the local translated space. */}
              {BLOOMS.map((b, i) => {
                const d = b.r * 2;
                return (
                  <pattern
                    key={i}
                    id={`bp-${i}`}
                    patternUnits="userSpaceOnUse"
                    x={-b.r}
                    y={-b.r}
                    width={d}
                    height={d}
                  >
                    <image
                      href={PHOTO_SRCS[i % PHOTO_SRCS.length]}
                      x={0}
                      y={0}
                      width={d}
                      height={d}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>
                );
              })}
            </defs>

            {/* ── CANOPY SWAY WRAPPER ── */}
            <g className="lbq-sway">

              {/* ── DEPTH 1: Greenery base layer ── */}
              <g opacity={0.92}>
                {EUCAS.filter(f => f.z === 1).map((f, i) => (
                  <Eucalyptus key={i} x={f.x} y={f.y} s={f.s * 0.9} flip={f.flip} />
                ))}
                {RUSCUS_F.filter(f => f.z === 1).map((f, i) => (
                  <Ruscus key={i} x={f.x} y={f.y} s={f.s} flip={f.flip} />
                ))}
                {FERNS.filter(f => f.z === 1).map((f, i) => (
                  <LeatherFern key={i} x={f.x} y={f.y} s={f.s} flip={f.flip} />
                ))}
                {SALALS.filter(f => f.z === 1).map((f, i) => (
                  <SalalLeaf key={i} x={f.x} y={f.y} s={f.s} rot={f.rot} />
                ))}
              </g>

              {/* ── STEMS ── */}
              <g filter="url(#stemBlur)">
                {STEMS.map((d, i) => (
                  <path key={i} d={d} fill="none" stroke="#4E6E50" strokeWidth={2.2}
                    strokeLinecap="round" opacity={0.48 + (i % 3) * 0.1} />
                ))}
              </g>

              {/* ── DEPTH 1: Background flowers ── */}
              {RED_ROSES.filter(f => f.z === 1).map((f, i) => (
                <g key={i} filter="url(#softShadow)">
                  <Rose x={f.x} y={f.y} s={f.s * 0.85} hue="red" />
                </g>
              ))}
              {PINK_ROSES.filter(f => f.z === 1).map((f, i) => (
                <g key={i} filter="url(#softShadow)">
                  <Rose x={f.x} y={f.y} s={f.s * 0.8} hue="pink" />
                </g>
              ))}
              {W_TULIPS.filter(f => f.z === 1).map((f, i) => (
                <g key={i} filter="url(#softShadow)">
                  <Tulip x={f.x} y={f.y} s={f.s * 0.8} hue="white" />
                </g>
              ))}
              {P_TULIPS.filter(f => f.z === 1).map((f, i) => (
                <g key={i} filter="url(#softShadow)">
                  <Tulip x={f.x} y={f.y} s={f.s * 0.8} hue="pink" />
                </g>
              ))}
              {LILIES_F.filter(f => f.z === 1).map((f, i) => (
                <g key={i} filter="url(#softShadow)">
                  <Lily x={f.x} y={f.y} s={f.s * 0.9} />
                </g>
              ))}

              {/* ── ALL PHOTO BLOOMS ── */}
              {[...BLOOMS]
                .map((b, i) => ({ ...b, idx: i }))
                .sort((a, b) => a.z - b.z)
                .map(({ idx, x, y, r, rot }) => (
                  <g
                    key={idx}
                    transform={`translate(${px(x)} ${py(y)}) rotate(${rot})`}
                    filter="url(#bloomGlow)"
                    className="lbq-bloom"
                    style={{ animationDelay: `${idx * 38}ms` }}
                  >
                    <PhotoBloom
                      patId={`bp-${idx}`}
                      r={r}
                      petalIdx={idx}
                      onTap={() => setActiveIdx(idx)}
                    />
                  </g>
                ))
              }

              {/* ── Baby's breath overlay — finest top layer ── */}
              {BREATH_F.map((f, i) => (
                <BabysBreath key={i} x={f.x} y={f.y} s={f.s * 0.85} />
              ))}

              {/* ── Central ambient glow over whole canopy ── */}
              <ellipse cx={cx} cy={H * 0.33} rx={W * 0.38} ry={H * 0.28}
                fill="url(#centerGlow)" style={{ pointerEvents: "none" }} />

            </g>
            {/* end sway */}

            {/* ── LUXURY WRAP — drawn outside sway so it stays put ── */}
            <g filter="url(#wrapShadow)">
              {/* back champagne layer */}
              <path
                d={`M${cx - W*0.34} ${H*0.65} C${cx - W*0.38} ${H*0.76} ${cx - W*0.12} ${H*0.97} ${cx - W*0.08} ${H*0.99}
                    L${cx + W*0.08} ${H*0.99} C${cx + W*0.12} ${H*0.97} ${cx + W*0.38} ${H*0.76} ${cx + W*0.34} ${H*0.65}
                    C${cx + W*0.18} ${H*0.73} ${cx - W*0.18} ${H*0.73} ${cx - W*0.34} ${H*0.65} Z`}
                fill="url(#champagneWrap)"
              />
              {/* white left sheet */}
              <path
                d={`M${cx - W*0.38} ${H*0.62} C${cx - W*0.46} ${H*0.76} ${cx - W*0.22} ${H*0.97} ${cx - W*0.06} ${H*0.99}
                    L${cx} ${H*0.99} C${cx - W*0.06} ${H*0.90} ${cx - W*0.28} ${H*0.74} ${cx - W*0.20} ${H*0.62}
                    C${cx - W*0.28} ${H*0.64} ${cx - W*0.34} ${H*0.64} ${cx - W*0.38} ${H*0.62} Z`}
                fill="url(#whiteWrap)" opacity={0.9}
              />
              {/* blush right sheet */}
              <path
                d={`M${cx + W*0.38} ${H*0.62} C${cx + W*0.46} ${H*0.76} ${cx + W*0.22} ${H*0.97} ${cx + W*0.06} ${H*0.99}
                    L${cx} ${H*0.99} C${cx + W*0.06} ${H*0.90} ${cx + W*0.28} ${H*0.74} ${cx + W*0.20} ${H*0.62}
                    C${cx + W*0.28} ${H*0.64} ${cx + W*0.34} ${H*0.64} ${cx + W*0.38} ${H*0.62} Z`}
                fill="url(#blushWrap)" opacity={0.95}
              />
              {/* paper crease lines */}
              {[-0.22, -0.10, 0.04, 0.16, 0.28].map((offset, i) => (
                <path key={i}
                  d={`M${cx + offset*W} ${H*0.64} C${cx + offset*W*0.9} ${H*0.80} ${cx + offset*W*0.7} ${H*0.93} ${cx + offset*W*0.5} ${H*0.99}`}
                  fill="none" stroke="rgba(140,100,55,0.13)" strokeWidth={1.5}
                />
              ))}
              {/* gold satin ribbon band */}
              <path
                d={`M${cx - W*0.30} ${H*0.73} C${cx - W*0.10} ${H*0.77} ${cx + W*0.10} ${H*0.77} ${cx + W*0.30} ${H*0.73}
                    L${cx + W*0.28} ${H*0.79} C${cx + W*0.08} ${H*0.83} ${cx - W*0.08} ${H*0.83} ${cx - W*0.28} ${H*0.79} Z`}
                fill="url(#ribbonSatin)"
              />
              <path
                d={`M${cx - W*0.30} ${H*0.73} C${cx - W*0.10} ${H*0.77} ${cx + W*0.10} ${H*0.77} ${cx + W*0.30} ${H*0.73}`}
                fill="none" stroke="#A87828" strokeWidth={1.2} opacity={0.5}
              />
              {/* blush ribbon accent below */}
              <path
                d={`M${cx - W*0.24} ${H*0.80} C${cx - W*0.08} ${H*0.83} ${cx + W*0.08} ${H*0.83} ${cx + W*0.24} ${H*0.80}
                    L${cx + W*0.22} ${H*0.85} C${cx + W*0.07} ${H*0.88} ${cx - W*0.07} ${H*0.88} ${cx - W*0.22} ${H*0.85} Z`}
                fill="url(#ribbonSatin2)" opacity={0.85}
              />
              {/* satin bow */}
              <g transform={`translate(${cx} ${H*0.755})`}>
                <path d="M0 0 C-80 -40 -130 12 -70 42 C-36 58 -10 28 0 0 Z" fill="url(#ribbonSatin)" stroke="#C8981E" strokeWidth={1.5} />
                <path d="M0 0 C80 -40 130 12 70 42 C36 58 10 28 0 0 Z" fill="url(#ribbonSatin)" stroke="#C8981E" strokeWidth={1.5} />
                {/* bow sheen */}
                <path d="M-30 -8 C-50 -20 -70 4 -42 20" fill="none" stroke="rgba(255,245,210,0.55)" strokeWidth={4} strokeLinecap="round" />
                <path d="M30 -8 C50 -20 70 4 42 20" fill="none" stroke="rgba(255,245,210,0.45)" strokeWidth={3} strokeLinecap="round" />
                {/* center pearl knot */}
                <circle r={16} fill="url(#pearlGrad)" stroke="#D4B878" strokeWidth={1.5} />
                <circle r={10} fill="rgba(255,255,255,0.4)" />
                {/* ribbon tails */}
                <path d="M-10 12 C-30 70 -48 130 -28 180" fill="none" stroke="url(#ribbonSatin)" strokeWidth={13} strokeLinecap="round" opacity={0.9} />
                <path d="M10 14 C32 74 26 136 48 184" fill="none" stroke="url(#ribbonSatin)" strokeWidth={11} strokeLinecap="round" opacity={0.9} />
              </g>
              {/* pearl embellishments on ribbon */}
              {[cx - W*0.26, cx - W*0.18, cx - W*0.09, cx, cx + W*0.09, cx + W*0.18, cx + W*0.26].map((pcx, i) => (
                <g key={i} transform={`translate(${pcx} ${H*0.755 - Math.sin(i*0.9)*6})`}>
                  <circle r={7} fill="url(#pearlGrad)" stroke="#D8C4A2" strokeWidth={0.6} />
                  <circle r={3} cx={-2} cy={-2} fill="rgba(255,255,255,0.5)" />
                </g>
              ))}
              {/* lace trim along wrap top edge */}
              <g opacity={0.62}>
                {Array.from({ length: 36 }, (_, i) => {
                  const lx = cx - W*0.36 + i * (W*0.72 / 35);
                  const ly = H*0.648 + Math.sin(i * 1.6) * 5;
                  return <circle key={i} cx={lx} cy={ly} r={4.5} fill="none" stroke="#fff" strokeWidth={1.3} />;
                })}
              </g>
              {/* gold foil star accents on wrap */}
              {[
                [cx - W*0.22, H*0.86], [cx - W*0.10, H*0.90], [cx + W*0.04, H*0.88],
                [cx + W*0.16, H*0.84], [cx + W*0.28, H*0.92], [cx - W*0.30, H*0.82],
                [cx, H*0.94],
              ].map(([gx, gy], i) => (
                <path key={i}
                  d={`M${gx} ${gy-8} L${gx+3} ${gy-2} L${gx+9} ${gy} L${gx+3} ${gy+2} L${gx} ${gy+8} L${gx-3} ${gy+2} L${gx-9} ${gy} L${gx-3} ${gy-2} Z`}
                  fill="#D9A84A" opacity={0.72}
                  transform={`rotate(${i*23} ${gx} ${gy})`}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* ── Caption ── */}
        <p style={{
          marginTop: 22, fontSize: 15, color: "#8A5840",
          fontStyle: "italic", textAlign: "center", maxWidth: 540,
          position: "relative", zIndex: 2, lineHeight: 1.7,
        }}>
          14 flowers, 14 photo blooms — tap any to bring it forward ✨
        </p>

        {/* ── Lightbox ── */}
        {activeIdx !== null && (
          <Lightbox src={PHOTO_SRCS[activeIdx % PHOTO_SRCS.length]} onClose={() => setActiveIdx(null)} />
        )}
      </div>
    </>
  );
}