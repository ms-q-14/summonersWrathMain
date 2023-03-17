import React from "react";
import Tilt from "react-tilt";

const NFTCard = ({ card, onDoubleClick }) => {
  return (
    <div onDoubleClick={() => onDoubleClick(card)}>
      <Tilt>
        {card.meta.content[0] && (
          <img className="flex justify-center" src={card.meta.content[0].url} />
        )}
      </Tilt>
      <div className="font-rajdhani font-normal text-[20px] truncate text-white">
        {card.meta.name}
      </div>
    </div>
  );
};

export default NFTCard;
