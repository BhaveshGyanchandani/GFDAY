import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";

function Letter() {
  const navigate = useNavigate();

  return (
    <div className="page letter-page">
      <FloatingHearts count={18} />

      <div className="card">
        {/* the "wax seal": a heart on each side, big heart with her initial in the middle */}
        <div className="seal-row">
          <div
            className="heart-shape"
            style={{
              "--heart-w": "34px",
              "--heart-h": "30px",
              "--heart-c1": "#ffd6e0",
              "--heart-c2": "#ffb3c6",
            }}
          />

          <div
            className="heart-shape"
            style={{
              "--heart-w": "92px",
              "--heart-h": "84px",
              "--heart-font": "2.2rem",
            }}
          >
            {/* ✏️ change the letter below to her initial */}
            <span className="heart-letter">N</span>
          </div>

          <div
            className="heart-shape"
            style={{
              "--heart-w": "34px",
              "--heart-h": "30px",
              "--heart-c1": "#ffd6e0",
              "--heart-c2": "#ffb3c6",
            }}
          />
        </div>

        <h2 className="card-title">To My Most Loving Adorable Cutest Cutie Mwaah Muwaah Lovely Baby 😘 </h2>
        <span className="card-subtitle">
          Every day with you feels so warm , happy , cheerful , joyful and muwah muuwah one (Can I get a Mwah too 🥺🥺).
        </span>

        <p className="card-body">
          Happy Girlfriend's Day, my love. Thank you for your laugh, your
          patience, and every little thing that makes you, you — I'm so
          lucky to call you mine.
        </p>

        <button className="back-btn" onClick={() => navigate("/kiss")}>
          Give me a kiss (muwah)
        </button>
      </div>
    </div>
  );
}

export default Letter;
