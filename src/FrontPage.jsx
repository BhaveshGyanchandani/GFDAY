import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";

function FrontPage() {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => navigate("/letter"), 650);
  };

  return (
    <div className="page front-page">
      <FloatingHearts count={22} />

      <div className="front-content">
        <p className="eyebrow">❀ a little something for you ❀</p>
        <h1 className="main-title">Happy Girlfriend's Day</h1>
        <p className="subtitle">there's so much waiting inside...</p>

        {/* ── envelope ── */}
        <div
          className={`envelope ${opening ? "envelope-open" : ""}`}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Open your letter"
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
        >
          <div className="envelope-stamp">♥</div>
          <div className="envelope-flap" />
          <div className="envelope-body">
            <div
              className="heart-shape"
              style={{
                "--heart-w": "40px",
                "--heart-h": "36px",
                "--heart-font": "0.9rem",
              }}
            >
              {/* ✏️ change the letter below to her initial */}
              <span className="heart-letter">N</span>
            </div>
          </div>
        </div>

        <p className="hint">tap the envelope to open it 💌</p>

        {/* ── feature buttons grid ── */}
        <div className="front-btns">
          <button
            id="love-slides-btn"
            className="front-feature-btn"
            onClick={() => navigate("/love")}
          >
            <span className="front-btn-icon">💕</span>
            <span className="front-btn-label">love notes</span>
          </button>

          <button
            id="guess-game-btn"
            className="front-feature-btn"
            onClick={() => navigate("/guess")}
          >
            <span className="front-btn-icon">🎮</span>
            <span className="front-btn-label">play a game</span>
          </button>

          <button
            id="bouquet-btn-home"
            className="front-feature-btn"
            onClick={() => navigate("/bouquet")}
          >
            <span className="front-btn-icon">💐</span>
            <span className="front-btn-label">build bouquet</span>
          </button>

          <button
            id="kiss-btn-home"
            className="front-feature-btn"
            onClick={() => navigate("/kiss")}
          >
            <span className="front-btn-icon">😘</span>
            <span className="front-btn-label">give a kiss</span>
          </button>

          <button
            id="photobouquet-btn-home"
            className="front-feature-btn"
            onClick={() => navigate("/photobouquet")}
          >
            <span className="front-btn-icon">💎</span>
            <span className="front-btn-label">photo bouquet</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
