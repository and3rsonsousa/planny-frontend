import request, { gql } from "graphql-request";
import nookies from "nookies";
import useSWR from "swr";

export default function useUser(key, QUERY) {
  const { data, error } = useSWR(key, (url) => {
    return fetcher(url, QUERY);
  });

  const loading = !data && !error;
  const loggedOut =
    error && error.status === 403 && !nookies.get("planny").token;

  return {
    loading,
    loggedOut,
    data,
    error,
  };
}
const headers = { "Content-Type": "application/json" };
export async function fetcher(url, QUERY) {
  if (nookies.get("planny").token) {
    // return fetch(url, {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify({
    //     query: QUERY,
    //     variables: { id: nookies.get("planny").token },
    //   }),
    // }).then((r) => r.json());

    const data = await request(
      "https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
      QUERY,
      {
        id: nookies.get("planny").token,
      }
    );

    return data;
  }
  const error = new Error("Não autorizado");
  error.status = 403;
  throw error;
}
