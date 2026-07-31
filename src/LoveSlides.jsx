import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import GifFrame from "./GifFrame";
import CircularQueue from "./circularQueue";
import LOVE_SLIDES from "./loveSlidesData";

function LoveSlides() {
  const queue = useMemo(() => new CircularQueue(LOVE_SLIDES), []);
  const [pointer, setPointer]           = useState(0);
  const [direction, setDirection]       = useState("next");
  const [noPopup, setNoPopup]           = useState(null);
  const [finaleResult, setFinaleResult] = useState(null); // null | "yes" | "no"
  const [showUsPage, setShowUsPage]     = useState(false);

  const slide   = queue.get(pointer);
  const isFirst = pointer === 0;
  const isLast  = pointer === queue.size - 1;

  const goNext = () => {
    setDirection("next");
    setPointer((p) => queue.next(p));
  };

  const goPrev = () => {
    if (isFirst) return;
    setDirection("prev");
    setPointer((p) => queue.prev(p));
  };

  // auto-advance slides flagged with autoAdvance
  useEffect(() => {
    if (slide.type === "text" && slide.autoAdvance) {
      const timer = setTimeout(() => goNext(), slide.autoAdvance);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer]);

  // "No" popup self-dismisses after 3 s then continues forward
  useEffect(() => {
    if (noPopup) {
      const timer = setTimeout(() => {
        setNoPopup(null);
        goNext();
      }, 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noPopup]);

  // ── US PAGE — shown after YES celebration ─────────────────────────────────
  if (showUsPage) {
    return (
      <div className="page love-page" style={{
        background: "linear-gradient(160deg, #1a0010 0%, #3d0020 40%, #6b0030 75%, #a0004a 100%)",
        minHeight: "100vh",
      }}>
        <FloatingHearts count={22} />
        <style>{`
          @keyframes usGlow {
            0%,100% { text-shadow: 0 0 18px rgba(255,160,190,0.5), 0 0 40px rgba(200,80,120,0.3); }
            50%      { text-shadow: 0 0 32px rgba(255,190,210,0.9), 0 0 70px rgba(220,80,130,0.5); }
          }
          @keyframes usFloat {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-8px); }
          }
          @keyframes shimmerText {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
        `}</style>

        <div className="card love-card finale-result-card" style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,160,190,0.25)",
          boxShadow: "0 0 60px rgba(200,60,100,0.35), inset 0 0 30px rgba(255,100,140,0.06)",
          gap: 0,
        }}>

          {/* floating emoji row */}
          <div style={{ fontSize: "1.6rem", marginBottom: 10, animation: "usFloat 3s ease-in-out infinite", letterSpacing: 6 }}
               aria-hidden="true">
            💗 🌹 💗
          </div>

          {/* us image */}
          <div style={{
            width: "100%",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,160,190,0.3)",
            marginBottom: 20,
            animation: "usFloat 4s ease-in-out infinite",
          }}>
            <img
              src="/assets/Nuu/us.png"
              alt="Us 💗"
              onError={e => { e.target.style.display = "none"; }}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* shimmer heading */}
          <h2 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            margin: "0 0 10px",
            background: "linear-gradient(90deg, #ffb3c6, #ff6b8a, #fff5f7, #ffb3c6, #ff6b8a)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmerText 3s linear infinite",
          }}>
            Us. Always. 💗
          </h2>

          {/* romantic poem */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            lineHeight: 1.85,
            color: "rgba(255,210,225,0.92)",
            margin: "0 0 22px",
            textAlign: "center",
            animation: "usGlow 4s ease-in-out infinite",
          }}>
            Not just a moment — a lifetime. 🌹<br />
            Not just a word — a promise. 💍<br />
            Not just two people —<br />
            <span style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "1.4em",
              color: "#ffb3c6",
            }}>
              us.
            </span>
          </p>

          <Link className="love-nav-btn primary" to="/" style={{
            background: "linear-gradient(135deg, #c9184a, #ff4d6d)",
            boxShadow: "0 8px 28px rgba(201,24,74,0.5)",
            border: "1px solid rgba(255,160,190,0.3)",
          }}>
            🏠 go back to front page
          </Link>
        </div>
      </div>
    );
  }

  // ── FINALE YES screen ──────────────────────────────────────────────────────
  if (finaleResult === "yes") {
    return (
      <div className="page love-page">
        <FloatingHearts count={28} />
        <div className="card love-card finale-result-card">
          <div className="modal-hearts" aria-hidden="true">💋 💕 💋</div>
          <GifFrame src="/assets/Nuu/odette_and_lancelot.jpg" alt="yes!" maxWidth="280px" ratio="1/1" />
          <h2 className="card-title" style={{ marginTop: "10px" }}>YESSSSS!! 🎉</h2>
          <p className="love-text">
            Muwaaaah!! 😘💋 Muwaaaaaaaaaah!!<br />
            You just made me the happiest person alive!!<br />
            I am your Lancelot, and you are my Odette, forever 💗
          </p>
          <button className="love-nav-btn primary" onClick={() => setShowUsPage(true)}>
            See us together 💗
          </button>
        </div>
      </div>
    );
  }

  // ── FINALE NO screen ───────────────────────────────────────────────────────
  if (finaleResult === "no") {
    return (
      <div className="page love-page">
        <FloatingHearts count={10} />
        <div className="card love-card finale-result-card">
          <div className="modal-hearts" aria-hidden="true">💔 😢 💔</div>
          <GifFrame src="/assets/Nuu/sad.jpg" alt="sad" maxWidth="280px" ratio="1/1" />
          <h2 className="card-title" style={{ marginTop: "10px" }}>Noooo... 🥺</h2>
          <p className="love-text">
            My heart just broke a little... 😢<br />
            I'll still be here, still loving you, still your biggest fan.<br />
            Whenever you're ready, I'll be waiting 💗
          </p>
          <Link className="love-nav-btn primary" to="/">
            🏠 go back to front page
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN SLIDES ────────────────────────────────────────────────────────────
  return (
    <div className="page love-page">
      <FloatingHearts count={16} />

      <div className="card love-card">
        <div key={pointer} className={`love-slide slide-${direction}`}>
          <GifFrame src={slide.image} alt="" noImageMsg={slide.noImageMsg} />

          {slide.type === "finale" && slide.eyebrow && (
            <p className="eyebrow love-eyebrow">{slide.eyebrow}</p>
          )}

          {slide.paragraphs ? (
            <div className="love-paragraphs">
              {slide.paragraphs.map((line, i) =>
                line ? <p key={i}>{line}</p> : <br key={i} />
              )}
            </div>
          ) : (
            <p className="love-text">{slide.text}</p>
          )}
        </div>

        {/* ── nav / buttons ── */}
        {slide.type === "decision" ? (
          <div className="choice-row">
            <button className="choice-btn yes-btn" onClick={goNext}>
              {slide.yesLabel}
            </button>
            <button
              className="choice-btn no-btn"
              onClick={() => setNoPopup(slide.noPopup)}
            >
              {slide.noLabel}
            </button>
          </div>

        ) : slide.type === "finale" ? (
          /* ── finale slide: Yes / No asking the big question ── */
          <>
            <div className="choice-row">
              <button
                id="finale-yes-btn"
                className="choice-btn yes-btn"
                onClick={() => setFinaleResult("yes")}
              >
                Yes, always 💗
              </button>
              <button
                id="finale-no-btn"
                className="choice-btn no-btn"
                onClick={() => setFinaleResult("no")}
              >
                No... 😔
              </button>
            </div>
            <button className="love-nav-btn back-only" onClick={goPrev}>
              ← Back
            </button>
          </>

        ) : (
          /* ── normal slides: Back / Next ── */
          <div className="love-nav">
            <button className="love-nav-btn" onClick={goPrev} disabled={isFirst}>
              ← Back
            </button>
            <button className="love-nav-btn primary" onClick={goNext}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── "Bleeeeh" no-popup ── */}
      {noPopup && (
        <div className="guess-popup-backdrop">
          <div className="guess-popup">
            <span className="popup-heart popup-heart-left">💗</span>
            <span className="popup-heart popup-heart-right">💗</span>
            <GifFrame src={noPopup.image} alt="reaction" noImageMsg={noPopup.noImageMsg} />
            <p className="guess-reveal-text">{noPopup.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoveSlides;
