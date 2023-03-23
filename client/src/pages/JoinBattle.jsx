import React, { useState, useEffect } from "react";
import {
  battleBackground,
  player01,
  riftShard,
  rank,
  logo,
  loader,
} from "../assets";

import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const JoinBattle = () => {
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const [isSearching, setisSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearchGame = () => {
    setisSearching(true);
  };

  const handleStopSearchGame = () => {
    setisSearching(false);
  };

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
        src={battleBackground}
        className="w-[100vw] h-[100vh] object-cover object-center z-[-1] bg-fixed"
      />
      {/* Player Card */}
      <div className="flex justify-between items-start my-[30px] mx-[30px] absolute inset-0">
        <img
          src={logo}
          className="w-[140px] cursor-pointer"
          onClick={() => navigate("/home")}
          data-tooltip-id="home"
          data-tooltip-content="Home"
          data-tooltip-place="right"
        />

        <Tooltip id="home" />
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-row border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 ">
            <img
              src={player01}
              className="w-[80px] rounded-[100px] border-solid border-2 border-siteWhite"
            />
            <div className="flex justify-around font-rajdhani font-normal text-[24px] text-siteWhite flex-col">
              <h1>{username}</h1>
              <div
                className="flex flex-row items-center"
                data-tooltip-id="shards"
                data-tooltip-content={`Rift Shards : ${shards}`}
                data-tooltip-place="bottom"
              >
                <Tooltip id="shards" />
                <img src={riftShard} className="w-[50px]" />
                <h1>{shards}</h1>
              </div>
            </div>
            <img
              src={rank}
              className="w-[80px]"
              data-tooltip-id="rank"
              data-tooltip-content="Rank: Masters Division 1"
              data-tooltip-place="bottom"
            />
            <Tooltip id="rank" />
          </div>
          <div className="grid grid-cols-5 gap-4 flex flex-row absolute inset-0 m-[350px] sm:m-[150px] ">
            {/* Record and Match History */}
            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-2 ">
              <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white ">
                Record
              </h1>
              <div className=" h-full ">
                <div className="flex flex-row justify-center gap-[40px] items-center">
                  <h1 className="text-center text-[90px]">
                    12 - <span className="text-green-600 ">W</span>
                  </h1>
                  <h1 className="text-center text-[100px]">
                    <span className="text-red-600">L</span> - 2
                  </h1>
                </div>
                <div className="font-rajdhani font-normal text-[34px] text-white">
                  Match History
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="flex flex-row gap-[20px] bg-red-600 px-4 py-2 rounded-lg text-white font-rajdhani items-end col-span-1"
                onClick={isSearching ? handleStopSearchGame : handleSearchGame}
              >
                {isSearching ? "Searching" : "Search Battle"}
                <svg
                  className={
                    isSearching
                      ? "w-[30px] h-[30px] animate-spin flex items-center"
                      : "hidden"
                  }
                >
                  <image xlinkHref={loader} width="30" height="30" />
                </svg>
              </button>
            </div>

            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-2 flex flex-col justify-between">
              <div className="flex flex-col justify-end">
                <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white pb-4">
                  Rank
                </h1>
                <div className="flex flex-row flex-wrap  overflow-y-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinBattle;
