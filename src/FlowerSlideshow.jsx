import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import FLOWERS from "./flowers";

// Per-flower romantic copy + photo path
const FLOWER_DATA = {
  "tulip": {
    photo: "/assets/flower_tulip.png",
    title: "my Pink Tulip 🌷",
    line: "Classic, timeless, and full of colour — just like every moment with you.",
    bg: "linear-gradient(160deg, #ffe4ec 0%, #ffd1dc 100%)",
  },
  "white-lily": {
    photo: "/assets/flower_white_lily.png",
    title: "my White Lily 🤍",
    line: "Pure, graceful, and impossibly elegant — exactly how you make me feel.",
    bg: "linear-gradient(160deg, #f0e6ff 0%, #e9d5ff 100%)",
  },
  "red-rose": {
    photo: "/assets/flower_red_rose.png",
    title: "my Beautiful Rose 🌹",
    line: "Deep red, velvety, and endlessly romantic — this one's for you, always.",
    bg: "linear-gradient(160deg, #ffe4e6 0%, #fecdd3 100%)",
  },
  "pink-rose": {
    photo: "/assets/flower_pink_rose.png",
    title: "my Pink Rose 🌸",
    line: "Soft, sweet, and full of warmth — just like your smile that melts me every time.",
    bg: "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)",
  },
  "peony": {
    photo: "/assets/flower_peony.png",
    title: "my Peony 🌺",
    line: "Lush, layered, and impossibly dreamy — like every happy dream I have of us.",
    bg: "linear-gradient(160deg, #fce7f3 0%, #f9a8d4 100%)",
  },
  "orchid": {
    photo: "/assets/flower_orchid.png",
    title: "my Orchid 🪷",
    line: "Rare, exotic, and one-of-a-kind — you're unlike anyone I've ever known.",
    bg: "linear-gradient(160deg, #ede9fe 0%, #ddd6fe 100%)",
  },
  "lavender": {
    photo: "/assets/flower_lavender.png",
    title: "my Lavender 💜",
    line: "Calm, sweet, and beautifully serene — like the peace I feel when I'm with you.",
    bg: "linear-gradient(160deg, #ede9fe 0%, #c4b5fd 100%)",
  },
  "sunflower": {
    photo: "/assets/flower_sunflower.png",
    title: "my Sunflower 🌻",
    line: "Bright, warm, and always facing the light — because you are my sunshine, Nuu.",
    bg: "linear-gradient(160deg, #fef9c3 0%, #fde68a 100%)",
  },
  "daisy": {
    photo: "/assets/flower_daisy.png",
    title: "my Daisy 🌼",
    line: "Simple, cheerful, and full of gentle joy — a little happiness just like you bring me.",
    bg: "linear-gradient(160deg, #fefce8 0%, #fef08a 100%)",
  },
  "babys-breath": {
    photo: null,
    emoji: "☁️",
    title: "my Baby's Breath ☁️",
    line: "Tiny, airy, and perfect — the little things you do that mean everything to me.",
    bg: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 100%)",
  },
  "magnolia": {
    photo: "/assets/flower_magnolia.png",
    title: "my Magnolia 🌳",
    line: "Timeless, grand, and unforgettable — like the first day I knew you were the one.",
    bg: "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 100%)",
  },
  "cherry-blossom": {
    photo: "/assets/flower_cherry_blossom.png",
    title: "my Cherry Blossom 🌸",
    line: "Fleeting and beautiful — each moment with you feels this precious and rare.",
    bg: "linear-gradient(160deg, #fff1f2 0%, #fda4af 100%)",
  },
  "hydrangea": {
    photo: "/assets/flower_hydrangea.png",
    title: "my Hydrangea 💙",
    line: "Full, abundant, and a gorgeous shade of cyan — as refreshing as your laugh.",
    bg: "linear-gradient(160deg, #ecfeff 0%, #a5f3fc 100%)",
  },
  "gardenia": {
    photo: null,
    emoji: "🌿",
    title: "my Gardenia 🌿",
    line: "White, velvety, and secretly stunning — like the quiet ways you show your love.",
    bg: "linear-gradient(160deg, #f0fdf4 0%, #d1fae5 100%)",
  },
  "wisteria": {
    photo: null,
    emoji: "🍇",
    title: "my Wisteria 🍇",
    line: "Cascading in deep violet, tender and longing — I always want more time with you.",
    bg: "linear-gradient(160deg, #faf5ff 0%, #ddd6fe 100%)",
  },
  "jasmine": {
    photo: "/assets/flower_jasmine.png",
    title: "my Jasmine ✨",
    line: "Tiny, white, and the sweetest fragrance in the world — just like you, my love.",
    bg: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)",
  },
};

// The interstitial appears AFTER this many flower slides (0-based: after index 3 = 4th slide)
const INTERSTITIAL_AFTER = 3;

function FlowerSlideshow() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIds = location.state?.selected || [];
  const flowers = FLOWERS.filter((f) => selectedIds.includes(f.id));

  // showInterstitial = true means we're showing the "secret bouquet" teaser
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(""); // "next" | "prev"
  const [showInterstitial, setShowInterstitial] = useState(false);

  if (flowers.length === 0) {
    return (
      <div className="page bouquet-page">
        <FloatingHearts count={10} />
        <div className="card bouquet-card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "2rem" }}>🌱</p>
          <p className="bouquet-hint">no flowers to show — go build a bouquet first!</p>
          <button className="choice-btn yes-btn" onClick={() => navigate("/bouquet")}>
            ← pick flowers
          </button>
        </div>
      </div>
    );
  }

  const flower = flowers[index];
  const data = FLOWER_DATA[flower.id] || {
    photo: null,
    emoji: flower.emoji,
    title: `my ${flower.label} ${flower.emoji}`,
    line: flower.desc,
    bg: "linear-gradient(160deg, #ffe4ec 0%, #ffd1dc 100%)",
  };
  const isLast = index === flowers.length - 1;

  // Should we show interstitial on "next" from this slide?
  // Yes if: this is the 4th slide (index 3), interstitial hasn't been shown yet,
  // and there are more flowers after it.
  const isInterstitialTrigger =
    index === INTERSTITIAL_AFTER &&
    !showInterstitial &&
    flowers.length > INTERSTITIAL_AFTER + 1;

  const goNext = () => {
    // After 4th slide → show interstitial instead of going to slide 5
    if (isInterstitialTrigger) {
      setAnimDir("next");
      setTimeout(() => { setShowInterstitial(true); setAnimDir(""); }, 320);
      return;
    }
    setAnimDir("next");
    setTimeout(() => { setIndex((i) => i + 1); setAnimDir(""); }, 320);
  };

  const goPrev = () => {
    // If we're showing interstitial, "back" goes back to slide 4
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

  // ── Interstitial screen ──
  if (showInterstitial) {
    return (
      <div
        className={`page fs-page ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}
        style={{ background: "linear-gradient(160deg, #ffe4ec 0%, #ffc2d4 100%)" }}
      >
        <FloatingHearts count={18} />

        <div className={`fs-card fs-interstitial ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}>
          {/* big emoji */}
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
            <button
              className="fs-btn fs-btn--back"
              onClick={continueAfterInterstitial}
            >
              continue flowers →
            </button>
          </div>

          {/* back arrow */}
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
    <div className="page fs-page" style={{ background: data.bg }}>
      <FloatingHearts count={12} />

      <div className={`fs-card ${animDir === "next" ? "fs-slide-next" : animDir === "prev" ? "fs-slide-prev" : ""}`}>
        {/* progress dots — no numbers */}
        <div className="fs-dots">
          {flowers.map((_, i) => (
            <span key={i} className={`fs-dot${i === index ? " fs-dot--on" : ""}`} />
          ))}
        </div>

        {/* photo or emoji */}
        <div className="fs-img-wrap">
          {data.photo ? (
            <img src={data.photo} alt={flower.label} className="fs-img" />
          ) : (
            <div className="fs-emoji-box">
              <span className="fs-big-emoji">{data.emoji || flower.emoji}</span>
            </div>
          )}
        </div>

        {/* text — NO counter line */}
        <h2 className="fs-title">{data.title}</h2>
        <p className="fs-line">{data.line}</p>

        {/* nav buttons */}
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
            <button
              className="fs-btn fs-btn--next"
              onClick={() => navigate("/")}
            >
              back to start 💌
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlowerSlideshow;
