import React, { useState } from "react";

import { PageHOC } from "../components";

import { useNavigate } from "react-router-dom";
import styles from "../styles";
import axios from "axios";

const Login = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerPassword, setPlayerPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
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

  const handleLogin = (event) => {
    event.preventDefault();
    if (!playerName || !playerPassword) {
      setErrorMessage("Please fill in all fields.");
    } else {
      try {
        axios.post("http://localhost:3000/login", data).then((res) => {
          console.log(res.data);
          if (res.data.message === "Invalid password") {
            setErrorMessage("Incorrect username or password.");
          } else if (res.data.message === "User not found") {
            setErrorMessage("Incorrect username or password.");
          } else {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            localStorage.setItem("shards", res.data.shards);
            console.log("Successfully Logged In!", data);
            setTimeout(() => {
              navigate("/home");
            }, 2000);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
        <p className={` ${styles.normalText} my-7 flex`}>
          Welcome back to the Rift!
        </p>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleLogin}>
        <div className="flex flex-row gap-3 ">
          <input
            label="Wallet Address"
            placeholder='Click "Connect Wallet" to add wallet address'
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
            type="button"
          >
            Connect Wallet
          </button>
        </div>

        <input
          label="Name"
          placeholder="Enter your summoner name"
          value={playerName}
          className={styles.input}
          type="text"
          onChange={handleNameChange}
          required
        />
        <input
          label="Password"
          placeholder="Enter your password"
          value={playerPassword}
          className={styles.input}
          type="password"
          onChange={handlePasswordChange}
          required
        />
        {errorMessage && (
          <div className="text-red-600 flex">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="text-green-600 flex">{successMessage}</div>
        )}
        <div className="py-4 flex">
          <button
            title="Login"
            className={
              "px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani font-bold"
            }
            type="submit"
          >
            Login
          </button>
        </div>
        <div
          className={` ${styles.normalText} text-red-600 my-7 flex cursor-pointer hover:underline`}
          onClick={() => navigate("/register")}
        >
          Register an account
        </div>
      </form>
    </>
  );
};

export default PageHOC(Login, <>Welcome to the Summoners Wrath!</>);
