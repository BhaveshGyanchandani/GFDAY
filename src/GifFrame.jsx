import React, { useState } from "react";

// Drop your real gif in /public/assets and pass its path as `src`
// (e.g. src="/assets/kiss-ask.gif"). Until the file exists, or if it's
// ever missing, this shows a soft placeholder instead of a broken image.

function GifFrame({ src, alt = "" }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="gif-frame">
      {!broken && src ? (
        <img src={src} alt={alt} onError={() => setBroken(true)} />
      ) : (
        <div className="gif-placeholder">
          <span>🖼️ drop your gif here</span>
        </div>
      )}
    </div>
  );
}

export default GifFrame;
