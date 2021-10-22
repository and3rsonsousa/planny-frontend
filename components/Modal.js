import request, { gql } from "graphql-request";
import { Fragment, useEffect, useState } from "react";
import { Transition, Dialog, RadioGroup, Switch } from "@headlessui/react";

import useUser from "../lib/useUser";
import Loader from "./Loader";
import dayjs from "dayjs";
import Avatar from "./Avatar";
import {
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";

import tagsIcons from "../lib/tagsIcon";
import { useSWRConfig } from "swr";

export default function Modal({ showDialog, setShowDialog, actionToUpdate }) {
  if (!actionToUpdate) return false;
  const QUERY = `
    query ($id: ID!) {
      profile( where: {id: $id} ){
        id
      }
      action(where:{id:"${actionToUpdate}"}) {
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
      tags {
        id
        name
        slug
      }
    }
  `;
  const { mutate } = useSWRConfig();
  const { data, error } = useUser("/modal", QUERY);

  const { profile, profiles, action, accounts, steps, tags } = data || {};

  const [Action, setAction] = useState({
    id: "",
    name: "",
    description: "",
    date: dayjs(),
    account: "",
    profile_creator: "",
    profiles_responsible: "",
    step: "",
    tags: [],
    image: "",
  });

  useEffect(() => {
    if (action) {
      setAction(() => ({
        id: action.id,
        name: action.name,
        description: action.description,
        date: dayjs(action.date).format("YYYY-MM-DD"),
        time: dayjs(action.date).format("HH:mm:ss"),
        account: action.account.id,
        profile_creator: action.profile_creator.id,
        profiles_responsible: action.profiles_responsible,
        step: action.step.id,
        tags: action.tags,
      }));
    }
  }, [action]);

  function handleState(event) {
    const { name, value } = event.target;
    setAction(() => ({ ...Action, [name]: value }));
  }

  async function handleSubmit(method, id) {
    if (Action.name === "") {
      console.log("Você precisa inserir um Nome par a Ação.");
      return false;
    }
    if (Action.date === "" || Action.time === "") {
      console.log("Você precisa definir uma data e Hora para a ação.");
      return false;
    }
    if (Action.account === "") {
      console.log("Você precisa selecionar uma conta para essa ação.");
      return false;
    }
    if (Action.profiles_responsible.length === 0) {
      console.log(
        "Você precisa selecionar pelo menos um responsável por essa ação."
      );
      return false;
    }

    if (Action.tags.length === 0) {
      console.log("Você precisa selecionar pelo menos uma tag para essa ação.");
      return false;
    }

    const MUTATION_QUERY = gql`mutation{
      updateAction(where:{id:"${Action.id}"}, data:{name:"${
      Action.name
    }", description:"${Action.description || ""}", date: "${
      dayjs(Action.date + " " + Action.time).format("YYYY-MM-DD[T]HH:mm:ss") +
      "+00:00"
    }", account:{connect:{id:"${
      Action.account
    }"}}, profiles_responsible:{set:[${Action.profiles_responsible.map(
      (responsible) => '{id:"' + responsible.id + '"}'
    )}]}, step:{connect:{id:"${Action.step}"}}, tags:{set:[${Action.tags.map(
      (tag) => '{id:"' + tag.id + '"}'
    )}]} } ){
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
    }`;

    mutate(
      "/index",
      async (data) => {
        const result = await request(
          "https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
          MUTATION_QUERY
        );
        let actions = data.actions.map((action) =>
          action.id === result.updateAction.id ? result.updateAction : action
        );

        console.log(actions);
        return { ...data, actions };
      },
      false
    );

    setShowDialog(() => {
      mutate("index");
      return false;
    });
  }

  return (
    <ModalLayout showDialog={showDialog} setShowDialog={setShowDialog}>
      <div className="relative w-full max-w-2xl p-8 mx-auto bg-white shadow-2xl rounded-xl">
        {!data && <Loader />}
        {error && <Error>{JSON.stringify(error, null, 2)}</Error>}
        {data && (
          <>
            <form className="modal-form">
              {/* Name */}
              <div className="mb-8">
                <label>
                  <div>Nome</div>
                  <input
                    type="text"
                    className="text-xl input"
                    value={Action.name}
                    onChange={handleState}
                    placeholder="Nome da Ação"
                    name="name"
                    tabIndex={0}
                    autoFocus={true}
                  />
                </label>
              </div>
              {/* Description */}
              <div className="mb-8">
                <label>
                  <div>Descrição</div>
                  <textarea
                    rows={Action.description ? 4 : 1}
                    className="placeholder-gray-300 input"
                    placeholder={actionToUpdate ? "Sem descrição" : "Descrição"}
                    value={Action.description || ""}
                    onChange={handleState}
                    name="description"
                  />
                </label>
              </div>
              {/* Date and Time */}
              <div className="flex items-center mb-8 space-x-4">
                <div className="mt-4">
                  <HiOutlineCalendar className="w-6 h-6 text-gray-300" />
                </div>
                <label>
                  <div>Data</div>
                  <input
                    type="date"
                    className="input"
                    name="time"
                    value={Action.date}
                    onChange={handleState}
                  />
                </label>
                <div className="mt-4">
                  <HiOutlineClock className="w-6 h-6 text-gray-300" />
                </div>
                <label>
                  <div>Hora</div>
                  <input
                    type="time"
                    className="input"
                    name="time"
                    value={Action.time}
                    onChange={handleState}
                  />
                </label>
              </div>
              {/* Accounts */}
              <div className="mb-8">
                <label>
                  <div>Conta</div>
                </label>

                <RadioGroup
                  value={Action.account}
                  onChange={(value) => {
                    setAction(() => ({ ...Action, account: value }));
                  }}
                  name="account"
                  as="div"
                  className="flex items-center space-x-2"
                >
                  {accounts.map((account) => (
                    <RadioGroup.Option
                      key={account.id}
                      value={account.id}
                      name="account"
                      className="rounded-full outline-none cursor-pointer focus:ring-2 focus:ring-brand-600 ring-offset-2"
                    >
                      {({ checked }) => (
                        <div className="relative">
                          <Avatar avatar={account} medium={!checked} />
                          {checked ? (
                            <div className="absolute flex items-center justify-center text-green-400 transform bg-white rounded-full -bottom-2 -right-2 ">
                              <HiCheckCircle className="w-6 h-6" />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>

              {/* Profiles Responsible */}
              <div className="mb-8">
                <label>
                  <div>Responsáveis pela Ação</div>
                </label>

                <div className="flex items-center space-x-2">
                  {profiles.map((responsible, index) => {
                    const checked =
                      action && Action.profiles_responsible
                        ? Action.profiles_responsible.filter(
                            (profile_responsible) =>
                              profile_responsible.id === responsible.id
                          ).length > 0
                        : false;

                    return (
                      <Switch
                        onChange={() => {
                          setAction({
                            ...Action,
                            profiles_responsible: checked
                              ? Action.profiles_responsible.filter(
                                  (profile) => profile.id != responsible.id
                                )
                              : [
                                  ...Action.profiles_responsible,
                                  { id: responsible.id },
                                ],
                          });
                        }}
                        className="relative rounded-full outline-none cursor-pointer focus:ring-2 focus:ring-brand-600 ring-offset-2"
                        key={responsible.id}
                      >
                        <Avatar avatar={responsible} medium={!checked} />
                        {checked ? (
                          <div className="absolute flex items-center justify-center text-green-400 transform bg-white rounded-full -bottom-2 -right-2 ">
                            <HiCheckCircle className="w-6 h-6" />
                          </div>
                        ) : null}
                      </Switch>
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
                    setAction(() => ({ ...Action, step: value }))
                  }
                  name="step"
                  as="div"
                  className="grid items-center grid-cols-6 space-x-1"
                >
                  {steps.map((step) => (
                    <RadioGroup.Option
                      key={step.id}
                      value={step.id}
                      name="step"
                      className={`px-1 py-3 uppercase text-xs font-medium tracking-wider ${
                        step.id === Action.step
                          ? step.slug + "-bg "
                          : " bg-white text-gray-400"
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
                <div className="grid grid-cols-4 space-x-1 font-medium tracking-widest uppercase text-xx">
                  {tags.map((tag, index) => {
                    const selected =
                      Action.tags.filter((tg) => tg.id === tag.id).length > 0;
                    return (
                      <div
                        tabIndex={index}
                        key={tag.id}
                        className={`flex justify-center items-center cursor-pointer mb-1 py-2 px-3 rounded-2xl outline-none focus:ring-2 ring-offset-2 ring-brand-600 ${
                          selected ? tag.slug + "-bg" : "text-gray-400"
                        }`}
                        onClick={() => {
                          setAction(() => {
                            return {
                              ...Action,
                              tags: selected
                                ? Action.tags.filter((tg) => tg.id != tag.id)
                                : [...Action.tags, { id: tag.id }],
                            };
                          });
                        }}
                        title={tag.name}
                      >
                        <span>{tagsIcons(tag.slug)}</span>
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
            <button
              className="text-xs tracking-wider uppercase button button-ghost button-red"
              onClick={() => handleSubmit(3, Action.id)}
            >
              Deletar
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className="button button-ghost"
              onClick={() => setShowDialog(false)}
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

const ModalLayout = ({ children, showDialog, setShowDialog }) => (
  <Transition appear show={showDialog} as={Fragment}>
    <Dialog
      onClose={() => setShowDialog(false)}
      className="fixed inset-0 z-[9999] overflow-y-auto p-8"
    >
      <div className="flex items-center justify-center min-h-screen">
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
        <span className="inline-block h-screen align-middle" aria-hidden="true">
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
          {children}
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);
