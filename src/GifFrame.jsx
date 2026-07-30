import React, { useState, useEffect } from "react";

// Props:
//   src       — image URL (local or https)
//   alt       — alt text
//   width     — CSS value for width,    e.g. "100%"  (default: "100%")
//   maxWidth  — CSS value for max-width, e.g. "300px" (default: "240px")
//   height    — CSS value for height,   e.g. "200px" (default: "auto")
//   ratio     — CSS aspect-ratio,       e.g. "1 / 1"  (default: "4 / 3")
//
// Example usage:
//   <GifFrame src="/assets/no_1.gif" width="100%" maxWidth="320px" ratio="1 / 1" />

function GifFrame({
  src,
  alt = "",
  width = "100%",
  maxWidth = "240px",
  height = "auto",
  ratio = "4 / 3",
}) {
  const [state, setState] = useState("loading");

  // Reset whenever src changes
  useEffect(() => {
    if (!src) { setState("broken"); return; }
    setState("loading");
  }, [src]);

  const cssVars = {
    "--gf-w":     width,
    "--gf-max-w": maxWidth,
    "--gf-h":     height,
    "--gf-ratio": ratio,
  };

  return (
    <div className="gif-frame" style={cssVars}>
      {src && state !== "broken" && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setState("loaded")}
          onError={() => setState("broken")}
          style={{ display: state === "loaded" ? "block" : "none" }}
        />
      )}

      {state === "loading" && (
        <div className="gif-placeholder gif-loading">
          <span className="gif-spinner" aria-hidden="true">💗</span>
          <span className="gif-loading-text">loading...</span>
        </div>
      )}

      {state === "broken" && (
        <div className="gif-placeholder">
          <span>🖼️ drop your gif here</span>
        </div>
      )}
    </div>
  );
}

export default GifFrame;
