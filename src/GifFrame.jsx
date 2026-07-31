import React, { useState } from "react";

// Drop your real gif in /public/assets and pass its path as `src`
// (e.g. src="/assets/kiss-ask.gif"). Until the file exists, or if it's
// ever missing, this shows a soft placeholder instead of a broken image.
// Pass `noImageMsg` to show a custom cute message instead of the generic placeholder.

function GifFrame({ src, alt = "", noImageMsg = null }) {
  const [broken, setBroken] = useState(false);

  const showPlaceholder = broken || !src;

  return (
    <div className="gif-frame">
      {!showPlaceholder ? (
        <img src={src} alt={alt} onError={() => setBroken(true)} />
      ) : noImageMsg ? (
        <div className="gif-placeholder gif-placeholder--msg">
          <span>{noImageMsg}</span>
        </div>
      ) : (
        <div className="gif-placeholder">
          <span>🖼️ drop your image here</span>
        </div>
      )}
    </div>
  );
}

export default GifFrame;
