import React, { useState, useRef } from "react";
import { PageHOC } from "../components";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import axios from "axios";

const Register = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerPassword, setPlayerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const data = {
    username: playerName,
    password: playerPassword,
    walletAddress: walletAddress,
  };
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

  const handleRegister = (event) => {
    event.preventDefault();

    if (!playerName || !playerPassword || !confirmPassword || !walletAddress) {
      setErrorMessage("Please fill in all fields.");
    } else if (playerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      try {
        axios.post("http://localhost:3000/register", data).then((res) => {
          console.log(res);
          console.log(res.data);
        });
        console.log("Successfully Registered!", data);
        setSuccessMessage("Successfully Registered!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
        <p className={` ${styles.normalText} my-7 flex`}>
          Create your summoner!
        </p>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleRegister}>
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

        {errorMessage && (
          <div className="text-red-600 my-2 flex">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-600 my-2 flex">{successMessage}</div>
        )}
        <div className="py-4 flex">
          <button
            title="Register"
            className={
              "px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            }
            type="submit"
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
      </form>
    </>
  );
};

export default PageHOC(Register, <>Join challengers in the Rift!</>);
