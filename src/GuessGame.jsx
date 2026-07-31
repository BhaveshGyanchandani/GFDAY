import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import GifFrame from "./GifFrame";
import HERO_ROUNDS from "./heroRounds";

function GuessGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [finished, setFinished] = useState(false);

  const round = HERO_ROUNDS[roundIndex];
  const isLastRound = roundIndex === HERO_ROUNDS.length - 1;

  const handleChoice = () => setShowReveal(true);

  const handleNext = () => {
    setShowReveal(false);
    if (isLastRound) {
      setFinished(true);
    } else {
      setRoundIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setRoundIndex(0);
    setShowReveal(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="page guess-page">
        <FloatingHearts count={22} />
        <div className="card guess-card final-card">
          <p className="guess-deco">🌸 · 💗 · 🌸</p>
          <h2 className="card-title guess-title">the final verdict 💗</h2>
          <p className="guess-final-text">
            every single category... it's always been my Nuu, every time, no
            contest at all.
          </p>
          <div className="choice-row">
            <button className="choice-btn no-btn" onClick={handleRestart}>
              ↻ play again
            </button>
            <Link className="choice-btn yes-btn" to="/">
              back to start
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page guess-page">
      <FloatingHearts count={18} />

      <div className="card guess-card">
        <p className="guess-deco">🌸 · 💗 · 🌸</p>
        <h2 className="card-title guess-title">{round.heading}</h2>

        <div className="guess-options">
          <div className="guess-option">
            <GifFrame src={round.optionA.image} alt={round.optionA.label} />
            <p className="guess-option-label">{round.optionA.label}</p>
            <button
              className="choice-btn no-btn guess-pick-btn"
              onClick={handleChoice}
            >
              Choose {round.optionA.label}
            </button>
          </div>

          <div className="guess-option">
            <GifFrame src={round.optionB.image} alt={round.optionB.label} />
            <p className="guess-option-label">{round.optionB.label}</p>
            <button
              className="choice-btn no-btn guess-pick-btn"
              onClick={handleChoice}
            >
              Choose {round.optionB.label}
            </button>
          </div>
        </div>

        <p className="guess-progress">
          round {roundIndex + 1} of {HERO_ROUNDS.length}
        </p>
      </div>

      {showReveal && (
        <div className="guess-popup-backdrop" onClick={handleNext}>
          <div className="guess-popup" onClick={(e) => e.stopPropagation()}>
            <span className="popup-heart popup-heart-left">💗</span>
            <span className="popup-heart popup-heart-right">💗</span>

            <GifFrame src={round.reveal.image} alt="reveal" />
            <p className="guess-reveal-text">{round.reveal.text}</p>

            <button className="choice-btn yes-btn" onClick={handleNext}>
              {isLastRound ? "See the verdict 💗" : "Next Guess →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuessGame;
