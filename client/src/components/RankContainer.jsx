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
        <img
          className="2xl:w-[120px] 2xl:h-[120px] w-[60px] h-[60px] filter grayscale"
          src={previousRank}
        />
        <img
          className="2xl:w-[320px] 2xl:h-[320px] w-[240px] h-[240px]"
          src={rank}
        />
        <img
          className="2xl:w-[120px] 2xl:h-[120px] w-[60px] h-[60px] filter grayscale"
          src={nextRank}
        />
      </div>
      <div className="mt-[120px]">
        <ProgressBar
          completed={userMMR}
          customLabel=" "
          maxCompleted={rankMaxMMR}
          bgColor="#00a7ff"
        />
        <h1 className=" font-rajdhani font-normal text-[34px] text-white">
          {rankRating} / {maxMMR}
        </h1>
      </div>
    </div>
  );
};

export default RankInfo;
