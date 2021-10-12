import { useEffect, useState } from "react";
import Head from "next/head";
import nookies from "nookies";
import { gql } from "graphql-request";
import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Display from "../components/Display";
import useUser from "../lib/useUser";

const Client = (props) => {
  const QUERY = gql`
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
            tags {
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
      statuses {
        id
        name
        slug
        actions {
          id
        }
      }
      tags {
        id
        name
        slug
        color
      }
    }
  `;

  const { data, loading, error, mutate } = useUser(QUERY, {
    userId: nookies.get("planny").user,
    slug: props.instagram,
  });

  useEffect(() => {
    console.log(props);
    mutate();
  }, [props]);
  const { user, tags, statuses } = data || {};

  let [showDialog, setShowDialog] = useState(false);

  return (
    <Authentication>
      <Layout user={user}>
        <Head>
          <title>Carregando dados... | Planny</title>
        </Head>

        {loading && <Loader />}
        {error && (
          <div className="p-8 text-red-400 bg-red-900 rounded-2xl mb-12">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {user && (
          <Display
            clients={user.client}
            tags={tags}
            statuses={statuses}
            showDialog={showDialog}
            setShowDialog={setShowDialog}
          />
        )}
      </Layout>
    </Authentication>
  );
};

export function getServerSideProps(ctx) {
  return {
    props: {
      instagram: ctx.params.instagram,
    },
  };
}

export default Client;
