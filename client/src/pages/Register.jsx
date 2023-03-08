import React, { useState } from "react";
import { PageHOC } from "../components";
import { useNavigate } from "react-router-dom";
import styles from "../styles";

const Register = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerPassword, setPlayerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPlayerPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleWalletAddressChange = async () => {
    if (typeof window.ethereum === "undefined") {
      setErrorMessage("Please install MetaMask to connect your wallet.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      setWalletAddress(accounts[0]);
    } catch (error) {
      setErrorMessage("Failed to connect to your wallet.");
      console.error(error);
    }
  };

  const handleRegister = () => {
    if (!playerName || !playerPassword || !confirmPassword || !walletAddress) {
      setErrorMessage("Please fill in all fields.");
    } else if (playerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      //Add in API call to register user
      console.log("Successfully Registered!");
    }
  };

  return (
    <>
      <div>
        <p className={` ${styles.normalText} my-7 flex`}>
          Create your summoner!
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <input
          label="Name"
          placeholder="Create your summoner name"
          value={playerName}
          className={styles.input}
          type="text"
          onChange={handleNameChange}
          required
        />
        <input
          label="Password"
          placeholder="Create your password"
          value={playerPassword}
          className={styles.input}
          type="password"
          onChange={handlePasswordChange}
          required
        />
        <input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          className={styles.input}
          type="password"
          onChange={handleConfirmPasswordChange}
          required
        />
        <div className="flex flex-row gap-3 ">
          <input
            label="Wallet Address"
            placeholder="Click button to add wallet address"
            value={walletAddress}
            className={`${styles.input} w-full`}
            type="text"
            onChange={handleWalletAddressChange}
            required
            disabled
          />

          <button
            className="px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            onClick={handleWalletAddressChange}
          >
            Connect Wallet
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-600 my-2 flex">{errorMessage}</div>
        )}
        <div className="py-4 flex">
          <button
            title="Register"
            className={
              "px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            }
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
        <div
          className={` ${styles.normalText} text-red-600 my-7 flex cursor-pointer hover:underline`}
          onClick={() => navigate("/")}
        >
          Already have an account? Login here
        </div>
      </div>
    </>
  );
};

export default PageHOC(Register, <>Join challengers in the Rift!</>);
