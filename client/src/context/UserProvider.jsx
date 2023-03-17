import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");

    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const setUserWalletAddress = (address) => {
    setWalletAddress(address);
    localStorage.setItem("walletAddress", address);
  };

  return (
    <UserContext.Provider value={{ walletAddress, setUserWalletAddress }}>
      {children}
    </UserContext.Provider>
  );
};
