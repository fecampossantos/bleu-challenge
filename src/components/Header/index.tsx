import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./header.module.css";
import SearchInput from "../SearchInput";

const Header = ({ search }: { search: (value: string) => void }) => {
  return (
    <div className={styles.header}>
      <SearchInput search={search} />
      <ConnectButton />
    </div>
  );
};

export default Header;
