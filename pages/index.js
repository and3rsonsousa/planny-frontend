import { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import { gql } from "graphql-request";
import { Dialog, Transition } from "@headlessui/react";
import Router from "next/router";

import useUser from "../lib/useUser";

import Authentication from "../components/Authentication";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ClientsBar from "../components/ClientsBar";
import Display from "../components/Display";

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
            description
            status {
              slug
              name
            }
            tags {
              id
              slug
              name
            }
            client {
              slug
              name
              bgColor
              fgColor
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
  let [showDialog, setShowDialog] = useState(false);
  const { data, error, loggedOut } = useUser(QUERY);

  useEffect(() => {
    if (loggedOut) {
      Router.replace("/login");
    }
  }, [loggedOut]);

  if (loggedOut) return "Redirecionando...";

  const { user, statuses, tags } = data || {};

  return (
    <Layout user={user}>
      <Head>
        <title>Carregando dados... | Planny</title>
      </Head>
      {!data && <Loader />}
      {error && (
        <div className="p-8 text-red-400 bg-red-900 rounded-2xl mb-12">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {data && (
        <div>
          <Head>
            <title>{user.name} | Planny II</title>
          </Head>
          {/* Barra superior com os Clients */}
          <ClientsBar clients={user.clients} />
        </div>
      )}
    </Layout>
  );

  return (
    <Authentication>
      <Layout user={user}>
        {data && (
          <div>
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
                        <div className="uppercase text-xx font-semibold tracking-wider flex justify-center relative ">
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
                        <div className="uppercase text-xx font-semibold tracking-wider flex justify-center relative ">
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
              <Display
                clients={user.clients}
                tags={tags}
                statuses={statuses}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
              />
            </div>
            {/* decode */}
            {/* <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
          </div>
        )}
      </Layout>
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog
          onClose={() => setShowDialog(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle sca"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500 transform"
              enterFrom="opacity-0 translate-y-4 "
              enterTo="opacity-100 translate-y-0 "
              leave="ease-in duration-200 transform"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4 "
            >
              <div className="relative bg-white rounded-xl p-8 max-w-xl mx-auto shadow-2xl">
                <Dialog.Title>Teste</Dialog.Title>

                <Dialog.Description>
                  {" "}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
                  tenetur ex perferendis eligendi aut illum minima dolores
                  delectus iure, qui iste aliquam quod totam. Saepe sapiente
                  molestias maxime dolorum est.
                </Dialog.Description>

                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
                  sequi ad. Dolore amet aperiam pariatur.
                </p>
                <p>
                  Obcaecati non nam architecto aperiam maiores omnis. Temporibus
                  numquam consectetur adipisci blanditiis, provident quidem
                  sequi!
                </p>
                <p>
                  Sit itaque blanditiis tempore quae exercitationem qui,
                  veritatis nesciunt quo odio, asperiores labore dolor
                  voluptate?
                </p>

                <button
                  className="button button-small button-ghost"
                  onClick={() => setShowDialog(false)}
                >
                  Fechar
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Authentication>
  );
};

export default Home;
