import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";

// ─────────────────────────────────────────────────────────────────────────────
// ALL 14 MyFlowers images — each gets its own slide, shown one by one
// ─────────────────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    photo: "/assets/MyFlowers/red_rose.jpg",
    title: "my Red Rose 🌹",
    line: "Deep red, velvety, and endlessly romantic — this one's for you, always and forever. No words needed, the rose says it all.",
    chat: "Look at my rose 🌹 Isn't she the most gorgeous thing you've ever seen? Second only to you, obviously 💕",
    bg: "linear-gradient(160deg, #ffe4e6 0%, #fecdd3 100%)",
  },
  {
    photo: "/assets/MyFlowers/rose.jpg",
    title: "my Pink Rose 🌸",
    line: "Soft, sweet, and full of warmth — just like your smile that melts me every single time without fail.",
    chat: "Wait I found a pink rose 🌸 It blushed when I picked it. Probably because I told it about you 🥺",
    bg: "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)",
  },
  {
    photo: "/assets/MyFlowers/pink_rose.jpg",
    title: "my Blush Rose 🌷",
    line: "Classic, timeless, and full of colour — you're the kind of person poems are written about, and I'd write a thousand.",
    chat: "Wait — another rose, even more blush 🌷 typical you, having me discover beautiful things everywhere 😍",
    bg: "linear-gradient(160deg, #ffe4ec 0%, #ffd1dc 100%)",
  },
  {
    photo: "/assets/MyFlowers/whitelily.jpg",
    title: "my White Lily 🤍",
    line: "Pure, graceful, and impossibly elegant — exactly how you make me feel every single time I see you.",
    chat: "Wowaaaah 😮‍💨 a white lily, SO pretty. Almost as pretty as you. Almost 😏",
    bg: "linear-gradient(160deg, #f0e6ff 0%, #e9d5ff 100%)",
  },
  {
    photo: "/assets/MyFlowers/lavender.jpg",
    title: "my Lavender 💜",
    line: "Calm, sweet, and beautifully serene — like the peace I feel when I'm with you. You're my favourite kind of quiet.",
    chat: "The lavender flower is so cute 💜 It smells like calm and love and everything good — basically it smells like you 🥺",
    bg: "linear-gradient(160deg, #ede9fe 0%, #c4b5fd 100%)",
  },
  {
    photo: "/assets/MyFlowers/hotpink.jpg",
    title: "my Hot Pink Blossom 🌺",
    line: "Lush, layered, and impossibly dreamy — like every happy dream I have of us, endlessly unfolding.",
    chat: "Oh WOW 🥵 this hot pink blossom is absolutely unhinged levels of beautiful. Just like you on a random Tuesday 😤💕",
    bg: "linear-gradient(160deg, #fce7f3 0%, #f9a8d4 100%)",
  },
  {
    photo: "/assets/MyFlowers/yellow.jpg",
    title: "my Sunflower 🌻",
    line: "Bright, warm, and always facing the light — because you are my sunshine, my warmth, my favourite person ever.",
    chat: "This sunflower turned to face me and said 'I learned how to shine by watching her' ☀️ I'm not crying YOU'RE crying 😭",
    bg: "linear-gradient(160deg, #fef9c3 0%, #fde68a 100%)",
  },
  {
    photo: "/assets/MyFlowers/hotyellow.jpg",
    title: "my Golden Bloom ✨",
    line: "Golden, glowing, and impossibly warm — like the feeling of you texting me first on a quiet afternoon 💛",
    chat: "This golden bloom is GLOWING ✨ like it got sunlight trapped inside it. This is exactly how I feel when you text me first 😭💛",
    bg: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)",
  },
  {
    photo: "/assets/MyFlowers/cyan.jpg",
    title: "my Hydrangea 💙",
    line: "Full, abundant, and a gorgeous shade of cyan — as refreshing as your laugh on a bad day. You always fix everything.",
    chat: "This hydrangea is giving 'effortlessly stunning' and 'doesn't even try' 💙 Very you coded honestly 😤",
    bg: "linear-gradient(160deg, #ecfeff 0%, #a5f3fc 100%)",
  },
  {
    photo: "/assets/MyFlowers/blue.jpg",
    title: "my Blue Beauty 💙",
    line: "Rare, cool, and quietly breathtaking — like the moments with you that I didn't expect but will never forget.",
    chat: "Wisteria literally drapes itself over everything like it owns the place 💙 Unbothered. Elegant. That's the vibe 😤🌸",
    bg: "linear-gradient(160deg, #faf5ff 0%, #bfdbfe 100%)",
  },
  {
    photo: "/assets/MyFlowers/red.jpg",
    title: "my Cherry Blossom 🌸",
    line: "Fleeting and beautiful — each moment with you feels this precious, this rare, this absolutely worth cherishing.",
    chat: "Cherry blossoms only bloom for a short time ⏳ and yet somehow every second with you feels like one long beautiful spring 🌸",
    bg: "linear-gradient(160deg, #fff1f2 0%, #fda4af 100%)",
  },
  {
    photo: "/assets/MyFlowers/redd.jpg",
    title: "my Crimson Bloom 🌹",
    line: "Rare, exotic, and one-of-a-kind — you're unlike anyone I've ever known and I thank the universe for that daily.",
    chat: "This crimson bloom walked in and said 'I only bloom for special people' 🌺 and then looked directly at you 👀",
    bg: "linear-gradient(160deg, #ffe4e6 0%, #fca5a5 100%)",
  },
  {
    photo: "/assets/MyFlowers/white.jpg",
    title: "my White Gardenia 🌿",
    line: "White, velvety, and secretly stunning — like the quiet ways you show your love that mean the absolute most.",
    chat: "The gardenia doesn't need to be loud to be the most beautiful in the room 🌿 Sounds like someone I know 😏💕",
    bg: "linear-gradient(160deg, #f0fdf4 0%, #d1fae5 100%)",
  },
  {
    photo: "/assets/MyFlowers/black.jpg",
    title: "my Dark Magnolia 🖤",
    line: "Timeless, grand, and unforgettable — like the first day I knew you were the one I wanted, always.",
    chat: "The magnolia arrived in all black and said 'I don't do ordinary' 🖤 same energy as you honestly 😌",
    bg: "linear-gradient(160deg, #fdf2f8 0%, #e5e7eb 100%)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERSTITIAL — shown after slide 7 (halfway through)
// ─────────────────────────────────────────────────────────────────────────────
const INTERSTITIAL_AFTER = 6; // shows after the 7th slide (0-indexed = 6)

// ─────────────────────────────────────────────────────────────────────────────
// FINAL INTERSTITIAL — shown after the LAST slide, before photobouquet
// ─────────────────────────────────────────────────────────────────────────────
const BOUQUET_REVEAL_FLOWERS = ["🌹", "🌸", "🌷", "🌺", "💐", "🌼", "🌻", "🪷", "🌹", "🌸", "🌺", "💐"];

function FlowerSlideshow() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(""); // "next" | "prev"
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showFinalReveal, setShowFinalReveal] = useState(false);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const isInterstitialTrigger =
    index === INTERSTITIAL_AFTER && !showInterstitial && SLIDES.length > INTERSTITIAL_AFTER + 1;

  const goNext = () => {
    if (isInterstitialTrigger) {
      setAnimDir("next");
      setTimeout(() => { setShowInterstitial(true); setAnimDir(""); }, 320);
      return;
    }
    // Last slide → show final bouquet reveal
    if (index === SLIDES.length - 1) {
      setAnimDir("next");
      setTimeout(() => { setShowFinalReveal(true); setAnimDir(""); }, 320);
      return;
    }
    setAnimDir("next");
    setTimeout(() => { setIndex((i) => i + 1); setAnimDir(""); }, 320);
  };

  const goPrev = () => {
    if (showFinalReveal) {
      setAnimDir("prev");
      setTimeout(() => { setShowFinalReveal(false); setAnimDir(""); }, 320);
      return;
    }
    if (showInterstitial) {
      setAnimDir("prev");
      setTimeout(() => { setShowInterstitial(false); setAnimDir(""); }, 320);
      return;
    }
    setAnimDir("prev");
    setTimeout(() => { setIndex((i) => i - 1); setAnimDir(""); }, 320);
  };

  const continueAfterInterstitial = () => {
    setAnimDir("next");
    setTimeout(() => {
      setShowInterstitial(false);
      setIndex(INTERSTITIAL_AFTER + 1);
      setAnimDir("");
    }, 320);
  };

  // ── Final Bouquet Reveal ──
  if (showFinalReveal) {
    return (
      <div
        className={`page fs-page ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}
        style={{
          background: "linear-gradient(145deg, #1a0010 0%, #3d0020 30%, #6b0030 60%, #a0004a 80%, #c8005a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated floating flower emojis */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {BOUQUET_REVEAL_FLOWERS.map((f, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${5 + (i * 8) % 90}%`,
                top: `-${20 + (i * 13) % 30}px`,
                fontSize: `${1.2 + (i % 4) * 0.5}rem`,
                animation: `floatDown ${3 + (i % 4)}s ease-in ${(i * 0.4) % 3}s infinite`,
                opacity: 0.7,
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes floatDown {
            0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
            15%  { opacity: 0.75; }
            85%  { opacity: 0.6; }
            100% { transform: translateY(110vh) rotate(25deg); opacity: 0; }
          }
          @keyframes revealGlow {
            0%, 100% { text-shadow: 0 0 20px rgba(255,180,200,0.6), 0 0 40px rgba(200,100,150,0.4); }
            50% { text-shadow: 0 0 40px rgba(255,200,220,0.9), 0 0 80px rgba(220,80,120,0.6), 0 0 120px rgba(180,40,80,0.3); }
          }
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        <div
          className={`fs-card ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,180,200,0.25)",
            boxShadow: "0 0 60px rgba(200,80,120,0.4), inset 0 0 40px rgba(255,120,160,0.08)",
          }}
        >
          {/* Big bouquet icon */}
          <div
            style={{
              fontSize: "4.5rem",
              animation: "pulseScale 2.5s ease-in-out infinite",
              marginBottom: 8,
              filter: "drop-shadow(0 0 20px rgba(255,150,180,0.8))",
            }}
          >
            💐
          </div>

          {/* Decorative divider */}
          <div style={{
            fontSize: "0.8rem",
            letterSpacing: "0.4em",
            color: "rgba(255,200,220,0.6)",
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
          }}>
            ✦ ✦ ✦
          </div>

          {/* Main headline */}
          <h2
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#fff",
              margin: "0 0 10px",
              lineHeight: 1.25,
              animation: "revealGlow 3s ease-in-out infinite",
              background: "linear-gradient(90deg, #ffb3c6, #ff6b8a, #fff5f7, #ffb3c6, #ff6b8a)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
            }}
          >
            The most beautiful bouquet
          </h2>
          <h2
            style={{
              fontSize: "clamp(1.2rem, 4vw, 1.9rem)",
              fontWeight: 600,
              color: "rgba(255,220,230,0.95)",
              margin: "0 0 18px",
              lineHeight: 1.3,
              fontStyle: "italic",
              textShadow: "0 2px 12px rgba(200,50,100,0.5)",
            }}
          >
            of the Most Beautiful Flowers 🌹
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,190,210,0.85)",
              fontStyle: "italic",
              lineHeight: 1.7,
              margin: "0 0 26px",
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            Every single bloom you just saw — gathered into one luxurious, living bouquet, made just for you. 🌸✨
          </p>

          {/* CTA button */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <button
              id="final-bouquet-btn"
              className="fs-btn fs-btn--next"
              style={{
                background: "linear-gradient(135deg, #c9184a, #ff4d6d, #ff85a1)",
                boxShadow: "0 8px 30px rgba(201,24,74,0.55), 0 0 20px rgba(255,77,109,0.3)",
                fontSize: "1.05rem",
                padding: "16px 28px",
                border: "1px solid rgba(255,180,200,0.3)",
                animation: "pulseScale 2.8s ease-in-out infinite",
              }}
              onClick={() => navigate("/photobouquet")}
            >
              Open the Bouquet 💐
            </button>
            <button
              className="fs-btn fs-btn--back"
              style={{ fontSize: "0.82rem", color: "rgba(255,190,210,0.7)", borderColor: "rgba(255,190,210,0.25)" }}
              onClick={goPrev}
            >
              ← back to flowers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Interstitial ──
  if (showInterstitial) {
    return (
      <div
        className={`page fs-page ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}
        style={{ background: "linear-gradient(160deg, #ffe4ec 0%, #ffc2d4 100%)" }}
      >
        <FloatingHearts count={18} />
        <div className={`fs-card fs-interstitial ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}>
          <div className="fs-interstitial-icon" aria-hidden="true">💐✨💐</div>
          <h2 className="fs-title" style={{ fontSize: "1.9rem" }}>
            wait, wait, wait... 🥺
          </h2>
          <p className="fs-line">
            let me show you the most beautiful bouquet<br />
            <strong style={{ fontStyle: "normal", color: "#c9184a" }}>
              that only <em>I</em> have
            </strong> 🌸
          </p>
          <div className="fs-nav" style={{ flexDirection: "column", gap: 10 }}>
            <button
              id="interstitial-yes-btn"
              className="fs-btn fs-btn--next"
              onClick={() => navigate("/bouquet/special")}
            >
              Yes, show me! 🌹
            </button>
            <button className="fs-btn fs-btn--back" onClick={continueAfterInterstitial}>
              continue flowers →
            </button>
          </div>
          <button
            className="fs-btn fs-btn--back"
            style={{ marginTop: 2, fontSize: "0.82rem", padding: "7px 18px" }}
            onClick={goPrev}
          >
            ← back
          </button>
        </div>
      </div>
    );
  }

  // ── Normal flower slide ──
  return (
    <div className="page fs-page" style={{ background: slide.bg }}>
      <FloatingHearts count={12} />

      <div className={`fs-card ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}>

        {/* progress dots */}
        <div className="fs-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={`fs-dot${i === index ? " fs-dot--on" : ""}`} />
          ))}
        </div>

        {/* photo */}
        <div className="fs-img-wrap">
          <img src={slide.photo} alt={slide.title} className="fs-img" />
        </div>

        {/* spicy chat bubble */}
        <div style={{
          width: "100%",
          padding: "10px 16px",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: 18,
          borderTopLeftRadius: 4,
          fontSize: "0.87rem",
          color: "#6b2157",
          fontStyle: "italic",
          lineHeight: 1.55,
          boxShadow: "0 2px 12px rgba(180,80,120,0.12)",
          textAlign: "left",
          boxSizing: "border-box",
        }}>
          <span style={{
            fontSize: "0.75rem", fontStyle: "normal", fontWeight: 700,
            color: "#c9184a", display: "block", marginBottom: 3,
          }}>
            💬 him
          </span>
          {slide.chat}
        </div>

        {/* title + romantic line */}
        <h2 className="fs-title">{slide.title}</h2>
        <p className="fs-line">{slide.line}</p>

        {/* nav */}
        <div className="fs-nav">
          {index > 0 && (
            <button className="fs-btn fs-btn--back" onClick={goPrev}>
              ← back
            </button>
          )}
          {!isLast || isInterstitialTrigger ? (
            <button className="fs-btn fs-btn--next" onClick={goNext}>
              next →
            </button>
          ) : (
            <button className="fs-btn fs-btn--next" onClick={goNext}>
              see the bouquet 💐
            </button>
          )}
        </div>

        {/* slide counter */}
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#a4133c", opacity: 0.7 }}>
          {index + 1} of {SLIDES.length}
        </p>

      </div>
    </div>
  );
}

export default FlowerSlideshow;
