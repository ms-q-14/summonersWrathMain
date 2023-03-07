import React, { useState } from "react";

import { PageHOC } from "../components";

import { useNavigate } from "react-router-dom";
import styles from "../styles";

const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div>
        <p className={` ${styles.normalText} my-7 flex`}>
          Connect to join the Rift!
        </p>
      </div>
      <div className="flex flex-col">
        <input
          Label="Name"
          placeholder="Enter your summoner name"
          value={playerName}
          className={styles.input}
        />
        <div className="py-4 flex">
          <button
            title="Register"
            className={
              "px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            }
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to the Summoners Wrath! <br />A monster summoning Card Game
  </>
);
