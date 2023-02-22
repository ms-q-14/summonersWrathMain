import React from "react";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
  Web3Button,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";
import { PackRewards } from "@thirdweb-dev/sdk/dist/declarations/src/evm/schema";
import { useState } from "react";
import ERC1155RewardBox from "../components/ERC1155RewardBox";
import styles from "../styles/Home.module.css";

const DivineIntervention = () => {
  const address = useAddress();
  const disconnectWallet = useDisconnect();
  const connectWithMetamask = useMetamask();

  const { contract: pack } = useContract(
    "0x2D08774E4F96aa690656f6CE39F4a1D13D2F1d2b",
    "pack"
  );

  // @ts-ignore
  const { data: nfts, isLoading } = useOwnedNFTs(pack, address);

  console.log("Packs", pack);
  console.log("NFTs", nfts);

  const [openedPackRewards, setOpenedPackRewards] = useState<PackRewards>();

  return (
    <div>
      {address ? (
        <>
          <>
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
            <p>Your address: {address}</p>
          </>
          <div className={styles.container} style={{ marginTop: 0 }}>
            <div className={styles.collectionContainer}>
              {!isLoading ? (
                <div className={styles.nftBoxGrid}>
                  {nfts?.map((nft) => (
                    <div key={nft.metadata.id.toString()}>
                      <ThirdwebNftMedia
                        // @ts-ignore
                        metadata={{
                          ...nft.metadata,
                          image: `${nft.metadata.image}`,
                        }}
                        className={styles.nftMedia}
                      />
                      <h3>{nft.metadata.name}</h3>

                      <Web3Button
                        contractAddress="0x697786E18F370b04e96497113016a2c8c85B17F4"
                        action={async () => {
                          const openedRewards = await pack?.open(0, 1);
                          console.log("Opened rewards:", openedRewards);
                          setOpenedPackRewards(openedRewards);
                        }}
                      >
                        Open
                      </Web3Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <hr className={styles.divider} />
          <h2>Opened Rewards</h2>
          <div className={styles.centered}>
            {openedPackRewards &&
              openedPackRewards?.erc1155Rewards &&
              openedPackRewards?.erc1155Rewards?.length > 0 && (
                <>
                  <h3>Divine Intervention Summons</h3>
                  <div className={styles.nftBoxGrid}>
                    {openedPackRewards?.erc1155Rewards.map((reward, i) => (
                      <ERC1155RewardBox reward={reward} key={i} />
                    ))}
                  </div>
                </>
              )}
          </div>
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
    </div>
  );
};

export default DivineIntervention;
