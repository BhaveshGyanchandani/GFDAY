import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "./FloatingHearts";
import GifFrame from "./GifFrame";
import VoiceRecorder from "./VoiceRecorder";
import Modal from "./Modal";

const STAGES = [
  { gif: "/assets/no-1.gif", title: "u dont want to give your adorable boyfie a sweet kiss 🥲" },
  { gif: "/assets/no-2.gif", title: "Please Nuu give a kiss naa pleasee 🥺" },
  { gif: "/assets/no-3.gif", title: "pretty pretty please? 🥺👉👈" },
  { gif: "/assets/no-4.gif", title: "i'll be soooo sad without it 😢" },
  { gif: "/assets/no-5.gif", title: "just one itty bitty kiss? pleeeease 🥹" },
  { gif: "/assets/no-6.gif", title: "okay last try... pleeeeease say yes 💗" },
];

function KissDecline() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const isLastStage = stage === STAGES.length - 1;
  const current = STAGES[stage];

  const handleNo = () => {
    if (!isLastStage) setStage((s) => s + 1);
    // at last stage: button is still visible but does nothing visible —
    // it just wiggles to show it's stuck
  };

  // Yes grows attractively; No shrinks but stays at minimum 0.55 scale + fades a little
  const noScale  = Math.max(1 - stage * 0.1, 0.55);
  const noOpacity = Math.max(1 - stage * 0.12, 0.35);
  const yesScale = Math.min(1 + stage * 0.16, 2.0);

  return (
    <div className="page kiss-page">
      <FloatingHearts count={14} />

      <div className="card kiss-card">
        <GifFrame src={current.gif} alt="reaction gif" />

        <h2 className="card-title decline-title">{current.title}</h2>

        <VoiceRecorder label="okay at least leave a voice note 🥺🎙️" />

        <div className="choice-row">
          <button
            id="decline-yes-btn"
            className="choice-btn yes-btn"
            style={{ transform: `scale(${yesScale})` }}
            onClick={() => setShowModal(true)}
          >
            Yes 💋
          </button>

          {/* No: visibly shrinks + fades but always readable — never disappears */}
          <button
            id="decline-no-btn"
            className={`choice-btn no-btn${isLastStage ? " no-btn--stuck" : ""}`}
            style={{
              transform: `scale(${noScale})`,
              opacity: noOpacity,
              transformOrigin: "center center",
            }}
            onClick={handleNo}
            aria-disabled={isLastStage}
          >
            No {isLastStage ? "🫣" : ""}
          </button>
        </div>

        {/* tiny stage dots so she knows how many nos are left */}
        <div className="stage-dots" aria-hidden="true">
          {STAGES.map((_, i) => (
            <span key={i} className={`stage-dot${i === stage ? " active" : i < stage ? " done" : ""}`} />
          ))}
        </div>
      </div>

      {/* YES modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-hearts" aria-hidden="true">💕 💋 💕</div>
        <h3 className="modal-title">You changed your mind!! 🎉</h3>
        <p className="modal-msg">
          I knew you couldn't say no forever 😘<br />I love you my Nuu!!
        </p>
        <VoiceRecorder label="say something sweet? 🎙️💗" />
        <button
          id="decline-modal-cta"
          className="choice-btn yes-btn modal-cta"
          onClick={() => navigate("/kiss/accepted")}
        >
          go get that kiss 💋
        </button>
      </Modal>
    </div>
  );
}

export default KissDecline;
