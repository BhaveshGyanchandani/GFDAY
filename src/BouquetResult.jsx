import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import FLOWERS from "./flowers";
import Modal from "./Modal";

// This generates a real, one-of-a-kind bouquet photo from her chosen flowers
// using Pollinations.ai's free image API — no signup, no API key, no backend.
// Docs: https://github.com/pollinations/pollinations/blob/main/APIDOCS.md
//
// The anonymous tier is rate-limited to ~1 request every 15s, so this
// component auto-retries with backoff on a failed load, and puts a short
// cooldown on the manual "regenerate" button so it can't outrun the limit.
//
// Optional upgrade: register a free token at https://auth.pollinations.ai
// to remove the watermark and raise the rate limit — not required.

const MAX_AUTO_RETRIES = 3;
const REGENERATE_COOLDOWN = 16; // seconds — just above the 15s anonymous limit

const buildBouquetPrompt = (flowers) => {
  const names = flowers.map((f) => f.label.toLowerCase());
  const flowerList =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

  return (
  `Create an ultra-luxury oversized bouquet containing ${flowerList}. ` +
  `The bouquet must be the absolute centerpiece of the image, occupying approximately 80% of the frame, handcrafted by a world-renowned luxury florist. ` +
  `It should be extraordinarily massive, breathtaking, museum-quality, and among the largest florist bouquets ever created, featuring hundreds of impeccably fresh blooms arranged in an elegant cascading composition. ` +
  `The arrangement should be incredibly full, lush, dense, and naturally organic, extending dramatically in width and height with luxurious layered depth while maintaining flawless balance and symmetry. ` +
  `Every flower listed in ${flowerList} should appear in abundance, preserving its authentic botanical shape, color, texture, and natural proportions, transitioning gracefully from bold statement blooms to delicate airy accents. ` +
  `Weave through the bouquet luxurious silver-dollar eucalyptus, flowing Italian ruscus, baby's breath, fragrant wax flowers, soft tree ferns, premium seasonal greenery, and elegant cascading foliage to create movement, richness, and exceptional dimension without overpowering the featured flowers. ` +
  `The bouquet should appear impossibly expensive, professionally designed, and worthy of a luxury florist's flagship display, with no empty spaces, every angle overflowing with premium blooms and lush foliage. ` +
  `Wrap the bouquet using multiple layers of premium Korean florist wrapping paper with sophisticated architectural folds, combining matte blush pink, creamy ivory, champagne, nude, and soft beige tones with impeccable craftsmanship and luxurious texture. ` +
  `Tie the bouquet with extra-long double-faced dusty rose satin ribbons that flow elegantly over the edge of a polished white Carrara marble table, enhancing the premium presentation. ` +
  `The bouquet should be photographed inside an elegant luxury florist studio with warm golden morning sunlight streaming diagonally through large arched windows, producing cinematic volumetric lighting, soft translucent shadows, and natural highlights that emphasize every petal and leaf. ` +
  `The background should remain softly blurred with creamy bokeh, fairy lights, premium floral displays, and lush greenery so the bouquet remains the unmistakable focal point. ` +
  `Capture microscopic botanical realism with individually detailed petals, realistic pollen, translucent edges, delicate veins, natural color gradients, tiny dew droplets, lifelike stems, and highly detailed foliage. ` +
  `Luxury editorial florist catalog photography, Hasselblad X2D medium format camera, 80mm lens, f/2, shallow depth of field, HDR, global illumination, ray-traced lighting, physically accurate materials, masterpiece, hyper-realistic, ultra-detailed, 8K, award-winning floral still life, impossible to distinguish from a real professional photograph.`
);
};

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

function BouquetResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedIds = location.state?.selected || [];
  const selectedFlowers = FLOWERS.filter((f) => selectedIds.includes(f.id));

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"
  const [attempt, setAttempt] = useState(0); // bumps to force the <img> to refetch
  const [cooldown, setCooldown] = useState(0); // seconds left before you can regenerate again
  const [showPeekModal, setShowPeekModal] = useState(false);

  const prompt = useMemo(() => buildBouquetPrompt(selectedFlowers), [selectedFlowers]);
  const imageUrl = useMemo(() => buildImageUrl(prompt, seed), [prompt, seed]);

  // Reset the retry ladder whenever we start generating a genuinely new image.
  useEffect(() => {
    setStatus("loading");
    setAttempt(0);
  }, [imageUrl]);

  // Countdown timer for the regenerate cooldown.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleImageError = () => {
    if (attempt < MAX_AUTO_RETRIES) {
      setStatus("loading");
      // Backs off past the rate-limit window: ~5s, 10s, 15s.
      const delay = 5000 * (attempt + 1);
      setTimeout(() => setAttempt((a) => a + 1), delay);
    } else {
      setStatus("error");
    }
  };

  const regenerate = () => {
    if (cooldown > 0) return;
    setSeed(Math.floor(Math.random() * 1_000_000));
    setCooldown(REGENERATE_COOLDOWN);
  };

  if (selectedFlowers.length === 0) {
    return (
      <div className="page bouquet-page">
        <FloatingHearts count={10} />
        <div className="card bouquet-card">
          <h2 className="card-title bouquet-title">no flowers picked yet 🌱</h2>
          <p className="bouquet-hint">go back and choose a few first</p>
          <Link className="choice-btn yes-btn next-btn" to="/bouquet">
            ← pick flowers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page bouquet-page">
      <FloatingHearts count={16} />

      <style>{`
        @keyframes bouquetPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.65; }
        }
        .bouquet-loading-emoji {
          display: inline-block;
          animation: bouquetPulse 1.6s ease-in-out infinite;
        }
        .bouquet-visual img {
          animation: bouquetFadeIn 0.5s ease-out;
        }
        @keyframes bouquetFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="card bouquet-card">
        <h2 className="card-title bouquet-title">your dream bouquet 💐</h2>

        <div
          className="bouquet-visual"
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
              key={attempt}
              src={imageUrl}
              alt={`A bouquet of ${selectedFlowers.map((f) => f.label).join(", ")}`}
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
              <span className="bouquet-loading-emoji" style={{ fontSize: 40 }}>
                🌸
              </span>
              <p className="bouquet-hint" style={{ margin: 0 }}>
                {attempt === 0
                  ? "blooming your bouquet..."
                  : "still blooming — the florist's a little backed up..."}
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
                the bouquet wilted on the way over — try again?
              </p>
              <button
                className="choice-btn yes-btn"
                onClick={regenerate}
                disabled={cooldown > 0}
                type="button"
              >
                {cooldown > 0 ? `wait ${cooldown}s...` : "↻ try again"}
              </button>
            </div>
          )}
        </div>

        {status === "loaded" && (
          <button
            className="choice-btn no-btn"
            onClick={regenerate}
            disabled={cooldown > 0}
            type="button"
            style={{ marginTop: 12, opacity: cooldown > 0 ? 0.6 : 1 }}
          >
            {cooldown > 0 ? `next bouquet in ${cooldown}s...` : "✨ generate another version"}
          </button>
        )}

        <p className="bouquet-caption">
          made just for you, with {selectedFlowers.map((f) => f.label).join(", ")}
        </p>

        {/* ── Go ahead take a look button ── */}
        {status === "loaded" && (
          <button
            id="bouquet-peek-btn"
            className="choice-btn yes-btn"
            style={{ marginBottom: 4, width: "100%" }}
            onClick={() => setShowPeekModal(true)}
            type="button"
          >
            go ahead, take a look 👀💐
          </button>
        )}


        <div className="choice-row" style={{ marginTop: 4 }}>
          <Link className="choice-btn no-btn" to="/bouquet">
            ↻ rebuild
          </Link>
          <Link className="choice-btn yes-btn" to="/">
            back to start
          </Link>
        </div>

        {/* ── Peek modal ── */}
        <Modal isOpen={showPeekModal} onClose={() => setShowPeekModal(false)}>
          <div className="modal-hearts" aria-hidden="true">💐 🌸 💐</div>
          <h3 className="modal-title">oh wait... 🥺</h3>
          <p className="modal-msg">
            You just created the most beautiful bouquet!<br />
            Wanna see <em>each flower</em> I picked just for you? 💕
          </p>
          <div className="modal-btn-row">
            <button
              id="peek-yes-btn"
              className="choice-btn yes-btn"
              onClick={() => navigate("/bouquet/slideshow", { state: { selected: selectedIds } })}
            >
              Yes, show me! 🌹
            </button>
            <button
              className="choice-btn no-btn"
              onClick={() => setShowPeekModal(false)}
            >
              maybe later 😊
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default BouquetResult;