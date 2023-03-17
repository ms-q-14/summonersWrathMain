import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";

const BattleArena = () => {
  const { walletAddress } = useContext(UserContext);

  console.log(walletAddress);
  return (
    <div>
      <p>My wallet address: {walletAddress}</p>
    </div>
  );
};

export default BattleArena;
