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
	const { data, error, mutate, isValidating } = useSWR(QUERY);
	const { profile, actions, accounts, steps, tags } = data || [];

	return (
		<>
			<Layout profile={profile} isValidating={isValidating}>
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
						<div>
							{/* Insight por Status e por Clientes */}
							<div
								className={`grid-cols-2 gap-8 items-center mb-8 ${
									profile.accounts.length > 0 ? "lg:grid" : ""
								}`}
							>
								{profile.accounts.length > 1 ? (
									<div className="col-span-2">
										<AccountsBar
											accounts={profile.accounts}
										/>
									</div>
								) : (
									<h1 className="font-bold text-brand-700">
										{profile.accounts[0].name}
									</h1>
								)}
								{/* Status / Steps */}
								<div>
									<StepsInsight steps={steps} />
								</div>
								{/* Contas / Accounts */}
								{profile.accounts.length > 1 && (
									<div>
										<AccountsInsight
											accounts={accounts}
											actions={actions}
										/>
									</div>
								)}
							</div>
							{/* Ações / Display */}
							<div className="mb-8">
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
							</div>
							{/* decode */}
							{/* <div className="p-8 mb-12 bg-neutral-5 text-brand-400 rounded-2xl">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
						</div>
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
