import React, { useState } from "react";

import { PageHOC } from "../components";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <input
        Label="Name"
        placeholder="Enter your summoner name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <button title="Register" restStyles="mt-6">
        Register
      </button>
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to the Summoners Wrath! <br />A monster summoning Card Game
  </>,
  <>Connect to join the Rift!</>
);
