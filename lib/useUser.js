import { gql } from "graphql-request";
import useGQL from "./useGQL";
import nookies from "nookies";

export default function useUser() {
  if (nookies.get("planny").user && nookies.get("planny").token) {
    const { data, error } = useGQL(
      gql`
        query User($userId: ID!) {
          user(id: $userId) {
            id
            name
          }
        }
      `,
      {
        userId: nookies.get("planny").user,
      }
    );

    const loading = !data && !error;

    return {
      loading,
      error,
      user: data,
    };
  } else {
    const error = new Error("No JWT Key");
    return {
      loading: false,
      error,
      user: null,
    };
  }
}
