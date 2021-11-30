import { useState, useEffect } from "react";
import Head from "next/head";
import { gql } from "graphql-request";
import Router from "next/router";

import Layout from "../components/Layout";
import Loader from "../components/Loader";
import AccountsBar from "../components/AccountsBar";
import Display from "../components/Display";
import Error from "../components/Error";
import { AccountsInsight, StepsInsight } from "../components/Insights";
import Modal from "../components/Modal";
import useSWR from "swr";
import nookies from "nookies";
import dayjs from "dayjs";

import { motion } from "framer-motion";

const Home = () => {
  const token = nookies.get("planny").token;
  useEffect(() => {
    if (!token) {
      Router.replace("/login");
    }
  }, []);

  const QUERY = gql`{ 
      profile(where: { id: "${token}" }) {
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
      actionsConnection{
        aggregate{
          count
        }
      }
      actions(where: {profiles_responsible_some: { id: "${token}"}  }, orderBy: date_DESC, first: 3000) { 
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
          id
          slug
          name
          colors {
            hex
          }
        }
      }

      accounts(orderBy:name_ASC){
        id
        name
        slug
        colors {
            hex
          }
        actions{
          id
        }
      }

      steps {
        id
        name
        slug
        actions (where: {profiles_responsible_some: { id: "${token}"}  }){
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
  let [actionDate, setActionDate] = useState(
    dayjs().format("YYYY-MM-DD[T]HH:mm:ss[-03:00]")
  );
  let [actionToUpdate, setActionToUpdate] = useState(null);
  let [actionToDuplicate, setActionToDuplicate] = useState(null);
  const { data, error, mutate } = useSWR(QUERY);
  const { profile, actions, accounts, steps, tags } = data || [];

  const container = {
    enter: { transition: { staggerChildren: 0.2 } },
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    enter: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.5,
        easing: "circOut",
      },
    },
  };
  const fadeInLeft = {
    initial: { opacity: 0, x: -100 },
    enter: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: {
      opacity: 0,
      x: -200,
      transition: {
        duration: 0.5,
        easing: "circOut",
      },
    },
  };
  const fadeInRight = {
    initial: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.5,
        easing: "circOut",
      },
    },
  };

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
            {/* Barra superior com as Contas
            Caso seja apenas uma conta associada, mostra o nome da Conta
             */}
            <motion.div
              initial="initial"
              animate="enter"
              exit="exit"
              variants={container}
            >
              {/* Insight por Status e por Clientes */}
              <div
                className={`grid-cols-2 gap-8 items-center mb-8 ${
                  profile.accounts.length > 0 ? "lg:grid" : ""
                }`}
              >
                {profile.accounts.length > 1 ? (
                  <motion.div className="col-span-2" variants={fadeInUp}>
                    <AccountsBar accounts={profile.accounts} />
                  </motion.div>
                ) : (
                  <motion.h1
                    className="font-bold text-brand-700"
                    variants={fadeInUp}
                  >
                    {profile.accounts[0].name}
                  </motion.h1>
                )}
                {/* Status / Steps */}
                <motion.div variants={fadeInLeft}>
                  <StepsInsight steps={steps} />
                </motion.div>
                {/* Contas / Accounts */}
                {profile.accounts.length > 1 && (
                  <motion.div variants={fadeInRight}>
                    <AccountsInsight accounts={accounts} actions={actions} />
                  </motion.div>
                )}
              </div>
              {/* Ações / Display */}
              <motion.div className="mb-8" variants={fadeInUp}>
                <Display
                  accounts={profile.accounts}
                  actions={actions}
                  tags={tags}
                  steps={steps}
                  mutate={mutate}
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  setActionToUpdate={setActionToUpdate}
                  setActionToDuplicate={setActionToDuplicate}
                  setActionDate={setActionDate}
                />
              </motion.div>
              {/* decode */}
              {/* <div className="p-8 mb-12 bg-neutral-5 text-brand-400 rounded-2xl">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
            </motion.div>
          </>
        )}
      </Layout>
      {/* Modal */}
      <Modal
        actionToUpdate={actionToUpdate}
        setActionToUpdate={setActionToUpdate}
        actionToDuplicate={actionToDuplicate}
        setActionToDuplicate={setActionToDuplicate}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        mutatePage={mutate}
        actionDate={actionDate}
      />
    </>
  );
};

export default Home;
