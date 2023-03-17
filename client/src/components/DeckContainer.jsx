import React from "react";
import NFTCard from "./NFTCard";

const DeckContainer = ({ deckCards, onDeckDoubleClick }) => {
  return (
    <div className="h-[800px] w-full overflow-y-scroll overflow-x-none flex flex-wrap">
      {deckCards.map((card, index) => {
        return (
          <div key={index} className="w-full md:w-1/2 p-4">
            <NFTCard card={card} onDoubleClick={onDeckDoubleClick} />
          </div>
        );
      })}
    </div>
  );
};

export default DeckContainer;
