import React, { useState, useEffect } from "react";
import {
  packsShop,
  player01,
  riftShard,
  logo,
  rankBronze,
  rankSilver,
  rankGold,
  rankPlatinum,
  rankMasters,
} from "../assets";

import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Packs = () => {
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const [rank, setRank] = useState();
  const [rankInfo, setRankInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedShards = localStorage.getItem("shards");
    const storedRankRating = localStorage.getItem("rankRating");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedShards) {
      setShards(parseInt(storedShards));
    }

    switch (true) {
      case storedRankRating < 500:
        setRank(rankBronze);
        setRankInfo("Bronze");
        break;
      case storedRankRating > 501 && storedRankRating < 700:
        setRank(rankSilver);
        setRankInfo("Silver");
        break;
      case storedRankRating > 701 && storedRankRating < 1000:
        setRank(rankGold);
        setRankInfo("Gold");
        break;
      case storedRankRating > 1001 && storedRankRating < 1500:
        setRank(rankPlatinum);
        setRankInfo("Platinum");
        break;
      case storedRankRating > 1501:
        setRank(rankMasters);
        setRankInfo("Masters");
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className="relative">
      <img
        src={packsShop}
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
              data-tooltip-content={`Rank: ${rankInfo}`}
              data-tooltip-place="bottom"
            />
            <Tooltip id="rank" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packs;
