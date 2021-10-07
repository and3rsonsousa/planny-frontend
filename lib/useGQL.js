import useSWR from "swr";
import request, { GraphQLClient } from "graphql-request";
import nookies from "nookies";

const fetcher = async (QUERY, variables) => {
  const data = await request(
    "https://cryptic-beyond-85441.herokuapp.com/graphql",
    QUERY,
    variables || null,
    {
      Authorization: nookies.get("planny").token
        ? "Bearer " + nookies.get("planny").token
        : null,
    }
  );

  return data;
};

export default function useGQL(QUERY, variables) {
  const data = useSWR(QUERY, () => fetcher(QUERY, variables));
  return data;
}
