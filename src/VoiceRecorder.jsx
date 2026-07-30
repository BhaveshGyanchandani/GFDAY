import React, { useRef, useState, useEffect } from "react";

function VoiceRecorder({ label = "leave a lil voice note? (Please 🥺🥺)" }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const startRecording = async () => {
    setError(null);
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("couldn't access microphone — check browser permissions 🎤");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="voice-recorder">
      <p className="voice-label">{label}</p>

      <div className="voice-controls">
        {!recording ? (
          <button type="button" className="mic-btn" onClick={startRecording}>
            🎙️ {audioUrl ? "re-record" : "record"}
          </button>
        ) : (
          <button type="button" className="mic-btn recording" onClick={stopRecording}>
            <span className="rec-dot" /> ⏹ stop &nbsp;
            <span className="rec-timer">{fmt(seconds)}</span>
          </button>
        )}

        {recording && (
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        )}

        {audioUrl && (
          <div className="audio-wrap">
            <audio className="voice-player" src={audioUrl} controls />
            <a className="dl-btn" href={audioUrl} download="voice-note.webm">
              💾 save
            </a>
          </div>
        )}
      </div>

      {error && <p className="voice-error">{error}</p>}
    </div>
  );
}

export default VoiceRecorder;
