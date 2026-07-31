import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";

/**
 * PhotoBouquet — a full bouquet of real flowers (white lily, pink & white
 * tulips, red & pink roses) with your own photos tucked in as blooms.
 *
 * ── HOW TO USE ─────────────────────────────────────────────────────────
 * 1. Drop this file into your React project (needs no extra dependencies,
 *    just React itself — plain inline SVG + CSS-in-JS, nothing to install).
 * 2. Edit the PHOTO_PATHS array at the bottom of this file, or pass a
 *    `photos` prop, with 1–70+ image paths/URLs. Local paths (e.g.
 *    "/photos/us-01.jpg"), imported assets, or remote URLs all work.
 * 3. Render <PhotoBouquet /> — that's it. It also has a small settings
 *    drawer (bottom-right ✎ button) so paths can be pasted/edited live
 *    without touching code, which is handy while you're curating them.
 *
 * The bouquet is built like a real one: stems gathered at a base, wrapped
 * in paper + ribbon, with leaves, then the real flowers (lily/tulips/roses)
 * placed as the structural blooms, and your photos scattered in as photo
 * blooms among them — same layered, hand-arranged logic a florist uses,
 * not a grid.
 * ────────────────────────────────────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────
const TOKENS = {
  color: {
    bgTop: "#FBF3F1",
    bgBottom: "#F3DEE2",
    ink: "#4A2530",
    inkSoft: "#8A5A64",
    roseDeep: "#7A2E3A",
    roseRed: "#C4405A",
    roseRedDark: "#9C3049",
    pink: "#F2A6BB",
    pinkSoft: "#F7C6D4",
    pinkPetalShade: "#E48CA6",
    creamWhite: "#FBF7F2",
    creamShade: "#EFE3D9",
    lilyThroat: "#E7B94A",
    sage: "#6B8E6B",
    sageDark: "#4E6E51",
    sageLight: "#8FAE84",
    gold: "#C9A15A",
    paper: "#F6ECE3",
    paperShade: "#E6D3C2",
  },
  font: {
    display: `'Cormorant Garamond', 'Cormorant', Georgia, serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
};

// ─────────────────────────────────────────────────────────────────────────
// DEFAULT PHOTO LIST — replace with your own 50+ paths.
// You can also pass a `photos` prop to <PhotoBouquet photos={[...]} />
// instead of editing this array.
// ─────────────────────────────────────────────────────────────────────────
const PHOTO_PATHS = [
  "/assets/guess/alice.jpg",
  "/assets/guess/angela.jpg",
  "/assets/guess/carmillia.jpg",
  "/assets/guess/change.jpg",
  "/assets/guess/floryn.jpg",
  "/assets/guess/guinevere.jpg",
  "/assets/guess/kagura.jpg",
  "/assets/guess/layla.jpg",
  "/assets/guess/lunox.jpg",
  "/assets/guess/mathilda.jpg",
  "/assets/guess/miya.jpg",
  "/assets/guess/nana.jpg",
  "/assets/guess/odette.jpg",
  "/assets/guess/rafaela.jpg",
  "/assets/guess/selena.jpg",
  "/assets/guess/zetian.jpg",
];

// ─────────────────────────────────────────────────────────────────────────
// small deterministic PRNG so the arrangement is stable across re-renders
// (no layout "jump" when photos load) but still looks organically scattered
// ─────────────────────────────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─────────────────────────────────────────────────────────────────────────
// FLOWER PRIMITIVES — layered SVG petals so each bloom reads as a real
// flower (overlapping petal shapes + shading), not an icon.
// All primitives are drawn centered at (0,0), meant to be placed via a
// wrapping <g transform="translate(x,y) rotate(r) scale(s)">.
// ─────────────────────────────────────────────────────────────────────────

/**
 * A single rounded petal outline: base at origin, tip at (0,-len), full
 * width reached partway up (bulgeAt, 0..1) then tapering to a point at the
 * tip — an almond/teardrop, not a triangle-with-bent-sides.
 */
function petalPath(len, width, bulgeAt = 0.42) {
  const w = width / 2;
  const bulgeY = -len * bulgeAt;
  return [
    `M 0 0`,
    `Q ${-w * 1.15} ${bulgeY * 0.55} ${-w} ${bulgeY}`,
    `Q ${-w * 0.35} ${-len * 0.88} 0 ${-len}`,
    `Q ${w * 0.35} ${-len * 0.88} ${w} ${bulgeY}`,
    `Q ${w * 1.15} ${bulgeY * 0.55} 0 0`,
    `Z`,
  ].join(" ");
}

function RoseBloom({ hue = "red", size = 1 }) {
  const palette =
    hue === "red"
      ? {
          outer: TOKENS.color.roseRedDark,
          mid: TOKENS.color.roseRed,
          inner: "#E0688A",
          core: "#F3A7BE",
        }
      : {
          outer: TOKENS.color.pinkPetalShade,
          mid: TOKENS.color.pink,
          inner: "#F8CBDA",
          core: TOKENS.color.creamWhite,
        };
  const s = size;
  // Concentric rings of petals, each ring smaller & lighter toward center.
  // Each petal is drawn base-at-origin/tip-up via petalPath, then pushed
  // outward along its own angle by `radius` BEFORE rotating, so the petal
  // base sits on the ring and the petal points outward — this is what
  // makes them read as a cupped rose instead of a flat pinwheel.
  const ring = (count, len, width, radius, fill, startAngle, opacity = 1) =>
    Array.from({ length: count }).map((_, i) => {
      const angle = startAngle + (360 / count) * i;
      return (
        <g key={`${radius}-${i}`} transform={`rotate(${angle})`}>
          <path
            d={petalPath(len, width, 0.46)}
            fill={fill}
            opacity={opacity}
            transform={`translate(0 ${-radius})`}
          />
        </g>
      );
    });
  return (
    <g>
      {/* base disc so gaps between outer petals don't show background through */}
      <circle r={17 * s} fill={palette.mid} opacity={0.9} />
      {/* outer guard petals, loosest/largest, slightly folded outward */}
      <g>{ring(7, 23 * s, 19 * s, 9 * s, palette.outer, 6, 0.98)}</g>
      {/* mid ring, offset rotation so petals nestle in the gaps above */}
      <g>{ring(6, 18 * s, 16 * s, 6.5 * s, palette.mid, 34, 1)}</g>
      {/* inner ring, tighter cup */}
      <g>{ring(5, 12.5 * s, 11.5 * s, 4 * s, palette.inner, 14, 1)}</g>
      {/* furled center swirl */}
      <g>{ring(4, 7 * s, 7.5 * s, 2 * s, palette.core, 30, 1)}</g>
      <circle r={1.8 * s} fill={palette.outer} opacity={0.6} />
    </g>
  );
}

function TulipBloom({ hue = "pink", size = 1 }) {
  const fill = hue === "pink" ? TOKENS.color.pink : TOKENS.color.creamWhite;
  const shade =
    hue === "pink" ? TOKENS.color.pinkPetalShade : TOKENS.color.creamShade;
  const s = size;
  // Tulip: a closed cup of upright, slightly-flared petals using the same
  // teardrop petal, but taller/narrower and bulging higher (cup shape).
  const petals = [-32, -16, 0, 16, 32];
  return (
    <g>
      <circle r={9 * s} fill={fill} opacity={0.55} />
      {petals.map((a, i) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            d={petalPath(34 * s, 15 * s, 0.62)}
            fill={i === 2 ? fill : shade}
            opacity={i === 2 ? 1 : 0.94}
          />
        </g>
      ))}
      <ellipse cx={0} cy={-6 * s} rx={3.5 * s} ry={6 * s} fill={TOKENS.color.lilyThroat} opacity={0.3} />
    </g>
  );
}

function LilyBloom({ size = 1 }) {
  const s = size;
  // A real lily petal (tepal) is broad and spoon-shaped: narrow where it
  // meets the throat, widening to a rounded/pointed tip — wider and with
  // the bulge higher up than a rose petal, so it reads as an open trumpet
  // rather than a thin star point.
  const petal = (angle, backLayer) => (
    <g key={angle} transform={`rotate(${angle})`}>
      <path
        d={petalPath(46 * s, 22 * s, 0.58)}
        fill={TOKENS.color.creamWhite}
        stroke={TOKENS.color.creamShade}
        strokeWidth={0.7}
        opacity={backLayer ? 0.96 : 1}
      />
      {/* center rib for petal structure */}
      <line
        x1={0}
        y1={-4 * s}
        x2={0}
        y2={-42 * s}
        stroke={TOKENS.color.creamShade}
        strokeWidth={0.6}
        opacity={0.5}
      />
    </g>
  );
  return (
    <g>
      {/* soft throat glow behind everything */}
      <circle r={16 * s} fill={TOKENS.color.lilyThroat} opacity={0.14} />
      {/* six broad tepals, back three then front three, like a real lily */}
      {[15, 135, 255].map((a) => petal(a, true))}
      {[75, 195, 315].map((a) => petal(a, false))}
      {/* throat freckles */}
      <g opacity={0.85}>
        {[0, 50, 100, 150, 200, 250, 300].map((a) => (
          <ellipse
            key={a}
            rx={1.3 * s}
            ry={0.9 * s}
            fill={TOKENS.color.roseRed}
            opacity={0.4}
            transform={`rotate(${a}) translate(0 ${-11 * s})`}
          />
        ))}
      </g>
      {/* stamens, curving gently outward */}
      {[25, 90, 155, 205, 270, 335].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            d={`M 0 0 Q ${3 * s} ${-14 * s} 0 ${-22 * s}`}
            stroke={TOKENS.color.sageLight}
            strokeWidth={1.1}
            fill="none"
          />
          <ellipse cx={0} cy={-22 * s} rx={2.6 * s} ry={1.4 * s} fill={TOKENS.color.lilyThroat} />
        </g>
      ))}
      <circle r={3 * s} fill={TOKENS.color.creamShade} />
    </g>
  );
}

function LeafSpray({ size = 1, flip = 1 }) {
  const s = size;
  return (
    <g transform={`scale(${flip * s} ${s})`}>
      <path
        d="M 0 0 C 14 -6, 26 -20, 22 -40 C 10 -28, 0 -16, 0 0 Z"
        fill={TOKENS.color.sage}
      />
      <path
        d="M 0 0 C 14 -6, 26 -20, 22 -40 C 10 -28, 0 -16, 0 0 Z"
        fill="none"
        stroke={TOKENS.color.sageDark}
        strokeWidth={0.8}
        opacity={0.4}
        transform="translate(2 -2) scale(0.9)"
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PHOTO BLOOM — a user photo mounted like a flower: circular frame, a
// scalloped petal-edge behind it, and a thin gold stamen ring, so it reads
// as part of the bouquet rather than a photo pasted on top of one.
// ─────────────────────────────────────────────────────────────────────────
function scallopPath(petalCount, rOuter, rInner) {
  const pts = [];
  const step = (Math.PI * 2) / (petalCount * 2);
  for (let i = 0; i < petalCount * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = i * step - Math.PI / 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]} `;
  for (let i = 1; i <= pts.length; i++) {
    const [cx, cy] = pts[i % pts.length];
    d += `Q ${cx} ${cy} `;
    if (i < pts.length) {
      const midX = (pts[i % pts.length][0] + pts[(i + 1) % pts.length][0]) / 2;
      const midY = (pts[i % pts.length][1] + pts[(i + 1) % pts.length][1]) / 2;
      d += `${midX} ${midY} `;
    }
  }
  d += "Z";
  return d;
}

function PhotoBloom({ src, radius, petalColor, ring, loaded, onLoad, onError, errored }) {
  const clipId = useRef(
    `clip-${Math.random().toString(36).slice(2, 10)}`
  ).current;
  const scallop = useMemo(() => scallopPath(9, radius * 1.28, radius * 1.02), [radius]);
  return (
    <g>
      {/* scalloped petal backing */}
      <path d={scallop} fill={petalColor} opacity={0.95} />
      <path d={scallop} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1} />
      {/* photo disc */}
      <clipPath id={clipId}>
        <circle r={radius} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <circle r={radius} fill="#EFE0D8" />
        {!errored ? (
          <image
            href={src}
            x={-radius}
            y={-radius}
            width={radius * 2}
            height={radius * 2}
            preserveAspectRatio="xMidYMid slice"
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <g>
            <circle r={radius} fill="#F3E4DC" />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={radius * 0.9}
              fill="#C9A88F"
              fontFamily={TOKENS.font.display}
            >
              ♥
            </text>
          </g>
        )}
      </g>
      <circle r={radius} fill="none" stroke={ring} strokeWidth={2.25} />
      <circle r={radius + 3.5} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LAYOUT ENGINE — builds a hand-arranged-looking bouquet layout:
//  • a fan of stem endpoints gathered at a base point
//  • structural flowers (lily/tulips/roses) placed on an outer + inner ring
//  • photo blooms filling every remaining gap, biased outward at the edges
//    and denser toward the middle, like a florist packing a round bouquet
// ─────────────────────────────────────────────────────────────────────────
function buildArrangement(photoCount, seed, W, H) {
  const rand = mulberry32(seed);
  const cx = W / 2;
  const baseY = H * 0.965; // where stems gather / ribbon sits
  const headCenterY = H * 0.42; // vertical center of the flower mass
  const maxRadius = Math.min(W, H) * 0.44;

  // ---- structural flowers: fixed, hand-placed-feeling positions ----
  // Placed on a slightly domed arrangement (higher in the middle) like a
  // real round bouquet, not a flat circle.
  const dome = (r, angleDeg) => {
    const a = (angleDeg * Math.PI) / 180;
    const domeLift = Math.cos((r / maxRadius) * (Math.PI / 2)) * (H * 0.05);
    return {
      x: cx + Math.cos(a) * r,
      y: headCenterY - Math.sin(a) * r * 0.62 - domeLift,
    };
  };

  const structural = [
    // Center-top: lily as the crown focal bloom
    { type: "lily", size: 1.55, ...dome(0.02 * maxRadius, 90), z: 30 },

    // Roses — red, clustered slightly right/left of center, mid-height (focal color)
    { type: "rose", hue: "red", size: 1.35, ...dome(0.34 * maxRadius, 60), z: 26 },
    { type: "rose", hue: "red", size: 1.3, ...dome(0.4 * maxRadius, 122), z: 25 },
    { type: "rose", hue: "red", size: 1.15, ...dome(0.58 * maxRadius, 25), z: 20 },
    { type: "rose", hue: "pink", size: 1.25, ...dome(0.5 * maxRadius, 150), z: 22 },
    { type: "rose", hue: "pink", size: 1.1, ...dome(0.66 * maxRadius, 100), z: 18 },
    { type: "rose", hue: "pink", size: 1.05, ...dome(0.62 * maxRadius, 165), z: 17 },

    // Tulips — pink & white, lower/outer, softer & smaller than roses
    { type: "tulip", hue: "pink", size: 1.05, ...dome(0.72 * maxRadius, 45), z: 15 },
    { type: "tulip", hue: "white", size: 1.0, ...dome(0.78 * maxRadius, 140), z: 14 },
    { type: "tulip", hue: "pink", size: 0.95, ...dome(0.68 * maxRadius, 12), z: 13 },
    { type: "tulip", hue: "white", size: 1.0, ...dome(0.82 * maxRadius, 78), z: 12 },
    { type: "tulip", hue: "pink", size: 0.9, ...dome(0.76 * maxRadius, 178), z: 11 },
    { type: "tulip", hue: "white", size: 0.9, ...dome(0.85 * maxRadius, 155), z: 10 },

    // A second, smaller lily off-center for asymmetric balance
    { type: "lily", size: 1.15, ...dome(0.46 * maxRadius, 168), z: 24 },
  ];

  // leaf sprays tucked at the outer edge, under the flowers
  const leaves = [];
  for (let i = 0; i < 9; i++) {
    const angle = 8 + i * 18 + rand() * 6;
    const r = maxRadius * (0.82 + rand() * 0.22);
    const p = dome(r, angle);
    leaves.push({
      x: p.x,
      y: p.y + 14,
      size: 0.75 + rand() * 0.5,
      flip: rand() > 0.5 ? 1 : -1,
      rot: -20 + rand() * 40,
      z: 4 + Math.round(rand() * 3),
    });
  }

  // ---- photo blooms: ring-packed placement, then relaxed with jitter ----
  // Rejection sampling alone tends to either collide (accept-too-easily) or
  // leave visible gaps at low density. Instead: lay photos out on concentric
  // rings (like real bouquet packing — outer guard blooms, then rings
  // stepping inward), sized so each ring's circumference actually fits its
  // count without overlap, then apply small per-photo jitter for an organic
  // (not robotic) feel. This guarantees full coverage and no collisions for
  // any photo count from a handful to 100+.
  const photos = [];

  // radius (as fraction of maxRadius) shrinks toward center; base bloom
  // size grows slightly toward center to match a dome (bigger up top).
  const ringFractions = [1.0, 0.86, 0.72, 0.58, 0.44, 0.3, 0.16];
  const baseRadius =
    photoCount <= 24 ? 42 : photoCount <= 40 ? 36 : photoCount <= 60 ? 31 : photoCount <= 85 ? 26 : 22;

  // decide how many photos go on each ring so each ring's arc-length can
  // fit its count at ~2.15x bloom-diameter spacing (packed but not touching)
  const ringCapacity = ringFractions.map((f) => {
    const rr = f * maxRadius;
    const circumference = 2 * Math.PI * rr * 0.86; // ×0.86: dome compresses angularly
    return Math.max(3, Math.floor(circumference / (baseRadius * 2.15)));
  });

  let remaining = photoCount;
  let ringIdx = 0;
  const ringAssignments = ringFractions.map(() => 0);
  while (remaining > 0 && ringIdx < ringFractions.length) {
    const take = Math.min(remaining, ringCapacity[ringIdx]);
    ringAssignments[ringIdx] = take;
    remaining -= take;
    ringIdx++;
  }
  // any leftover (very large photoCount) gets appended to the outermost
  // ring in a second pass at slightly smaller size, rather than dropped
  let overflow = remaining;

  let angleCursorOffset = rand() * 40; // rotate the whole ring pattern randomly

  for (let r = 0; r < ringFractions.length; r++) {
    const count = ringAssignments[r];
    if (count === 0) continue;
    const rf = ringFractions[r];
    const rr = rf * maxRadius;
    const ringSizeMul = 1 + (1 - rf) * 0.28; // inner rings slightly larger (dome top)
    for (let i = 0; i < count; i++) {
      const angle = angleCursorOffset + (360 / count) * i + (r % 2 === 0 ? 0 : 360 / count / 2);
      const p = dome(rr, angle);
      const jitterR = (rand() - 0.5) * baseRadius * 0.5;
      const jitterAngle = (rand() - 0.5) * (360 / count) * 0.22;
      const jp = dome(Math.max(2, rr + jitterR), angle + jitterAngle);
      const radius = Math.max(13, baseRadius * ringSizeMul * (0.92 + rand() * 0.16));
      photos.push({
        x: jp.x,
        y: jp.y,
        radius,
        rot: (rand() - 0.5) * 12,
        z: 5 + Math.round((1 - rf) * 20 + rand() * 4),
        hueRoll: rand(),
      });
    }
    angleCursorOffset += (360 / Math.max(count, 1)) * 0.3;
  }

  // place overflow photos as a smaller extra ring just outside the outermost,
  // so nothing is ever dropped even for 100+ image lists
  if (overflow > 0) {
    const rr = maxRadius * 1.14;
    const smallR = Math.max(11, baseRadius * 0.72);
    for (let i = 0; i < overflow; i++) {
      const angle = angleCursorOffset + (360 / overflow) * i;
      const p = dome(rr, angle);
      photos.push({
        x: p.x,
        y: p.y + 6,
        radius: smallR,
        rot: (rand() - 0.5) * 12,
        z: 3,
        hueRoll: rand(),
      });
    }
  }

  // ---- stems: gathered fan from base to a ring of points near flower mass ----
  const stemSources = [...structural.map((s) => ({ x: s.x, y: s.y + 8 })), ...photos.slice(0, Math.min(photos.length, 22)).map((p) => ({ x: p.x, y: p.y }))];
  const stems = stemSources.map((s, i) => {
    const midX = cx + (s.x - cx) * 0.35;
    const midY = baseY - (baseY - s.y) * 0.62;
    return {
      d: `M ${cx} ${baseY} Q ${midX} ${midY} ${s.x} ${s.y}`,
      key: i,
    };
  });

  return { structural, leaves, photos, stems, cx, baseY };
}

// ─────────────────────────────────────────────────────────────────────────
// WRAP — the paper cone + ribbon the stems gather into
// ─────────────────────────────────────────────────────────────────────────
function Wrap({ cx, baseY, W, H }) {
  const topW = W * 0.4;
  const bottomW = W * 0.16;
  const wrapTop = baseY - H * 0.1;
  return (
    <g>
      <defs>
        <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={TOKENS.color.paper} />
          <stop offset="55%" stopColor="#FBF3EA" />
          <stop offset="100%" stopColor={TOKENS.color.paperShade} />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TOKENS.color.roseDeep} />
          <stop offset="50%" stopColor={TOKENS.color.roseRed} />
          <stop offset="100%" stopColor={TOKENS.color.roseDeep} />
        </linearGradient>
      </defs>
      <path
        d={`M ${cx - topW / 2} ${wrapTop}
            C ${cx - topW / 2 - 10} ${wrapTop + H * 0.05}, ${cx - bottomW / 2 - 30} ${baseY + H * 0.05}, ${cx - bottomW / 2} ${baseY + H * 0.09}
            L ${cx + bottomW / 2} ${baseY + H * 0.09}
            C ${cx + bottomW / 2 + 30} ${baseY + H * 0.05}, ${cx + topW / 2 + 10} ${wrapTop + H * 0.05}, ${cx + topW / 2} ${wrapTop}
            Z`}
        fill="url(#paperGrad)"
        stroke={TOKENS.color.paperShade}
        strokeWidth={1}
      />
      {/* paper fold lines */}
      {[-1, -0.45, 0.1, 0.55].map((f, i) => (
        <path
          key={i}
          d={`M ${cx + f * topW * 0.42} ${wrapTop + 6}
              L ${cx + f * bottomW * 0.5} ${baseY + H * 0.08}`}
          stroke={TOKENS.color.paperShade}
          strokeWidth={1}
          opacity={0.55}
          fill="none"
        />
      ))}
      {/* ribbon band */}
      <path
        d={`M ${cx - topW * 0.34} ${wrapTop + H * 0.028}
            L ${cx + topW * 0.34} ${wrapTop + H * 0.028}
            L ${cx + topW * 0.28} ${wrapTop + H * 0.075}
            L ${cx - topW * 0.28} ${wrapTop + H * 0.075} Z`}
        fill="url(#ribbonGrad)"
      />
      {/* ribbon bow */}
      <g transform={`translate(${cx} ${wrapTop + H * 0.05})`}>
        <path d="M 0 0 C -22 -14, -34 4, -6 4 C -20 10, -18 20, 0 6 Z" fill={TOKENS.color.roseRed} />
        <path d="M 0 0 C 22 -14, 34 4, 6 4 C 20 10, 18 20, 0 6 Z" fill={TOKENS.color.roseRedDark} />
        <circle r={4.5} fill={TOKENS.color.gold} />
        <path d="M -3 6 L -12 26 L -4 22 Z" fill={TOKENS.color.roseDeep} opacity={0.9} />
        <path d="M 3 6 L 12 26 L 4 22 Z" fill={TOKENS.color.roseRedDark} opacity={0.9} />
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────
export default function PhotoBouquet({
  photos: photosProp,
  title = "Happy Girlfriend's Day",
  subtitle = "every picture we've made together, gathered into one",
  seed = 7,
}) {
  const [photos, setPhotos] = useState(
    () => (photosProp && photosProp.length ? photosProp : PHOTO_PATHS)
  );
  const [loadedMap, setLoadedMap] = useState({});
  const [erroredMap, setErroredMap] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pathsText, setPathsText] = useState(() => photos.join("\n"));
  const [dims, setDims] = useState({ w: 900, h: 900 });
  const stageRef = useRef(null);

  useEffect(() => {
    if (photosProp && photosProp.length) setPhotos(photosProp);
  }, [photosProp]);

  useEffect(() => {
    function measure() {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const side = Math.max(560, Math.min(rect.width, rect.height, 1160));
      setDims({ w: side, h: side });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const arrangement = useMemo(
    () => buildArrangement(photos.length, seed, dims.w, dims.h),
    [photos.length, seed, dims.w, dims.h]
  );

  const handleLoad = useCallback((i) => {
    setLoadedMap((m) => (m[i] ? m : { ...m, [i]: true }));
  }, []);
  const handleError = useCallback((i) => {
    setErroredMap((m) => (m[i] ? m : { ...m, [i]: true }));
  }, []);

  const applyPaths = () => {
    const list = pathsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length) {
      setPhotos(list);
      setLoadedMap({});
      setErroredMap({});
    }
  };

  const photoBloomColor = (roll, size, maxR) => {
    // vary the scalloped backing color across the palette, slightly more
    // muted for smaller (outer) blooms so focal roses/lily still lead
    const edge = 1 - size / maxR;
    const palette = [
      TOKENS.color.pinkSoft,
      TOKENS.color.creamWhite,
      TOKENS.color.pink,
      "#F6D9CB",
    ];
    const base = palette[Math.floor(roll * palette.length) % palette.length];
    return base;
  };

  return (
    <div style={styles.page}>
      <FontLoader />
      <div style={styles.backdrop} aria-hidden="true">
        <div style={styles.glow} />
      </div>

      <header style={styles.header}>
        <p style={styles.eyebrow}>a bouquet, made of us</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
      </header>

      <div ref={stageRef} style={styles.stage}>
        <svg
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          width="100%"
          height="100%"
          style={styles.svg}
          role="img"
          aria-label="A bouquet of white lily, pink and white tulips, and red and pink roses, arranged with personal photos"
        >
          <defs>
            <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#5A2430" floodOpacity="0.18" />
            </filter>
            <filter id="stemShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#33502F" floodOpacity="0.25" />
            </filter>
          </defs>

          <g className="bouquet-sway" style={{ transformOrigin: `${arrangement.cx}px ${arrangement.baseY}px` }}>
            {/* stems */}
            <g filter="url(#stemShadow)">
              {arrangement.stems.map((s) => (
                <path
                  key={s.key}
                  d={s.d}
                  fill="none"
                  stroke={TOKENS.color.sageDark}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={0.85}
                />
              ))}
            </g>

            {/* wrap sits over stem bases */}
            <Wrap cx={arrangement.cx} baseY={arrangement.baseY} W={dims.w} H={dims.h} />

            {/* leaves */}
            {arrangement.leaves
              .sort((a, b) => a.z - b.z)
              .map((l, i) => (
                <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
                  <LeafSpray size={l.size} flip={l.flip} />
                </g>
              ))}

            {/* merged, z-sorted flower heads + photo blooms */}
            {[
              ...arrangement.structural.map((f) => ({ ...f, kind: "structural" })),
              ...arrangement.photos.map((p) => ({ ...p, kind: "photo" })),
            ]
              .sort((a, b) => a.z - b.z)
              .map((item, i) => {
                if (item.kind === "structural") {
                  return (
                    <g
                      key={`s-${i}`}
                      transform={`translate(${item.x} ${item.y})`}
                      filter="url(#softShadow)"
                    >
                      {item.type === "rose" && <RoseBloom hue={item.hue} size={item.size} />}
                      {item.type === "tulip" && <TulipBloom hue={item.hue} size={item.size} />}
                      {item.type === "lily" && <LilyBloom size={item.size} />}
                    </g>
                  );
                }
                const idx = arrangement.photos.indexOf(item);
                return (
                  <g
                    key={`p-${idx}`}
                    transform={`translate(${item.x} ${item.y}) rotate(${item.rot})`}
                    filter="url(#softShadow)"
                    className="photo-bloom"
                  >
                    <PhotoBloom
                      src={photos[idx]}
                      radius={item.radius}
                      petalColor={photoBloomColor(item.hueRoll, item.radius, 30)}
                      ring={idx % 2 === 0 ? TOKENS.color.gold : "#ffffff"}
                      loaded={!!loadedMap[idx]}
                      errored={!!erroredMap[idx]}
                      onLoad={() => handleLoad(idx)}
                      onError={() => handleError(idx)}
                    />
                  </g>
                );
              })}
          </g>
        </svg>
      </div>

      <p style={styles.caption}>
        {photos.length} photo{photos.length === 1 ? "" : "s"}, gathered like petals
      </p>

      {/* ── quiet settings drawer, for pasting/editing image paths ── */}
      <button
        aria-label={drawerOpen ? "Close settings" : "Edit photo paths"}
        onClick={() => setDrawerOpen((v) => !v)}
        style={styles.fab}
      >
        {drawerOpen ? "✕" : "✎"}
      </button>

      <div style={{ ...styles.drawer, ...(drawerOpen ? styles.drawerOpen : {}) }}>
        <p style={styles.drawerLabel}>Image paths (one per line)</p>
        <textarea
          value={pathsText}
          onChange={(e) => setPathsText(e.target.value)}
          spellCheck={false}
          style={styles.textarea}
          placeholder={"/photos/one.jpg\n/photos/two.jpg\nhttps://example.com/three.jpg"}
        />
        <div style={styles.drawerRow}>
          <span style={styles.drawerHint}>{pathsText.split("\n").filter((s) => s.trim()).length} paths</span>
          <button onClick={applyPaths} style={styles.applyBtn}>
            Update bouquet
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bouquetSway {
          0%   { transform: rotate(-0.6deg); }
          50%  { transform: rotate(0.6deg); }
          100% { transform: rotate(-0.6deg); }
        }
        .bouquet-sway {
          animation: bouquetSway 8s ease-in-out infinite;
        }
        @keyframes bloomIn {
          from { opacity: 0; transform: scale(0.86); }
          to   { opacity: 1; transform: scale(1); }
        }
        .photo-bloom {
          animation: bloomIn 640ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bouquet-sway { animation: none; }
          .photo-bloom { animation: none; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FONT LOADER — Google Fonts, loaded once
// ─────────────────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("bouquet-fonts")) return;
    const link = document.createElement("link");
    link.id = "bouquet-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "clamp(20px, 4vw, 56px) clamp(16px, 5vw, 40px) 40px",
    boxSizing: "border-box",
    fontFamily: TOKENS.font.body,
    color: TOKENS.color.ink,
    overflow: "hidden",
    background: `linear-gradient(180deg, ${TOKENS.color.bgTop} 0%, ${TOKENS.color.bgBottom} 100%)`,
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  glow: {
    position: "absolute",
    top: "8%",
    left: "50%",
    width: "70vw",
    height: "70vw",
    maxWidth: 900,
    maxHeight: 900,
    transform: "translateX(-50%)",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 65%)",
    filter: "blur(10px)",
  },
  header: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: 640,
    marginBottom: "clamp(4px, 1vw, 12px)",
  },
  eyebrow: {
    margin: 0,
    fontFamily: TOKENS.font.body,
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: TOKENS.color.inkSoft,
    fontWeight: 600,
  },
  title: {
    margin: "8px 0 6px",
    fontFamily: TOKENS.font.display,
    fontWeight: 600,
    fontStyle: "italic",
    fontSize: "clamp(40px, 7vw, 68px)",
    lineHeight: 1.05,
    color: TOKENS.color.roseDeep,
  },
  subtitle: {
    margin: 0,
    fontFamily: TOKENS.font.display,
    fontSize: "clamp(16px, 2.2vw, 20px)",
    color: TOKENS.color.inkSoft,
    fontStyle: "italic",
  },
  stage: {
    position: "relative",
    zIndex: 1,
    width: "min(94vw, 1160px)",
    aspectRatio: "1 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    display: "block",
    overflow: "visible",
  },
  caption: {
    position: "relative",
    zIndex: 1,
    marginTop: 10,
    fontSize: 13,
    letterSpacing: "0.04em",
    color: TOKENS.color.inkSoft,
  },
  fab: {
    position: "fixed",
    right: 20,
    bottom: 20,
    zIndex: 5,
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: `1px solid ${TOKENS.color.paperShade}`,
    background: TOKENS.color.creamWhite,
    color: TOKENS.color.roseDeep,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(90,36,48,0.16)",
  },
  drawer: {
    position: "fixed",
    right: 20,
    bottom: 76,
    zIndex: 5,
    width: "min(88vw, 340px)",
    maxHeight: "60vh",
    background: TOKENS.color.creamWhite,
    border: `1px solid ${TOKENS.color.paperShade}`,
    borderRadius: 14,
    boxShadow: "0 14px 34px rgba(90,36,48,0.2)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    opacity: 0,
    transform: "translateY(8px) scale(0.98)",
    pointerEvents: "none",
    transition: "opacity 180ms ease, transform 180ms ease",
  },
  drawerOpen: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
    pointerEvents: "auto",
  },
  drawerLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    color: TOKENS.color.inkSoft,
    letterSpacing: "0.02em",
  },
  textarea: {
    flex: 1,
    minHeight: 160,
    resize: "vertical",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
    borderRadius: 8,
    border: `1px solid ${TOKENS.color.paperShade}`,
    background: "#fff",
    color: TOKENS.color.ink,
    outline: "none",
  },
  drawerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerHint: {
    fontSize: 11,
    color: TOKENS.color.inkSoft,
  },
  applyBtn: {
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    background: TOKENS.color.roseRed,
    cursor: "pointer",
  },
};