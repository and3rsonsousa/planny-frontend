import request, { gql } from "graphql-request";
import nookies from "nookies";
import useSWR from "swr";

export default function useUser(QUERY) {
  const { data, error, mutate } = useSWR(QUERY, () => {
    return fetcher(QUERY);
  });

  const loading = !data && !error;
  const loggedOut =
    error && error.status === 403 && !nookies.get("planny").token;

  return {
    loading,
    loggedOut,
    data,
    error,
    mutate,
  };
}
export async function fetcher(QUERY) {
  if (nookies.get("planny").token) {
    const data = await request(
      "https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
      QUERY
    );

    return data;
  }
  const error = new Error("Não autorizado");
  error.status = 403;
  throw error;
}
