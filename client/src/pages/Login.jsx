import React, { useState } from "react";

import { PageHOC } from "../components";

import { useNavigate } from "react-router-dom";
import styles from "../styles";

const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerPassword, setPlayerPassword] = useState("");
  const [isReigstering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPlayerPassword(event.target.value);
  };

  const handleLogin = () => {
    // Handle login logic here
  };
  return (
    <>
      <div>
        <p className={` ${styles.normalText} my-7 flex`}>
          Connect to join the Rift!
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <input
          Label="Name"
          placeholder="Enter your summoner name"
          value={playerName}
          className={styles.input}
          type="text"
          onChange={handleNameChange}
          required
        />
        <input
          Label="Password"
          placeholder="Enter your password"
          value={playerPassword}
          className={styles.input}
          type="password"
          onChange={handlePasswordChange}
          required
        />
        <div className="py-4 flex">
          <button
            title="Login"
            className={
              "px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            }
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div
          className={` ${styles.normalText} text-red-600 my-7 flex cursor-pointer hover:underline`}
          onClick={() => setIsRegistering(true)}
        >
          Register an account
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
