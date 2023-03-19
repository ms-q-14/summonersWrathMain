import React, { useEffect } from "react";
import NFTCard from "./NFTCard";

const CardContainer = ({ cards, deck, onCardDoubleClick }) => {
  const filteredCards = cards.filter((card) => {
    return !deck.find((summon) => summon.id === card.id);
  });
  const sortedCards = [...filteredCards].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // localStorage.setItem("cards", JSON.stringify(sortedCards));

  useEffect(() => {
    console.log("Inventory Cards: ", sortedCards);
  }, [cards]);
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
