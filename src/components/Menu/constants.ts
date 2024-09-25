import { gql } from "@apollo/client";

export const GET_POOLS_BY_OWNER = gql`
  query GetPools($owner: String!) {
    pools(where: { owner: $owner }) {
      id
    }
  }
`;
