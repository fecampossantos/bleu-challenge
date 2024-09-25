import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "./home.module.css";
import Menu from "../components/Menu";
import Header from "../components/Header";

import PinataFile from "../components/PinataFile";
import { Address } from "../types";

const Home: NextPage = () => {
  const [poolID, setPoolID] = useState<Address | undefined>();

  return (
    <>
      <Head>
        <title>Bleu | take home assignment</title>
        <meta content="" name="description" />
      </Head>
      <div className={styles.container}>
        <Menu updatePoolId={setPoolID} />

        <div>
          <Header
            search={(value: Address) => {
              setPoolID(value);
            }}
          />
          {poolID && <h1 className={styles.title}>{poolID}</h1>}
          <div className={styles.content}>
            <PinataFile poolID={poolID} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
