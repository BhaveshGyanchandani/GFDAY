import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";

function SpecialBouquet() {
  const navigate = useNavigate();

  return (
    <div
      className="page fs-page"
      style={{
        background: "linear-gradient(160deg, #ffe4ec 0%, #ffd1dc 60%, #ffb3c6 100%)",
      }}
    >
      <FloatingHearts count={20} />

      <div className="sb-card">
        {/* placeholder image area — swap src when you have the real photo */}
        <div className="sb-img-wrap">
          {/* ✏️ replace the src below with your actual image path, e.g. "/assets/my_bouquet.jpg" */}
          <div className="sb-placeholder">
            <span className="sb-placeholder-emoji">💐</span>
            <span className="sb-placeholder-hint">your photo goes here 🌸</span>
          </div>
        </div>

        {/* romantic text */}
        <h2 className="sb-title">That's the most beautiful 🌹</h2>
        <p className="sb-desc">
          gorgeous, cute, pretty, most amazing<br />
          bouquet of flowers —<br />
          <em>and it's all yours, my Nuu 💕</em>
        </p>

        {/* nav */}
        <button
          className="fs-btn fs-btn--next"
          style={{ marginTop: 4 }}
          onClick={() => navigate("/")}
        >
          back to start 💌
        </button>
      </div>
    </div>
  );
}

export default SpecialBouquet;
