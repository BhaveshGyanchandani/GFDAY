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

  // ── FINALE YES screen ──────────────────────────────────────────────────────
  if (finaleResult === "yes") {
    return (
      <div className="page love-page">
        <FloatingHearts count={28} />
        <div className="card love-card finale-result-card">
          <div className="modal-hearts" aria-hidden="true">💋 💕 💋</div>
          <GifFrame src="/assets/love/finale-yes.gif" alt="yes!" maxWidth="280px" ratio="1/1" />
          <h2 className="card-title" style={{ marginTop: "10px" }}>YESSSSS!! 🎉</h2>
          <p className="love-text">
            Muwaaaah!! 😘💋 Muwaaaaaaaaaah!!<br />
            You just made me the happiest person alive!!<br />
            I am your Lancelot, and you are my Odette, forever 💗
          </p>
          <Link className="love-nav-btn primary" to="/">
            🏠 go back to front page
          </Link>
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
          <GifFrame src="/assets/love/finale-no.gif" alt="sad" maxWidth="280px" ratio="1/1" />
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
          <GifFrame src={slide.image} alt="" />

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
            <GifFrame src={noPopup.image} alt="reaction" />
            <p className="guess-reveal-text">{noPopup.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoveSlides;
