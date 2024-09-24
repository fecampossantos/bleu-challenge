import styles from "./menu.module.css";

import { useQuery, gql } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { useAccount } from "wagmi";

const GET_POOLS_BY_OWNER = gql`
  query GetPools($owner: String!) {
    pools(where: { owner: $owner }) {
      id
    }
  }
`;

const Menu = ({
  updatePoolId,
}: {
  updatePoolId: Dispatch<SetStateAction<any>>;
}) => {
  const { address } = useAccount();
  const { loading, error, data, ...rest } = useQuery(GET_POOLS_BY_OWNER, {
    variables: { owner: address },
  });

  function shortenId(id: string) {
    return id.slice(0, 4) + "..." + id.slice(-3);
  }

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
