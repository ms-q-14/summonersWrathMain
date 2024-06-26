import React, { useState, useEffect, useContext } from "react";
import {
  inventoryBG,
  player01,
  riftShard,
  logo,
  rankBronze,
  rankSilver,
  rankGold,
  rankPlatinum,
  rankMasters,
} from "../assets";
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
  const [rank, setRank] = useState();
  const [rankInfo, setRankInfo] = useState("");
  const newDeck = {
    cards: deck,
    username: username,
  };
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedShards = localStorage.getItem("shards");
    const storedRankRating = localStorage.getItem("rankRating");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedShards) {
      setShards(parseInt(storedShards));
    }
    if (storedUsername) {
      getNFTCards();
    }

    switch (true) {
      case storedRankRating < 500:
        setRank(rankBronze);
        setRankInfo("Bronze");
        break;
      case storedRankRating > 501 && storedRankRating < 700:
        setRank(rankSilver);
        setRankInfo("Silver");
        break;
      case storedRankRating > 701 && storedRankRating < 1000:
        setRank(rankGold);
        setRankInfo("Gold");
        break;
      case storedRankRating > 1001 && storedRankRating < 1500:
        setRank(rankPlatinum);
        setRankInfo("Platinum");
        break;
      case storedRankRating > 1501:
        setRank(rankMasters);
        setRankInfo("Masters");
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    console.log("deck: ", deck);
  }, []);

  const handleCardDoubleClick = (summon) => {
    if (counter < 30) {
      const selectedCard = cards.find((card) => card.id === summon.id);
      setCards(cards.filter((card) => card.id !== summon.id));
      setDeck([...deck, selectedCard]);

      setCounter(counter + 1);
    }
  };

  const handleDeckDoubleClick = (summon) => {
    const selectedCard = deck.find((card) => card.id === summon.id);
    setDeck(deck.filter((card) => card.id !== summon.id));
    setCards([...cards]);

    setCounter(counter - 1);
  };

  const handleSaveDeck = () => {
    try {
      axios
        .patch("http://localhost:3000/deck", {
          cards: deck,
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

  const getDeck = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/deck?username=${username}`
      );
      const data = response.data;
      setDeck(data);
      setCounter(data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDeck(username);
  }, [username]);

  const getNFTCards = async () => {
    try {
      const response = await axios.get(
        `https://testnet-api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:${walletAddress}`
      );
      const data = response.data;
      const items = data.items;

      // create a new array of objects with 'name' and 'url' properties,
      // excluding any items that are already in the deck
      const newCards = items.map((item) => ({
        id: item.id,
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
    const fetchData = async () => {
      await getNFTCards();
    };
    fetchData();
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
              data-tooltip-content={`Rank: ${rankInfo}`}
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
                  deck={deck}
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
