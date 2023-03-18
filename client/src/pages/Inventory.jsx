import React, { useState, useEffect, useContext } from "react";
import { inventoryBG, player01, riftShard, rank, logo } from "../assets";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { UserContext } from "../context/UserProvider";
import axios from "axios";
import { CardContainer, DeckContainer } from "../components";
import { nanoid } from "nanoid";

const Inventory = () => {
  const { walletAddress } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [shards, setShards] = useState(0);
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [counter, setCounter] = useState(0);
  const newDeck = {
    cards: deck,
    username: username,
  };
  const navigate = useNavigate();

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

  useEffect(() => {
    console.log("deck: ", deck);
  }, [deck]);

  useEffect(() => {
    console.log("cards: ", cards);
  }, [cards]);

  const handleCardDoubleClick = (summon) => {
    if (counter < 30) {
      const selectedCard = cards.find((card) => card.id === summon.id);
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== summon.id)
      );
      setDeck([...deck, selectedCard]);
      setCounter(counter + 1);
    }
  };

  const handleDeckDoubleClick = (card) => {
    setCards([...cards, card]);
    setDeck(deck.filter((c) => c.id !== card.id));
    setCounter(counter - 1);
  };

  const handleSaveDeck = () => {
    try {
      axios
        .patch("http://localhost:3000/deck", {
          cards: deck.map((card) => ({
            image: card.image,
            name: card.name,
          })),
          username: username,
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
        });

      console.log("Saved Deck", deck);
    } catch (error) {
      console.error(error.message);
    }

    console.log("Saved deck: ", deck);
  };

  const getNFTCards = async () => {
    try {
      const response = await axios.get(
        `https://testnet-api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:${walletAddress}`
      );
      const data = response.data;
      const items = data.items;

      // create a new array of objects with 'name' and 'url' properties
      const newCards = items.map((item) => ({
        id: nanoid(),
        name: item.meta.name,
        image: item.meta.content[0] && item.meta.content[0].url,
      }));

      // set the state with the new array
      setCards(newCards);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNFTCards();
  }, [walletAddress]);

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
              <h1 className=" py-[30px] font-rajdhani font-normal text-[24px] text-White">
                Double click on your cards to move them between your deck and
                inventory
              </h1>
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
                <h1 className="font-rajdhani font-normal text-[34px] text-White">
                  {counter}/30
                </h1>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 w-fit text-white font-rajdhani items-end"
                  type="button"
                  onClick={handleSaveDeck}
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
