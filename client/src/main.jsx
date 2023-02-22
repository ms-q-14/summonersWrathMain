import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { Home, Packs, Deck, DivineIntervention, Login } from "./pages";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "goerli";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={activeChain}>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/packs" element={<Packs />} />
          <Route path="/deck" element={<Deck />} />
          <Route path="/divine-intervention" element={<DivineIntervention />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);
