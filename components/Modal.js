import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import request, { gql } from "graphql-request";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { RadioGroup } from "@headlessui/react";
import nookies from "nookies";
import {
	HiCheckCircle,
	HiOutlineCalendar,
	HiOutlineClock,
} from "react-icons/hi";

import Loader from "./Loader";
import Avatar from "./Avatar";
import tagsIcons from "../lib/tagsIcon";
import { deleteAction } from "../lib/mutations";

dayjs.locale("pt-br");

export default function Modal({
	showDialog,
	setShowDialog,
	actionToUpdate,
	setActionToUpdate,
	actionToDuplicate,
	setActionToDuplicate,
	mutatePage,
	actionDate,
	account,
}) {
	let QUERY = "";

	if (actionToUpdate || actionToDuplicate) {
		QUERY = gql`{
      profile( where: {id: "${nookies.get("planny").token}"} ){
        id
        accounts{
          id
          name
          slug
          colors{
            hex
          }
        }
      }
      action(where:{id:"${actionToUpdate || actionToDuplicate}"}) {
        id
        date
        name
        description
        profile_creator{
          id
          name
          image {
            url(
              transformation: {
                image: { resize: { width: 70, height: 70, fit: clip } }
              }
            )
          }
        }
        profiles_responsible {
          id
        }
        step {
          id
          slug
          name
        }
        tags {
          id
          name
          slug
        }
        account{
          id
          slug
          name
          colors {
            hex
          }
        }
      }
        
      accounts(orderBy: name_ASC){
        id
        name
        slug
        colors{
          hex
        }
      }
      
      profiles{
        id
        name
        image {
          url(
            transformation: {
              image: { resize: { width: 70, height: 70, fit: clip } }
            }
          )
        }
      }
          
      steps {
        id
        name
        slug
        
      }
      tags (orderBy: name_ASC ){
        id
        name
        slug
      }
    }
    `;
	} else {
		QUERY = gql`{
      profile( where: {id: "${nookies.get("planny").token}"} ){
        id
        accounts{
          id
          name
          slug
          colors{
            hex
          }
        }
      }   
      accounts(orderBy: name_ASC){
        id
        name
        slug
        colors{
          hex
        }
      }
      
      profiles{
        id
        name
        image {
          url(
            transformation: {
              image: { resize: { width: 70, height: 70, fit: clip } }
            }
          )
        }
      }
      
      steps {
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
    `;
	}

	const { data, error } = useSWR(QUERY);
	const ta = useRef(null);

	const { profile, profiles, action, accounts, steps, tags } = data || {};

	const emptyState = {
		id: actionDate,
		name: "",
		description: "",
		date: actionDate || "",
		account: account || "",
		profile_creator: "",
		profiles_responsible: [],
		step: "",
		tags: [],
		clientOnly: true,
	};
	const [Action, setAction] = useState(emptyState);
	const [showFullDescription, setShowFullDescription] = useState(false);

	useEffect(() => {
		if (action && actionToUpdate) {
			setAction(() => ({
				id: action.id,
				name: action.name,
				description: action.description || "",
				date: dayjs(action.date).format(
					"YYYY-MM-DD[T]HH:mm:ss[-03:00]"
				),
				account: action.account,
				profile_creator: action.profile_creator.id,
				profiles_responsible: action.profiles_responsible,
				step: action.step,
				tags: action.tags,
				clientOnly: true,
			}));
		} else if (action && actionToDuplicate) {
			setAction(() => ({
				name: action.name,
				description: action.description || "",
				date: dayjs(action.date).format(
					"YYYY-MM-DD[T]HH:mm:ss[-03:00]"
				),
				account: action.account,
				profile_creator: action.profile_creator.id,
				profiles_responsible: action.profiles_responsible,
				step: action.step,
				tags: action.tags,
				clientOnly: true,
			}));
		} else if (profile && profiles) {
			setAction(() => ({
				...Action,
				account:
					profile.accounts.length === 1
						? profile.accounts[0]
						: account || "",
				date: actionDate,
				profile_creator: profile.id,
				profiles_responsible: profiles.filter(
					(_profile) => _profile.id === profile.id
				),
				step: steps[0],
			}));
		}
	}, [data, actionDate]);

	function handleState(event) {
		const { name, value } = event.target;
		setAction(() => ({ ...Action, [name]: value }));
	}

	function handleClose() {
		setActionToUpdate(null);
		setActionToDuplicate(null);
		setShowDialog(false);
		setAction(emptyState);
	}

	async function handleSubmit(method, id) {
		let MUTATION_QUERY = "";
		let variables = {};
		//Deletar a A????o
		if (method === 3) {
			deleteAction(Action, mutatePage, handleClose);
			return false;
		} else {
			if (Action.name === "") {
				alert("Voc?? precisa inserir um Nome para a A????o.");
				return false;
			}
			if (Action.date === "" || Action.time === "") {
				alert("Voc?? precisa definir uma data e Hora para a a????o.");
				return false;
			}
			if (Action.account === "") {
				alert("Voc?? precisa selecionar uma conta para essa a????o.");
				return false;
			}
			if (Action.profiles_responsible.length === 0) {
				alert(
					"Voc?? precisa selecionar pelo menos um respons??vel por essa a????o."
				);
				return false;
			}
			if (Action.tags.length === 0) {
				alert(
					"Voc?? precisa selecionar pelo menos uma tag para essa a????o."
				);
				return false;
			}

			// Mutation para inserir
			if (method === 1) {
				MUTATION_QUERY = `mutation($name: String!, $description: String!, $date:  DateTime!, $account: ID!, $creator: ID!, $responsibles:  [ProfileWhereUniqueInput!], $step:  ID!, $tags:  [TagWhereUniqueInput!]){
          createAction( data:  {name: $name, description: $description, date: $date, account: {connect: {id: $account}}, profile_creator: {connect: {id: $creator}}, profiles_responsible: {connect: $responsibles}, step: {connect: {id: $step}}, tags: {connect: $tags}}){
            id
          }
        }`;
				if (!profile.id) {
					alert("proifle.id n??o est?? definido");
					return false;
				}
				variables = {
					name: Action.name,
					description: Action.description,
					date: Action.date,
					account: Action.account.id,
					creator: profile.id,
					responsibles: Action.profiles_responsible.map(
						(responsible) => ({
							id: responsible.id,
						})
					),
					step: Action.step.id,
					tags: Action.tags.map((tag) => ({ id: tag.id })),
				};

				//Atualiza a UI OPTIMISTIC
				mutatePage((data) => {
					return { ...data, actions: [...data.actions, Action] };
				}, false);
				//Mutation para atualizar
			} else if (method === 2) {
				MUTATION_QUERY = `mutation($id:ID!, $name: String!, $description: String!, $date:  DateTime!, $account: ID!, $responsibles:  [ProfileWhereUniqueInput!], $step:  ID!, $tags:  [TagWhereUniqueInput!]){
          updateAction( where: {id: $id} data:  {name: $name, description: $description, date: $date, account: {connect: {id: $account}} profiles_responsible: {set: $responsibles}, step: {connect: {id: $step}}, tags: {set: $tags}}){
            id
          }
        }`;
				variables = {
					id: Action.id,
					name: Action.name,
					description: Action.description,
					date: Action.date,
					account: Action.account.id,
					responsibles: Action.profiles_responsible.map(
						(responsible) => ({
							id: responsible.id,
						})
					),
					step: Action.step.id,
					tags: Action.tags.map((tag) => ({ id: tag.id })),
				};

				//Atualiza a UI OPTIMISTIC
				mutatePage((data) => {
					const index = data.actions.findIndex(
						(action) => action.id === Action.id
					);
					let actions = data.actions;
					actions[index] = Action;
					return { ...data, actions };
				}, false);
			}
		}

		// Esconde o Modal
		handleClose();
		//Faz a muta????o de acordo com o method
		const result = await request(
			"https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
			MUTATION_QUERY,
			variables
		);
		//Atualiza o cache local com os dados diretamente do Banco de dados.
		mutatePage();
	}

	return (
		<ModalLayout showDialog={showDialog} handleClose={handleClose}>
			<div className="relative w-full max-w-2xl p-8 mx-auto bg-white shadow-2xl rounded-xl">
				{!data && (
					<div className="mb-8">
						<Loader />
					</div>
				)}
				{error && <Error>{JSON.stringify(error, null, 2)}</Error>}
				{data && (
					<>
						<form className="modal-form">
							{/* <pre>{JSON.stringify(Action, null, 2)}</pre> */}
							{/* Name */}
							<div className="mb-8">
								<label>
									<div>Nome</div>
									<input
										type="text"
										className="text-xl input"
										value={Action.name}
										onChange={handleState}
										placeholder="Nome da A????o"
										name="name"
										tabIndex={0}
										autoFocus={true}
									/>
								</label>
							</div>

							{/* Description */}
							<div className="mb-8">
								<label>
									<div>Descri????o</div>
									<textarea
										ref={ta}
										rows={Action.description ? 4 : 1}
										className="placeholder-neutral-3 input"
										placeholder={
											actionToUpdate
												? "Sem descri????o"
												: "Descri????o"
										}
										value={Action.description || ""}
										onChange={handleState}
										name="description"
									/>
								</label>

								<div className="flex justify-end text-sm ">
									{Action.description ? (
										showFullDescription ? (
											<button
												onClick={() => {
													setShowFullDescription(
														false
													);
													ta.current.rows = 4;
												}}
											>
												Mostrar apenas o esssencial
											</button>
										) : (
											<button
												onClick={(event) => {
													event.preventDefault();
													setShowFullDescription(
														true
													);
													let i = 4;
													while (
														ta.current
															.clientHeight <
															ta.current
																.scrollHeight &&
														i < 40
													) {
														i++;
														ta.current.rows = i;
													}
												}}
											>
												Mostrar tudo
											</button>
										)
									) : null}
								</div>
							</div>
							{/* Date and Time */}
							<div className="flex items-center mb-8 space-x-4">
								<div className="mt-4">
									<HiOutlineCalendar className="w-6 h-6 text-neutral-3" />
								</div>
								<label>
									<div>Data</div>

									<input
										type="date"
										className="input"
										name="date"
										value={dayjs(Action.date).format(
											"YYYY-MM-DD"
										)}
										onChange={(event) => {
											setAction(() => {
												return {
													...Action,
													date:
														dayjs(
															event.target.value
														).format("YYYY-MM-DD") +
														"T" +
														dayjs(
															Action.date
														).format("HH:mm:ss") +
														"-03:00",
												};
											});
										}}
									/>
								</label>

								<div className="mt-4">
									<HiOutlineClock className="w-6 h-6 text-neutral-3" />
								</div>
								<label>
									<div>Hora</div>
									<input
										type="time"
										className="input"
										name="time"
										value={dayjs(Action.date).format(
											"HH:mm:ss"
										)}
										onChange={(event) => {
											setAction(() => {
												return {
													...Action,
													date:
														dayjs(
															Action.date
														).format("YYYY-MM-DD") +
														"T" +
														dayjs(
															dayjs(
																Action.date
															).format(
																"YYYY-MM-DD"
															) +
																" " +
																event.target
																	.value
														).format("HH:mm:ss") +
														"-03:00",
												};
											});
										}}
									/>
								</label>
							</div>
							{/* Accounts */}
							<div className="mb-8">
								<label>
									<div>Conta</div>
								</label>
								<div className="flex items-center space-x-2">
									{accounts ? (
										profile.accounts.length === 1 ? (
											<div className="relative rounded-full outline-none cursor-pointer focus:ring-2 focus:ring-brand-600 ring-offset-2">
												<Avatar
													avatar={profile.accounts[0]}
												/>
												<div className="absolute flex items-center justify-center text-green-400 transform bg-white rounded-full -bottom-2 -right-2 ">
													<HiCheckCircle className="w-6 h-6" />
												</div>
											</div>
										) : (
											accounts.map((account, index) => {
												const checked =
													Action.account &&
													account.id ===
														Action.account.id;
												return (
													<div
														onClick={() => {
															setAction({
																...Action,
																account,
															});
														}}
														className="relative rounded-full outline-none cursor-pointer focus:ring-2 focus:ring-brand-600 ring-offset-2"
														key={account.id}
														tabIndex={index + 1}
													>
														<Avatar
															avatar={account}
															medium={!checked}
														/>
														{checked ? (
															<div className="absolute flex items-center justify-center text-green-400 transform bg-white rounded-full -bottom-2 -right-2 ">
																<HiCheckCircle className="w-6 h-6" />
															</div>
														) : null}
													</div>
												);
											})
										)
									) : null}
								</div>
							</div>

							{/* Profiles Responsible */}
							<div className="mb-8">
								<label>
									<div>Respons??veis pela A????o</div>
								</label>

								<div className="flex items-center space-x-2">
									{profiles.map((responsible) => {
										const checked =
											Action.profiles_responsible
												? Action.profiles_responsible.filter(
														(profile_responsible) =>
															profile_responsible.id ===
															responsible.id
												  ).length > 0
												: false;

										return (
											<div
												onClick={() => {
													setAction({
														...Action,
														profiles_responsible:
															checked
																? Action.profiles_responsible.filter(
																		(
																			profile
																		) =>
																			profile.id !=
																			responsible.id
																  )
																: [
																		...Action.profiles_responsible,
																		{
																			id: responsible.id,
																		},
																  ],
													});
												}}
												className="relative rounded-full outline-none cursor-pointer focus:ring-2 focus:ring-brand-600 ring-offset-2"
												key={responsible.id}
											>
												<Avatar
													avatar={responsible}
													medium={!checked}
												/>
												{checked ? (
													<div className="absolute flex items-center justify-center text-green-400 transform bg-white rounded-full -bottom-2 -right-2 ">
														<HiCheckCircle className="w-6 h-6" />
													</div>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
							{/* Steps / Status */}
							<div className="mb-8">
								<label>
									<div>Status</div>
								</label>
								<RadioGroup
									value={Action.step}
									onChange={(value) =>
										setAction(() => ({
											...Action,
											step: value,
										}))
									}
									name="step"
									as="div"
									className="grid items-center grid-cols-6 space-x-1"
								>
									{Action.step &&
										steps.map((step) => (
											<RadioGroup.Option
												key={step.id}
												value={step}
												name="step"
												className={`px-1 py-3 uppercase text-xs font-medium tracking-wider ${
													step.id === Action.step.id
														? step.slug + "-bg "
														: " bg-white text-neutral-4"
												} text-center cursor-pointer outline-none focus:ring-2 ring-offset-2 ring-brand-600 rounded-xl`}
											>
												{step.name}
											</RadioGroup.Option>
										))}
								</RadioGroup>
							</div>
							{/* Tags */}
							<div className="mb-8">
								<label>
									<div>Tags</div>
								</label>
								<div className="grid grid-cols-5 space-x-1 font-medium tracking-widest uppercase text-xx">
									{Action.tags &&
										tags.map((tag) => {
											const selected =
												Action.tags.filter(
													(tg) => tg.id === tag.id
												).length > 0;
											return (
												<div
													tabIndex={tag.id}
													key={tag.id}
													className={`flex justify-center items-center cursor-pointer mb-1 py-2 px-3 rounded-2xl outline-none focus:ring-2 ring-offset-2 ring-brand-600 ${
														selected
															? tag.slug + "-bg"
															: "text-neutral-4"
													}`}
													onClick={() => {
														setAction(() => {
															let tags = selected
																? Action.tags.filter(
																		(tg) =>
																			tg.id !=
																			tag.id
																  )
																: [
																		...Action.tags,
																		tag,
																  ];
															return {
																...Action,
																tags,
															};
														});
													}}
													title={tag.name}
												>
													<span>
														{tagsIcons(
															tag.slug,
															"text-base mr-2"
														)}
													</span>
													<span>{tag.name}</span>
												</div>
											);
										})}
								</div>
							</div>
						</form>
					</>
				)}

				<div className="flex items-center justify-between w-full pt-8 border-t">
					<div>
						{/* {actionToUpdate && (
							<button
								className="text-xs tracking-wider uppercase button button-ghost button-red"
								onClick={() => handleSubmit(3, Action.id)}
							>
								Deletar
							</button>
						)} */}
					</div>
					<div className="flex space-x-2">
						<button
							className="button button-ghost"
							onClick={() => handleClose()}
						>
							Fechar
						</button>
						<button
							className="button button-primary"
							onClick={() => handleSubmit(actionToUpdate ? 2 : 1)}
						>
							{actionToUpdate ? "Atualizar" : "Inserir"}
						</button>
					</div>
				</div>
			</div>
		</ModalLayout>
	);
}

const ModalLayout = ({ children, showDialog, handleClose }) => {
	useEffect(() => {
		document.addEventListener("keydown", function (event) {
			if (event.code === "Escape") {
				handleClose();
			}
		});
	}, []);

	return (
		<div
			className={`fixed inset-0 z-[9999] overflow-y-auto p-8 h-screen duration-500 ${
				showDialog ? "visible" : "invisible"
			}`}
		>
			<div
				className={`fixed inset-0 bg-neutral-5 bg-opacity-80 transition-opacity duration-300 ${
					showDialog ? "opacity-100" : "opacity-0"
				}`}
				onClick={() => {
					handleClose();
				}}
			></div>
			<div
				className={`${
					showDialog
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-4"
				} transition-all duration-500 max-w-2xl mx-auto`}
			>
				{children}
			</div>
		</div>
	);
};
