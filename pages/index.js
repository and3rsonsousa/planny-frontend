import { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import { gql } from "graphql-request";
import Router from "next/router";

import useUser from "../lib/useUser";

import Layout from "../components/Layout";
import Loader from "../components/Loader";
import AccountsBar from "../components/AccountsBar";
import Display from "../components/Display";
import Error from "../components/Error";
import { AccountsInsight, StepsInsight } from "../components/Insights";
import Modal from "../components/Modal";
import { useSWRConfig } from "swr";

const Home = () => {
  const QUERY = `
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
        accounts(orderBy: name_ASC) {
          id
          name
          slug
          colors {
            hex
          }
        }
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
  let [actionToUpdate, setActionToUpdate] = useState(null);
  const { data, error, loggedOut } = useUser("/index", QUERY);
  console.log(data);

  useEffect(() => {
    if (loggedOut) {
      Router.replace("/login");
    }
  }, [loggedOut]);

  if (loggedOut) return "Redirecionando...";

  const { profile, actions, steps, tags } = data || {};

  return (
    <>
      <Layout profile={profile}>
        <Head>
          <title>Carregando dados... | Planny</title>
        </Head>
        {!data && <Loader />}
        {error && <Error>{JSON.stringify(error, null, 2)}</Error>}
        {data && (
          <>
            {/* Insere o título na página */}
            <Head>
              <title>{profile.name} | Planny II</title>
            </Head>
            {/* Barra superior com os Clients */}
            <AccountsBar accounts={profile.accounts} />
            <>
              {/* Insight por Status e por Clientes */}
              <div className="grid-cols-2 gap-8 mb-8 lg:grid">
                {/* Status / Steps */}
                <StepsInsight steps={steps} />
                {/* Contas / Accounts */}
                <AccountsInsight
                  accounts={profile.accounts}
                  actions={actions}
                />
              </div>
              {/* Ações / Display */}
              <div className="mb-8">
                <Display
                  accounts={profile.accounts}
                  actions={actions}
                  tags={tags}
                  steps={steps}
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  setActionToUpdate={setActionToUpdate}
                />
              </div>
              {/* decode */}
              {/* <div className="p-8 mb-12 bg-gray-800 text-brand-400 rounded-2xl">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
            </>
          </>
        )}
      </Layout>
      {/* Modal */}
      <Modal
        actionToUpdate={actionToUpdate}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </>
  );
};

export default Home;
