import { useEffect, useState } from "react";
import Head from "next/head";

import { gql } from "graphql-request";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Display from "../components/Display";
import useUser from "../lib/useUser";

const Account = ({ slug }) => {
  const QUERY = gql`
    query ($id: ID!) {
      profile(where: { id: $id }) {
        id
        name
        image {
          url(
            transformation: {
              image: { resize: { width: 50, height: 50, fit: clip } }
            }
          )
        }
        accounts(where: { slug: "${slug}" }) {
          id
          name
          slug
          colors {
            hex
          }
          actions(orderBy: date_DESC) {
            id
            date
            name
            description
            profiles_responsible {
              id
              name
              image {
                url(
                  transformation: {
                    image: { resize: { width: 50, height: 50, fit: clip } }
                  }
                )
              }
            }
            step {
              slug
              name
            }
            tags {
              id
              slug
              name
            }
            account {
              slug
              name
              colors {
                hex
              }
            }
          }
        }
      }
      steps {
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
      }
    }
  `;

  let [showDialog, setShowDialog] = useState(false);
  const { data, error, loggedOut } = useUser(QUERY);

  useEffect(() => {
    if (loggedOut) {
      Router.replace("/login");
    }
  }, [loggedOut]);

  if (loggedOut) return "Redirecionando...";

  const { profile, steps, tags } = data || {};

  return (
    <Layout profile={profile}>
      <Head>
        <title>Carregando dados... | Planny</title>
      </Head>
      {!data && <Loader />}
      {error && <Error>{JSON.stringify(error, null, 2)}</Error>}
      {data && (
        <Display
          accounts={profile.accounts}
          tags={tags}
          steps={steps}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      )}
    </Layout>
  );
};

export function getServerSideProps(ctx) {
  return {
    props: {
      slug: ctx.params.slug,
    },
  };
}

export default Account;
