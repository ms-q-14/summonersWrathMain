import React, { useState, useEffect } from "react";
import { inventoryBG, player01, riftShard, rank } from "../assets";

import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const navigate = useNavigate();

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
        src={inventoryBG}
        className="w-[100vw] h-[100vh] object-cover object-center z-[-1]"
      />
      {/* Player Card */}
      <div className="flex justify-end items-start my-[30px] mx-[30px] absolute inset-0">
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-row border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 ">
            <img
              src={player01}
              className="w-[80px] rounded-[100px] border-solid border-2 border-siteWhite"
            />
            <div className="flex justify-around font-rajdhani font-normal text-[24px] text-siteWhite flex-col">
              <h1>{username}</h1>
              <div className="flex flex-row items-center">
                <img src={riftShard} className="w-[50px]" />
                <h1>{shards}</h1>
              </div>
            </div>
            <img src={rank} className="w-[80px]" />
          </div>

          <div className="grid grid-cols-3 gap-4 flex flex-row absolute inset-0 mt-[150px] mb-[150px]">
            {/* All Cards  */}

            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-2 ">
              <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white ">
                Inventory
              </h1>
              <div className="flex flex-row flex-wrap overflow-y-auto">
                {/* Render Inventory here */}
              </div>
            </div>
            {/* Deck */}
            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-1 flex flex-col justify-between">
              <div className="flex flex-col justify-end">
                <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white pb-4">
                  Deck
                </h1>
                <div className="flex flex-row flex-wrap  overflow-y-auto">
                  {/* Render Deck here */}
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani items-end"
                  type="button"
                >
                  Save Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
