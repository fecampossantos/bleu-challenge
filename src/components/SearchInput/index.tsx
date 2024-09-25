import { useState, useEffect } from "react";
import styles from "./searchInput.module.css";
import SearchIcon from "../icons/search";
import { isValidHex } from "./utils";

const SearchInput = ({ search }: { search: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.length === 0) {
        setIsError(false);
        return;
      }
      if (!isValidHex(inputValue)) {
        setIsError(true);
        return;
      } else {
        setIsError(false);
        search(inputValue);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>
          <SearchIcon />
        </div>
      </div>
      <input
        placeholder="search pools by id"
        className={`${styles.input} ${isError && styles.error}`}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchInput;
