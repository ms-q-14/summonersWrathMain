import React from "react";
import { useNavigate } from "react-router-dom";

import { summonerLogo, footerNight } from "../assets";
import styles from "../styles";

const PageHOC = (Componenet, title, description) => () => {
  const navigate = useNavigate();

  return (
    <div className={styles.hocContainer}>
      <div className={styles.hocContentBox}>
        <img
          src={summonerLogo}
          alt="logo"
          className={"w-[600px] h-[200px]  object-contain cursor-pointer"}
          onClick={() => navigate("/")}
        />

        <div className={styles.hocBodyWrapper}>
          <div className="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text `}>{title}</h1>
          </div>
          <p className={`${styles.normalText} my-10`}>{description}</p>
          <Componenet />
        </div>
      </div>
      <div className="flex flex-1">
        <img
          src={footerNight}
          alt="footer"
          className="w-full xl:h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PageHOC;
