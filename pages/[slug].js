import { useEffect, useState } from "react";
import Head from "next/head";
import { gql } from "graphql-request";
import useSWR from "swr";
import nookies from "nookies";
import dayjs from "dayjs";

import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Display from "../components/Display";
import Modal from "../components/Modal";
import { StepsInsight } from "../components/Insights";
import Avatar from "../components/Avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Account = () => {
  const router = useRouter();
  const slug = router.query.slug || null;
  if (!slug) {
    return null;
  }

  const token = nookies.get("planny").token;
  useEffect(() => {
    if (!token) {
      router.replace("/login");
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
        accounts(where: { slug: "${slug}" }) {
          id
          name
          slug
          colors {
            hex
          }
        }
      }
      actions ( where: {profiles_responsible_some: { id: "${token}"}, account: {slug: "${slug}"}}, orderBy: date_DESC ) { 
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
      accounts {
        id
        name
        slug
      }
      steps {
        id
        name
        slug
        actions (where: {profiles_responsible_some: { id: "${token}"}, account: {slug: "${slug}"}  }){
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
  const { data, error, mutate } = useSWR(QUERY);

  const { profile, actions, accounts, steps, tags } = data || {};

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
      x: 200,
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
      x: -200,
      transition: {
        duration: 0.5,
        easing: "circOut",
      },
    },
  };

  return (
    <>
      <Layout profile={profile} accounts={accounts}>
        <Head>
          <title>Carregando dados... | Planny</title>
        </Head>

        {!data && <Loader />}
        {error && <Error>{JSON.stringify(error, null, 2)}</Error>}

        {data && (
          <motion.div
            variants={container}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <Head>
              <title>{profile.accounts[0].name} | Planny</title>
            </Head>
            <motion.div
              className="flex items-center space-x-4"
              variants={fadeInLeft}
            >
              <Avatar avatar={profile.accounts[0]} />
              <h2 className="mb-0 font-bold text-neutral-5">
                {profile.accounts[0].name}
              </h2>
            </motion.div>
            {/* Insight por Status e por Clientes */}
            <motion.div className="mb-8" variants={fadeInRight}>
              {/* Status / Steps */}
              <StepsInsight steps={steps} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Display
                accounts={profile.accounts}
                actions={actions}
                tags={tags}
                steps={steps}
                mutate={mutate}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                setActionToUpdate={setActionToUpdate}
                setActionDate={setActionDate}
              />
            </motion.div>
          </motion.div>
        )}
      </Layout>
      <Modal
        actionToUpdate={actionToUpdate}
        setActionToUpdate={setActionToUpdate}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        mutatePage={mutate}
        actionDate={actionDate}
        account={profile ? profile.accounts[0] : null}
      />
    </>
  );
};

export default Account;
