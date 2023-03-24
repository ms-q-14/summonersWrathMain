import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const RankInfo = ({
  rank,
  minMMR,
  maxMMR,
  rankRating,
  previousRank,
  nextRank,
}) => {
  const rankMaxMMR = maxMMR - minMMR;
  const userMMR = rankRating - minMMR;

  return (
    <div className="gap-[80px]">
      <div className="flex flex-row items-center">
        {previousRank && (
          <img
            className="2xl:w-[160px] 2xl:h-[160px] w-[80px] h-[80px] filter grayscale"
            src={previousRank}
          />
        )}
        <img
          className="2xl:w-[320px] 2xl:h-[320px] w-[220px] h-[220px]"
          src={rank}
        />
        <img
          className="2xl:w-[160px] 2xl:h-[160px] w-[80px] h-[80px] filter grayscale"
          src={nextRank}
        />
      </div>
      <div className="mt-[120px]">
        <ProgressBar
          completed={userMMR}
          customLabel=" "
          maxCompleted={rankMaxMMR}
          bgColor="#c60d10"
          height="50px"
        />
        <h1 className=" font-rajdhani font-normal text-[50px] text-white mt-[50px]">
          {rankRating} / {maxMMR} MMR
        </h1>
      </div>
    </div>
  );
};

export default RankInfo;
