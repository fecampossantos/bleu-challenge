import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Menu from "../components/Menu";
import Header from "../components/Header";
import { useEffect, useState } from "react";

import { useReadContract } from "wagmi";
import { abi } from "../abi";

const Home: NextPage = () => {
  const [poolID, setPoolID] = useState<`0x${string}`>(
    "0x238affe4b714ba820975b049875115ecd14cb1a4000200000000000000000155"
  );

  const CONTRACT_ADDRESS = "0x61FD2dedA9c8a1ddb9F3F436D548C58643936f02";

  const {
    data: metadataCID,
    isError,
    isLoading,
    error,
    ...rest
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "poolIdMetadataCIDMap",
    args: [poolID],
  });

  return (
    <>
      <Head>
        <title>Bleu take home assignment</title>
        <meta content="" name="description" />
      </Head>
      <div className={styles.container}>
        <Menu />

        <div>
          <Header
            search={(value) => {
              setPoolID(value as `0x${string}`);
            }}
          />
          <div className={styles.content}>
            {isLoading
              ? "Loading..."
              : isError
              ? `Error: ${error}`
              : `metadataCID: ${JSON.stringify(metadataCID, null, 2)}`}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
