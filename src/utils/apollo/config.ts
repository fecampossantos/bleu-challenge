import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest",
  cache: new InMemoryCache(),
});

export default apolloClient;
