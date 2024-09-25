import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./header.module.css";
import SearchInput from "../SearchInput";
import { useEffect, useState } from "react";
import { Address } from "../../types";
import { KEY } from "./constants";
import { addToRecentSearches } from "./utils";

const Header = ({ search }: { search: (value: Address) => void }) => {
  const [searches, setSearches] = useState<Array<string>>();

  useEffect(() => {
    const previousSearches = localStorage.getItem(KEY);
    if (previousSearches) setSearches(previousSearches.split(","));
  }, []);

  const handleSearch = (value: Address) => {
    addToRecentSearches(value);
    search(value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <SearchInput search={(value) => handleSearch(value as Address)} />
        <ConnectButton />
      </div>
      {searches && (
        <div className={styles.recent}>
          <h3>Recent</h3>
          <div className={styles.recentItems}>
            {searches.map((id) => (
              <button
                onClick={() => handleSearch(id as Address)}
                className={styles.button}
                key={id}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
