import { useState, useEffect } from "react";
import styles from "./searchInput.module.css";

const SearchInput = ({ search }: { search: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);

  const isValidHex = (str: string) => /^0x[0-9a-fA-F]{64}$/.test(str);

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
        console.log(inputValue);
        search(inputValue);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, search]);

  return (
    <input
      className={`${styles.input} ${isError && styles.error}`}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
    ></input>
  );
};

export default SearchInput;
