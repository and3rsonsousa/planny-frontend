import { useRouter } from "next/router";
import nookies from "nookies";
import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";

const Client = (props) => {
  const router = useRouter();
  const { data, loading, error } = useQuery(
    gql`
      query ($userId: ID!, $slug: String!) {
        user(id: $userId) {
          id
          name
          email
          client: clients(where: { slug: $slug }) {
            id
            name
            fgColor
            bgColor
            slug
            actions {
              id
              name
              description
              date
              createdBy {
                id
                name
              }
              responsibles {
                id
                name
              }
              created_at
              updated_at
              status {
                id
                name
                slug
              }
            }
          }
          clients {
            id
            name
            slug
          }
        }
      }
    `,
    {
      variables: {
        userId: nookies.get(null, "user").user,
        slug: router.query.slug,
      },
    }
  );

  if (error) return JSON.stringify(error);

  return (
    <Authentication>
      <Layout data={data}>
        {loading && !data ? (
          <Loader />
        ) : (
          <div>
            <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
              <pre>{JSON.stringify(data.user, null, 2)}</pre>
            </div>
          </div>
        )}
      </Layout>
    </Authentication>
  );
};

export default Client;
