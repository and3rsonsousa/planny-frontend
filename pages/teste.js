import request from "graphql-request";
import useSWR from "swr";

const fetcher = (query, variables) => {
  console.log(query, variables);
  return request(
    "https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
    query,
    variables
  );
};

export default function Teste() {
  return <div>teste</div>;
}
