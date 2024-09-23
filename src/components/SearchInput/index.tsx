import styles from "./searchInput.module.css";

const SearchInput = ({ search }: { search: (value: string) => void }) => {
  return (
    <input
      className={styles.input}
      onChange={(e) => search(e.target.value)}
    ></input>
  );
};
export default SearchInput;
