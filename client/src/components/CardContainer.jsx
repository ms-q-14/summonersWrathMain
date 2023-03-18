import React from "react";
import NFTCard from "./NFTCard";

const CardContainer = ({ cards, onCardDoubleClick }) => {
  const sortedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="h-[800px] w-full overflow-y-scroll overflow-x-none flex flex-wrap">
      {sortedCards.map((card, index) => {
        return (
          <div key={index} className="w-full md:w-1/4 p-4">
            <NFTCard card={card} onDoubleClick={onCardDoubleClick} />
          </div>
        );
      })}
    </div>
  );
};

export default CardContainer;
