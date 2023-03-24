import React from "react";
import matchData from "./matchData";

const MatchHistory = () => {
  return (
    <div className="flex flex-col items-center gap-[20px]">
      {matchData.map((match, index) => (
        <div
          className={
            index === 4
              ? "flex flex-row hover:scale-110 cursor-pointer"
              : "flex flex-row border-solid border-b-[2px] border-siteWhite hover:scale-110 cursor-pointer"
          }
          key={index}
        >
          <div className="flex flex-row items-center gap-[60px] 2xl:gap-[150px] mb-[20px] justify-between !truncate">
            <div>
              <img className="w-[100px]" src={match.UserImage} />
              <p className="text-[20px]">{match.UserName}</p>
            </div>
            <div className="flex flex-col ">
              <h1
                className={
                  match.Outcome === "Victory"
                    ? "text-2xl font-bold text-[#00a7ff]"
                    : "text-2xl font-bold text-[#d94747]"
                }
              >
                {match.Outcome}
              </h1>
              <h1 className="text-2xl font-bold text-white">{match.Mode}</h1>
            </div>
            <div>
              <img className="w-[100px]" src={match.OpponentImage} />
              <h1 className="font-rajdhani font-normal text-[20px] text-white">
                {match.OpponentName}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
