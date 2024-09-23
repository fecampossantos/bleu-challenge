import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./header.module.css";
import SearchInput from "../SearchInput";
import { useEffect, useState } from "react";

const Header = ({ search }: { search: (value: string) => void }) => {
  const [searches, setSearches] = useState<Array<string>>();

  const KEY = "@bleu-task-recent-searches";

  useEffect(() => {
    const previousSearches = localStorage.getItem(KEY);
    if (previousSearches) setSearches(previousSearches.split(","));
  }, []);

  const addToRecentSearches = (value: string) => {
    const previousSearches = localStorage.getItem(KEY);
    if (previousSearches) {
      const newSearches = [value, ...previousSearches.split(",")].filter(
        function (item, pos, self) {
          return self.indexOf(item) == pos;
        }
      );
      localStorage.setItem(KEY, newSearches.splice(0, 5).join(","));
    } else {
      localStorage.setItem(KEY, value);
    }
  };

  const handleSearch = (value: string) => {
    addToRecentSearches(value);
    search(value);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <SearchInput search={(value) => handleSearch(value)} />
        <ConnectButton />
      </div>
      {searches && (
        <div className={styles.recent}>
          <h3>Historico</h3>
          <div className={styles.recentItems}>
            {searches.map((id) => (
              <button
                onClick={() => handleSearch(id)}
                className={styles.button}
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
