import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import FLOWERS from "./flowers";

function Bouquet() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    navigate("/bouquet/result", { state: { selected } });
  };

  return (
    <div className="page bouquet-page">
      <FloatingHearts count={14} />

      <div className="card bouquet-card">
        {/* header */}
        <div className="bouquet-header">
          <div className="bouquet-icon" aria-hidden="true">💐</div>
          <h2 className="card-title bouquet-title">Build Your Dream Bouquet</h2>
          <p className="bouquet-hint">
            tap every flower you'd love — I'll make it real ✨
          </p>
        </div>

        {/* flower grid */}
        <ul className="flower-grid" role="group" aria-label="Flower choices">
          {FLOWERS.map((flower) => {
            const isOn = selected.includes(flower.id);
            return (
              <li key={flower.id}>
                <button
                  type="button"
                  id={`flower-${flower.id}`}
                  className={`flower-card${isOn ? " flower-card--on" : ""}`}
                  style={{ "--fc": flower.color }}
                  onClick={() => toggle(flower.id)}
                  aria-pressed={isOn}
                >
                  {/* checkmark tick */}
                  <span className="flower-tick" aria-hidden="true">✓</span>

                  <span className="flower-emoji" aria-hidden="true">
                    {flower.emoji}
                  </span>
                  <span className="flower-name">{flower.label}</span>
                  <span className="flower-desc">{flower.desc}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* selection counter */}
        <p className="flower-count" aria-live="polite">
          {selected.length === 0
            ? "choose at least one flower 🌱"
            : `${selected.length} flower${selected.length > 1 ? "s" : ""} picked 💕`}
        </p>

        {/* CTA */}
        <button
          id="bouquet-next-btn"
          className="choice-btn yes-btn next-btn"
          disabled={selected.length === 0}
          onClick={handleNext}
        >
          Create my bouquet →
        </button>
      </div>
    </div>
  );
}

export default Bouquet;
