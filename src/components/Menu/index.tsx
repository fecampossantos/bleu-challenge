import styles from "./menu.module.css";

import { useQuery } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { useAccount } from "wagmi";
import { GET_POOLS_BY_OWNER } from "./constants";
import { shortenId } from "./utils";

const Menu = ({
  updatePoolId,
}: {
  updatePoolId: Dispatch<SetStateAction<any>>;
}) => {
  const { address } = useAccount();
  const { loading, error, data } = useQuery(GET_POOLS_BY_OWNER, {
    variables: { owner: address },
  });

  const getContent = (loading: boolean, error: any, data: any) => {
    if (loading) return <>...</>;
    if (error) return <i>something went wrong</i>;
    if (data && "pools" in data && data.pools.length > 0) {
      return (
        <>
          {data?.pools?.map(({ id }: { id: string }) => (
            <button
              onClick={() => {
                updatePoolId(id);
              }}
              className={styles.menuItem}
              key={id}
            >
              {shortenId(id)}
            </button>
          ))}
        </>
      );
    } else {
      return <i>no pools</i>;
    }
  };

  return (
    <div className={styles.sideMenu}>
      <h3>Your pools</h3>

      <div className={styles.menuItems}>{getContent(loading, error, data)}</div>
    </div>
  );
};

export default Menu;
