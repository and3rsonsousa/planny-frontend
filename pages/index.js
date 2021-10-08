import Head from "next/head";
import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ClientsBar from "../components/ClientsBar";
import Display from "../components/Display";
import { gql } from "graphql-request";
import nookies from "nookies";
import useGQL from "../lib/useGQL";
import { useState } from "react/cjs/react.development";
import { Dialog } from "@headlessui/react";

const Home = (props) => {
  const QUERY = gql`
    query ($userId: ID!) {
      user(id: $userId) {
        id
        name
        email
        clients(sort: "name:asc") {
          id
          name
          slug
          fgColor
          bgColor
          actions(sort: "date:asc") {
            id
            date
            name
            status {
              slug
            }
            tags {
              slug
            }
            client {
              slug
            }
          }
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

  const { data, loading, error } = useGQL(QUERY, {
    userId: nookies.get("planny").user,
  });

  const { user, statuses, tags } = data || {};

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

        {data && (
          <div>
            <Head>
              <title>{user.name} | Planny</title>
            </Head>
            {/* Barra superior com os Clients */}
            <ClientsBar clients={user.clients} />
            {/* Insight por Status e por Clientes */}
            <div className="lg:grid grid-cols-2 gap-8 mb-8">
              {/* Status */}
              <div className="my-4">
                <h3 className="text-gray-700">Status</h3>
                <div className="status-demo w-full">
                  {statuses.map((stat, index) => {
                    const count = stat.actions.length;

                    return count ? (
                      <div
                        className={`${stat.slug}-bg p-2 overflow-hidden flex-auto`}
                        key={index}
                        style={{
                          width: (count / 4) * 100 + "%",
                        }}
                      >
                        <div className="uppercase text-xx font-semibold tracking-widest flex justify-center relative ">
                          <div className="truncate overflow-ellipsis overflow-hidden ">
                            {stat.name}
                          </div>
                          ({stat.actions.length})
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              {/* Clientes */}
              <div className="my-4">
                <h3 className="text-gray-700">Clientes</h3>
                <div className="status-demo w-full">
                  {user.clients.map((client, index) => {
                    const count = client.actions.length;
                    return count ? (
                      <div
                        className={`p-2 overflow-hidden flex-auto`}
                        key={index}
                        style={{
                          width: (count / 4) * 100 + "%",
                          backgroundColor: client.bgColor || "#789",
                          color: client.fgColor || "#fff",
                        }}
                      >
                        <div className="uppercase text-xx font-semibold tracking-widest flex justify-center relative ">
                          <div className="truncate overflow-ellipsis overflow-hidden ">
                            {client.name}
                          </div>
                          ({client.actions.length})
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            {/* Ações */}
            <div className="mb-8">
              <Display clients={user.clients} tags={tags} statuses={statuses} />
            </div>
            {/* decode */}
            <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </Layout>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-xl p-8 max-w-xl mx-auto">
            <Dialog.Title>Teste</Dialog.Title>

            <Dialog.Description>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
              tenetur ex perferendis eligendi aut illum minima dolores delectus
              iure, qui iste aliquam quod totam. Saepe sapiente molestias maxime
              dolorum est.
            </Dialog.Description>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
              sequi ad. Dolore amet aperiam pariatur.
            </p>
            <p>
              Obcaecati non nam architecto aperiam maiores omnis. Temporibus
              numquam consectetur adipisci blanditiis, provident quidem sequi!
            </p>
            <p>
              Sit itaque blanditiis tempore quae exercitationem qui, veritatis
              nesciunt quo odio, asperiores labore dolor voluptate?
            </p>

            <button
              className="button button-small button-ghost"
              onClick={() => setShowDialog(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      </Dialog>
    </Authentication>
  );
};

export default Home;
