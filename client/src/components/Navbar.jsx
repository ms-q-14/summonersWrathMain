import React from "react";
import { summonerLogo } from "../assets";

const Navbar = () => {
  return (
    <div className="flex flex-1 justify-between bg-siteblack py-8 sm:px-12 px-8 flex-col">
      <img
        src={summonerLogo}
        alt="Summoner Logo"
        className="w-[600px] h-[200px]  object-contain cursor-pointer"
        onClick={() => navigate("/home")}
      />
    </div>
  );
};

export default Navbar;
