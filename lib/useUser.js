import request, { gql } from "graphql-request";
import nookies from "nookies";
import useSWR from "swr";

export default function useUser(QUERY) {
  const { data, mutate, error } = useSWR([QUERY], (QUERY) =>
    userFetcher(QUERY)
  );

  const loading = !data && !error;
  const loggedOut =
    error &&
    error.status === 403 &&
    !(nookies.get("planny").user && nookies.get("planny").token);

  return {
    loading,
    loggedOut,
    data,
    error,
    mutate,
  };
}

async function userFetcher(QUERY) {
  if (nookies.get("planny").user && nookies.get("planny").token) {
    return await request(
      "https://cryptic-beyond-85441.herokuapp.com/graphql",
      QUERY,
      {
        userId: nookies.get("planny").user,
      },
      {
        Authorization: nookies.get("planny").token
          ? "Bearer " + nookies.get("planny").token
          : null,
      }
    );
  }
  const error = new Error("Não autorizado");
  error.status = 403;
  throw error;
}
