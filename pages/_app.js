import "../styles/global.css";
import { setContext } from "@apollo/client/link/context";
import nookies from "nookies";
import {
  createHttpLink,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://cryptic-beyond-85441.herokuapp.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = nookies.get("jwt");
  return {
    headers: {
      ...headers,
      Authorization: token.jwt ? `Bearer ${token.jwt}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
