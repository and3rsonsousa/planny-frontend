import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://cryptic-beyond-85441.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

export default client;
