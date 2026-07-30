import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import GifFrame from "./GifFrame";
import VoiceRecorder from "./VoiceRecorder";
import Modal from "./Modal";

function Kiss() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // "yes" | "no" | null

  return (
    <div className="page kiss-page">
      <FloatingHearts count={14} />

      <div className="card kiss-card">
        <GifFrame src="/assets/kiss-ask.gif" alt="asking for a kiss" />

        <h2 className="card-title">give a kiss to your lovely boyfie 😘</h2>

        <VoiceRecorder label="whisper something sweet first? 🥺🎙️" />

        <div className="choice-row">
          <button
            id="kiss-yes-btn"
            className="choice-btn yes-btn"
            onClick={() => setModal("yes")}
          >
            Yes 💋
          </button>
          <button
            id="kiss-no-btn"
            className="choice-btn no-btn"
            onClick={() => setModal("no")}
          >
            No 🙈
          </button>
        </div>
      </div>

      {/* ── YES modal ── */}
      <Modal isOpen={modal === "yes"} onClose={() => setModal(null)}>
        <div className="modal-hearts" aria-hidden="true">💕 💋 💕</div>
        <h3 className="modal-title">Yaaay!! 🎉</h3>
        <p className="modal-msg">
          You said YES!! That made my whole day 😍&nbsp;muuuuah!
        </p>
        <VoiceRecorder label="record a little kiss sound for me? 😘🎙️" />
        <button
          id="modal-yes-cta"
          className="choice-btn yes-btn modal-cta"
          onClick={() => navigate("/kiss/accepted")}
        >
          let's go!! 💗
        </button>
      </Modal>

      {/* ── NO modal ── */}
      <Modal isOpen={modal === "no"} onClose={() => setModal(null)}>
        <div className="modal-hearts" aria-hidden="true">😢 💔 😢</div>
        <h3 className="modal-title">Nooo... really? 🥺</h3>
        <p className="modal-msg">
          Are you suuure? Not even one tiny kiss?<br />Please think again...
        </p>
        <VoiceRecorder label="at least leave me a voice note? 🥺🎙️" />
        <div className="modal-btn-row">
          <button
            id="modal-no-yes-btn"
            className="choice-btn yes-btn"
            onClick={() => navigate("/kiss/accepted")}
          >
            okay fine, yes 💋
          </button>
          <button
            id="modal-still-no-btn"
            className="choice-btn no-btn modal-still-no"
            onClick={() => { setModal(null); navigate("/kiss/decline"); }}
          >
            still no 😔
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Kiss;
