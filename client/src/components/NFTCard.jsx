import React from "react";
import Tilt from "react-tilt";

const NFTCard = ({ card, onDoubleClick }) => {
  return (
    <div onDoubleClick={() => onDoubleClick(card)}>
      {card?.image && (
        <Tilt>
          <img className="flex justify-center" src={card.image} />
        </Tilt>
      )}
      <div className="font-rajdhani font-normal text-[20px] truncate text-white">
        {card?.name}
      </div>
    </div>
  );
};

export default NFTCard;
