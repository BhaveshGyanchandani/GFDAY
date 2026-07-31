// npm install react-router-dom  (if you don't have it yet)

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from "./FrontPage";
import Letter from "./Letter";
import Kiss from "./Kiss";
import KissDecline from "./KissDecline";
import KissAccepted from "./KissAccepted";
import Bouquet from "./Bouquet";
import BouquetResult from "./BouquetResult";
import GuessGame from "./GuessGame";
import LoveSlides from "./LoveSlides";
import FlowerSlideshow from "./FlowerSlideshow";
import SpecialBouquet from "./SpecialBouquet";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/letter" element={<Letter />} />
        <Route path="/kiss" element={<Kiss />} />
        <Route path="/kiss/decline" element={<KissDecline />} />
        <Route path="/kiss/accepted" element={<KissAccepted />} />
        <Route path="/bouquet" element={<Bouquet />} />
        <Route path="/bouquet/result" element={<BouquetResult />} />
        <Route path="/bouquet/slideshow" element={<FlowerSlideshow />} />
        <Route path="/bouquet/special" element={<SpecialBouquet />} />
        <Route path="/guess" element={<GuessGame />} />
        <Route path="/love" element={<LoveSlides />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
