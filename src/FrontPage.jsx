import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";

function FrontPage() {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // let the little "open" animation play before navigating to the letter
    setTimeout(() => navigate("/letter"), 650);
  };

  return (
    <div className="page front-page">
      <FloatingHearts count={22} />

      <div className="front-content">
        <p className="eyebrow">❀ a little envelope for you ❀</p>
        <h1 className="main-title">Happy Girlfriend's Day</h1>
        <p className="subtitle">there's something waiting inside...</p>

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

        <p className="hint">tap the envelope to open it</p>
      </div>
    </div>
  );
}

export default FrontPage;
