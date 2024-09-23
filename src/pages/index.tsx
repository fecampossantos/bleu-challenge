import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Menu from "../components/Menu";
import Header from "../components/Header";

import PinataFile from "../components/PinataFile";

const Home: NextPage = () => {
  const [poolID, setPoolID] = useState<`0x${string}`>(
    "0x238affe4b714ba820975b049875115ecd14cb1a4000200000000000000000155"
  );

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
            <PinataFile poolID={poolID} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
