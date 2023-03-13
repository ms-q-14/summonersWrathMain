import React, { useState, useEffect } from "react";
import { home, player01, riftShard, rank } from "../assets";

const Home = () => {
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedShards = localStorage.getItem("shards");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedShards) {
      setShards(parseInt(storedShards));
    }
  }, []);

  return (
    <div className="relative">
      <img
        src={home}
        className="w-[100vw] h-[100vh] object-cover object-center z-[-1]"
      />
      <div className="flex justify-end items-start my-[30px] mx-[30px] absolute inset-0">
        <div className="flex flex-row border-solid border-2 rounded-md border-black p-4 gap-[40px]  backdrop-blur-lg bg-opacity-50">
          <img
            src={player01}
            className="w-[80px] rounded-[100px] border-solid border-2 border-white"
          />
          <div className="flex justify-around text-white font-medium flex-col">
            <h1>{username}</h1>
            <div className="flex flex-row items-center">
              <img src={riftShard} className="w-[40px]" />
              <h1>{shards}</h1>
            </div>
          </div>
          <img src={rank} className="w-[80px]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
