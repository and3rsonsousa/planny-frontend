import { gql, useQuery } from "@apollo/client";
import nookies from "nookies";
import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ClientsBar from "../components/ClientsBar";

const Home = (props) => {
  const { data, loading, error } = useQuery(
    gql`
      query ($userId: ID!) {
        user(id: $userId) {
          id
          name
          email
          clients(sort: "name:asc") {
            id
            name
            instagram
            fgColor
            bgColor
            actions {
              id
              name
              description
              date
              status {
                id
                name
                slug
              }
              createdBy {
                id
                name
              }
              responsibles {
                id
                name
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        userId: nookies.get(null, "user").user,
      },
    }
  );

  if (error) return JSON.stringify(error, null, 4);

  return (
    <Authentication>
      <Layout data={data}>
        {loading && !data ? (
          <Loader />
        ) : (
          <div>
            <ClientsBar clients={data.user.clients} />
            <div>
              <h3>Status</h3>
              <div className="grid grid-cols-2"></div>
            </div>
            <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
              <pre>{JSON.stringify(data.user.clients, null, 2)}</pre>
            </div>
          </div>
        )}
      </Layout>
    </Authentication>
  );
};

export default Home;
