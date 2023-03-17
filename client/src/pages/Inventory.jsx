import React, { useState, useEffect, useContext } from "react";
import { inventoryBG, player01, riftShard, rank, logo } from "../assets";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { UserContext } from "../context/UserProvider";
import axios from "axios";
import { CardContainer, DeckContainer } from "../components";

const Inventory = () => {
  const { walletAddress } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  console.log(walletAddress);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedShards = localStorage.getItem("shards");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedShards) {
      setShards(parseInt(storedShards));
    }

    getNFTCards();
  }, []);

  const handleCardDoubleClick = (card) => {
    if (counter < 30) {
      setDeck([...deck, card]);
      setCards(cards.filter((c) => c.id !== card.id));
      setCounter(counter + 1);
    } else alert("Your Deck is full! Replace a card to add a new one.");
  };

  const handleDeckDoubleClick = (card) => {
    setCards([...cards, card]);
    setDeck(deck.filter((c) => c.id !== card.id));
    setCounter(counter - 1);
  };

  const getNFTCards = async () => {
    try {
      const response = await axios.get(
        `https://testnet-api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:${walletAddress}`
      );
      //https://www.youtube.com/watch?v=gJG6x8jUeRg
      // Api for mainnet
      // https://api.rarible.org/v0.1/items/byOwner?owner=ETHEREUM:${walletAddress}
      const data = response.data;
      setCards(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNFTCards();
  }, [walletAddress]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <div className="relative">
      <img
        src={inventoryBG}
        className="w-[100vw] h-[100vh] object-cover object-center z-[-1]"
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
              data-tooltip-content="Rank: Masters Division 1"
              data-tooltip-place="bottom"
            />
            <Tooltip id="rank" />
          </div>

          <div className="grid grid-cols-3 gap-4 flex flex-row absolute inset-0 mt-[150px] mb-[150px]">
            {/* All Cards  */}

            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-2 ">
              <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white ">
                Inventory
              </h1>
              <div className="flex flex-row flex-wrap overflow-y-auto">
                <CardContainer
                  cards={cards}
                  onCardDoubleClick={handleCardDoubleClick}
                />
              </div>
            </div>
            {/* Deck */}
            <div className="border-solid border-2 rounded-md border-black p-4 gap-[40px] bg-black bg-opacity-50 col-span-1 flex flex-col justify-between">
              <div className="flex flex-col justify-end">
                <h1 className="flex justify-center font-rajdhani font-normal text-[34px] text-white pb-4">
                  Deck
                </h1>
                <div className="flex flex-row flex-wrap  overflow-y-auto">
                  <DeckContainer
                    deckCards={deck}
                    onDeckDoubleClick={handleDeckDoubleClick}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <h1 className="flex justify-end font-rajdhani font-normal text-[34px] text-White">
                  {counter}/30
                </h1>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani items-end"
                  type="button"
                >
                  Save Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
