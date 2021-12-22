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
      actions ( where: {profiles_responsible_some: { id: "${token}"}, account: {slug: "${slug}"}}, orderBy: date_DESC) { 
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
      accounts (orderBy: name_ASC) {
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
	let [actionToDuplicate, setActionToDuplicate] = useState(null);
	const { data, error, mutate } = useSWR(QUERY);

	const { profile, actions, accounts, steps, tags } = data || {};

	return (
		<>
			<Layout profile={profile} accounts={accounts}>
				<Head>
					<title>Carregando dados... | Planny</title>
				</Head>

				{!data && <Loader />}
				{error && <Error>{JSON.stringify(error, null, 2)}</Error>}

				{data && (
					<div>
						<Head>
							<title>{profile.accounts[0].name} | Planny</title>
						</Head>
						<div className="flex items-center space-x-4">
							<Avatar avatar={profile.accounts[0]} />
							<h2 className="mb-0 font-bold text-neutral-5">
								{profile.accounts[0].name}
							</h2>
						</div>
						{/* Insight por Status e por Clientes */}
						<div className="mb-8">
							{/* Status / Steps */}
							<StepsInsight steps={steps} />
						</div>
						<div>
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
					</div>
				)}
			</Layout>
			<Modal
				actionToUpdate={actionToUpdate}
				setActionToUpdate={setActionToUpdate}
				actionToDuplicate={actionToDuplicate}
				setActionToDuplicate={setActionToDuplicate}
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
