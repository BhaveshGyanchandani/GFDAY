import React, { useState } from "react";
import { Link } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import GifFrame from "./GifFrame";
import VoiceRecorder from "./VoiceRecorder";
import Modal from "./Modal";


function KissAccepted() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page kiss-page">
      <FloatingHearts count={24} />

      <div className="card kiss-card">
        <GifFrame src="/assets/no_1.gif" alt="celebratory kiss" />

        <p className="accepted-text">
          I love you my Nuu ♥️<br />
          I love you soooo sooooo soooooo much my baby,<br />
          muuuuuuwaaaaaaaahhhhhhhh muuwaaaaaaaaahhhhhhhhhhhhh 😘
        </p>

        <VoiceRecorder label="record a kiss back for me? 😘🎙️" />

        <div className="accepted-btns">
          <button
            id="accepted-msg-btn"
            className="choice-btn yes-btn"
            onClick={() => setShowModal(true)}
          >
            💌 a special note for you
          </button>
          <Link id="bouquet-btn" className="choice-btn yes-btn bouquet-btn" to="/bouquet">
            💐 one more thing for you →
          </Link>
          <Link className="back-btn" to="/">
            ← back to the start
          </Link>
        </div>
      </div>

      {/* Special message modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-hearts" aria-hidden="true">💗 🌹 💗</div>
        <h3 className="modal-title">A little note for you 💌</h3>
        <p className="modal-msg">
          Thank you for being the most wonderful person in my life.
          Every day with you is my favourite day 🌸<br />
          I love you forever and ever, my Nuu.
        </p>
        <VoiceRecorder label="your turn — say something back? 🥹🎙️" />
        <button
          id="accepted-modal-close-btn"
          className="choice-btn yes-btn modal-cta"
          onClick={() => setShowModal(false)}
        >
          close with a kiss 💋
        </button>
      </Modal>
    </div>
  );
}

export default KissAccepted;
