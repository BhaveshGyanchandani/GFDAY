import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import FLOWERS from "./flowers";

// Walks through the flowers she picked one at a time — a close-up photo of
// each, generated via Pollinations.ai (same free, no-key API used in
// BouquetResult), plus a little caption underneath. "next" advances to the
// next flower; the last page loops back to the start.

const MAX_AUTO_RETRIES = 3;

// Deterministic per-flower seed so a given flower always renders the same
// photo, instead of a new random one every time you land on its page.
const seedFromId = (id) => {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % 1_000_000;
};

const buildFlowerPrompt = (flower) =>
  `A single perfect ${flower.label.toLowerCase()}, extreme close-up macro photography, ` +
  `dew drops on velvety petals, delicate veins, natural color gradients, soft creamy bokeh background, ` +
  `warm golden natural light, shallow depth of field, Hasselblad medium format camera, 8K, hyper-realistic, ` +
  `botanical editorial photography, masterpiece.`;

const buildImageUrl = (prompt, seed) => {
  const params = new URLSearchParams({
    width: "1024",
    height: "1280",
    model: "flux",
    seed: String(seed),
    nologo: "true",
    enhance: "true",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?${params.toString()}`;
};

function BouquetReveal() {
  const location = useLocation();
  const selectedIds = location.state?.selected || [];
  const selectedFlowers = FLOWERS.filter((f) => selectedIds.includes(f.id));

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"
  const [attempt, setAttempt] = useState(0);

  const flower = selectedFlowers[index];
  const prompt = useMemo(() => (flower ? buildFlowerPrompt(flower) : ""), [flower]);
  const seed = useMemo(() => (flower ? seedFromId(flower.id) : 0), [flower]);
  const imageUrl = useMemo(
    () => (flower ? buildImageUrl(prompt, seed) : ""),
    [prompt, seed, flower]
  );

  // Reset the retry ladder whenever we move to a new flower.
  useEffect(() => {
    setStatus("loading");
    setAttempt(0);
  }, [imageUrl]);

  const handleImageError = () => {
    if (attempt < MAX_AUTO_RETRIES) {
      // Backs off past the anonymous-tier rate limit: ~5s, 10s, 15s.
      const delay = 5000 * (attempt + 1);
      setTimeout(() => setAttempt((a) => a + 1), delay);
    } else {
      setStatus("error");
    }
  };

  const retryNow = () => {
    setStatus("loading");
    setAttempt(0);
  };

  const goNext = () => {
    setIndex((i) => Math.min(i + 1, selectedFlowers.length - 1));
  };

  if (selectedFlowers.length === 0) {
    return (
      <div className="page bouquet-page">
        <FloatingHearts count={10} />
        <div className="card bouquet-card">
          <h2 className="card-title bouquet-title">no flowers to show yet 🌱</h2>
          <p className="bouquet-hint">go back and build your bouquet first</p>
          <Link className="choice-btn yes-btn next-btn" to="/bouquet">
            ← pick flowers
          </Link>
        </div>
      </div>
    );
  }

  const isLast = index === selectedFlowers.length - 1;

  return (
    <div className="page bouquet-page">
      <FloatingHearts count={16} />

      <style>{`
        @keyframes revealPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.65; }
        }
        .reveal-loading-emoji {
          display: inline-block;
          animation: revealPulse 1.6s ease-in-out infinite;
        }
        .reveal-visual img {
          animation: revealFadeIn 0.5s ease-out;
        }
        @keyframes revealFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .reveal-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin: 10px 0 4px;
        }
        .reveal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.15);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .reveal-dot.active {
          background: #e08bab;
          transform: scale(1.3);
        }
      `}</style>

      <div className="card bouquet-card">
        <h2 className="card-title bouquet-title">my beautiful bouquet 💐</h2>

        <div
          className="reveal-visual"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            aspectRatio: "4 / 5",
            margin: "0 auto",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            background: "linear-gradient(135deg, #fbe9ec, #f6f1e7)",
          }}
        >
          {status !== "error" && (
            <img
              key={`${flower.id}-${attempt}`}
              src={imageUrl}
              alt={flower.label}
              onLoad={() => setStatus("loaded")}
              onError={handleImageError}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: status === "loaded" ? "block" : "none",
              }}
            />
          )}

          {status === "loading" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <span className="reveal-loading-emoji" style={{ fontSize: 40 }}>
                🌸
              </span>
              <p className="bouquet-hint" style={{ margin: 0 }}>
                {attempt === 0
                  ? `blooming your ${flower.label.toLowerCase()}...`
                  : "still blooming — hang tight..."}
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 16,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 40 }}>🥀</span>
              <p className="bouquet-hint" style={{ margin: 0 }}>
                this one wilted a little — try again?
              </p>
              <button className="choice-btn yes-btn" onClick={retryNow} type="button">
                ↻ try again
              </button>
            </div>
          )}
        </div>

        <div className="reveal-dots">
          {selectedFlowers.map((f, i) => (
            <span key={f.id} className={`reveal-dot${i === index ? " active" : ""}`} />
          ))}
        </div>

        <p className="bouquet-caption">that's my beautiful {flower.label.toLowerCase()} 🌷</p>

        <div className="choice-row">
          {isLast ? (
            <Link className="choice-btn yes-btn next-btn" to="/">
              back to start 💕
            </Link>
          ) : (
            <button className="choice-btn yes-btn next-btn" onClick={goNext} type="button">
              next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BouquetReveal;
