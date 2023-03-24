import React, { useState, useEffect } from "react";
import {
  battleBackground,
  player01,
  riftShard,
  logo,
  loader,
  rankBronze,
  rankSilver,
  rankGold,
  rankPlatinum,
  rankMasters,
  blankRank,
} from "../assets";

import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import MatchHistory from "../components/MatchHistory";
import RankContainer from "../components/RankContainer";

const JoinBattle = () => {
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const [isSearching, setisSearching] = useState(false);
  const [rank, setRank] = useState();
  const [previousRank, setPreviousRank] = useState();
  const [nextRank, setNextRank] = useState();
  const [rankInfo, setRankInfo] = useState("");
  const [rankMinMMR, setRankMinMMR] = useState(0);
  const [rankMaxMMR, setRankMaxMMR] = useState(0);
  const [rankRating, setRankRating] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
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
    const storedRankRating = localStorage.getItem("rankRating");
    const storedWins = localStorage.getItem("wins");
    const storedLosses = localStorage.getItem("losses");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedShards) {
      setShards(parseInt(storedShards));
    }

    if (storedWins) {
      setWins(parseInt(storedWins));
    }

    if (storedLosses) {
      setLosses(parseInt(storedLosses));
    }

    if (storedRankRating) {
      setRankRating(parseInt(storedRankRating));
    }

    switch (true) {
      case storedRankRating < 500:
        setRank(rankBronze);
        setRankInfo("Bronze");
        setRankMinMMR(0);
        setRankMaxMMR(500);
        setNextRank(rankSilver);
        setPreviousRank(blankRank);
        break;
      case storedRankRating > 501 && storedRankRating < 700:
        setRank(rankSilver);
        setRankInfo("Silver");
        setRankMinMMR(501);
        setRankMaxMMR(700);
        setPreviousRank(rankBronze);
        setNextRank(rankGold);
        break;
      case storedRankRating > 701 && storedRankRating < 1000:
        setRank(rankGold);
        setRankInfo("Gold");
        setRankMinMMR(701);
        setRankMaxMMR(1000);
        setPreviousRank(rankSilver);
        setNextRank(rankPlatinum);
        break;
      case storedRankRating > 1001 && storedRankRating < 1500:
        setRank(rankPlatinum);
        setRankInfo("Platinum");
        setRankMinMMR(1001);
        setRankMaxMMR(1500);
        setPreviousRank(rankGold);
        setNextRank(rankMasters);
        break;
      case storedRankRating > 1501:
        setRank(rankMasters);
        setRankInfo("Masters");
        setRankMinMMR(1501);
        setPreviousRank(rankPlatinum);
        break;
      default:
        break;
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
              data-tooltip-content={`Rank: ${rankInfo}`}
              data-tooltip-place="bottom"
            />
            <Tooltip id="rank" />
          </div>
          <div className="grid grid-cols-5 gap-4 flex flex-row absolute inset-0 m-[350px] sm:mt-[150px] sm:mb-[150px] sm:mr-[30px] sm:ml-[30px]">
            {/* Record and Match History */}
            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-2 ">
              <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white ">
                Season Record
              </h1>
              <div className=" h-full ">
                <div className="flex flex-row justify-center gap-[60px] items-center">
                  <h1 className="text-center text-[60px] ">
                    {wins} - <span className="text-[#00a7ff] ">W</span>
                  </h1>
                  <h1 className="text-center text-[60px] ">
                    <span className="text-[#d94747]">L</span> - {losses}
                  </h1>
                </div>
                <div className=" font-rajdhani font-normal text-[34px] text-white">
                  <h1>Match History</h1>
                  <MatchHistory />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="flex items-center flex-row gap-[20px] bg-red-600 px-4 py-2 rounded-lg text-white font-rajdhani items-end col-span-1 text-[30px]"
                onClick={isSearching ? handleStopSearchGame : handleSearchGame}
              >
                {isSearching ? "Searching" : "Find Match"}
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
                <div className="flex justify-center mt-[140px] flex-row">
                  <RankContainer
                    rank={rank}
                    minMMR={rankMinMMR}
                    maxMMR={rankMaxMMR}
                    rankRating={rankRating}
                    previousRank={previousRank}
                    nextRank={nextRank}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinBattle;
