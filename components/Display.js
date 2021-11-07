import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/pt-br";
import { RadioGroup, Listbox, Transition, Switch } from "@headlessui/react";
import {
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFilter,
  HiOutlineViewList,
  HiPlus,
  HiX,
} from "react-icons/hi";
import { MdOutlineGridOn } from "react-icons/md";
import { CgBoard } from "react-icons/cg";
import Action from "./Action";
import Avatar from "./Avatar";
import { StepName } from "./SmallComponents";
import { deleteAction } from "../lib/mutations";
dayjs.locale("pt-br");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Display({
  accounts,
  actions,
  tags,
  steps,
  mutate,
  showDialog,
  setActionDate,
  setShowDialog,
  setActionToUpdate,
}) {
  //view state

  const [view, setView] = useState(1);
  //
  const [tag, setTag] = useState(tags[0]);
  const [step, setStep] = useState(steps[0]);
  const [account, setAccount] = useState(accounts[0]);
  //Coloca todas as ações em um array e achata para ter somente uma camada
  //Define todas as datas como objetos days()
  actions = actions.map((action) => ({ ...action, date: dayjs(action.date) }));
  //Ordena as ações por data e não por cliente
  // actions = actions.sort((a, b) => {
  //   return dayjs(a.date).diff(dayjs(b.date));
  // });

  actions = actions.sort((a, b) => {
    return a.date.diff(b.date);
  });

  const [date, setDate] = useState(dayjs());
  const firstDay = date.startOf("month").startOf("week");
  const lastDay = date.endOf("month").endOf("week");
  const monthDays = lastDay.diff(firstDay, "days") + 1;
  // const [HideAccounts, setHideAccounts] = useState(hideAccounts);
  // const [HideSteps, setHideSteps] = useState(hideSteps);

  const month = [];
  let currentDay = firstDay;

  for (let i = 0; i < monthDays / 7; i++) {
    month[i] = [];
    for (let j = 0; j < 7; j++) {
      month[i][j] = {};
      month[i][j].date = currentDay;
      month[i][j].actions = actions.filter(
        (action) =>
          action.date.format("D/M/YYYY") === currentDay.format("D/M/YYYY")
      );
      currentDay = currentDay.add(1, "d");
    }
  }

  const views = [
    {
      name: "Calendário",
      value: 1,
      icon: <HiOutlineCalendar className="text-2xl" />,
    },
    {
      name: "Quadro de Status",
      value: 2,
      icon: <CgBoard className="text-2xl" />,
    },
    {
      name: "Lista",
      value: 3,
      icon: <HiOutlineViewList className="text-2xl" />,
    },
    {
      name: "Instagram Grid",
      value: 4,
      icon: <MdOutlineGridOn className="text-2xl" />,
    },
  ];

  return (
    <>
      <Header
        accounts={accounts}
        views={views}
        view={view}
        setView={setView}
        setShowDialog={setShowDialog}
        setActionDate={setActionDate}
      />
      <Filters
        view={view}
        tags={tags}
        steps={steps}
        accounts={accounts}
        tag={tag}
        setTag={setTag}
        step={step}
        setStep={setStep}
        account={account}
        setAccount={setAccount}
      />
      {view === 1 ? (
        <Calendar
          month={month}
          date={date}
          setDate={setDate}
          step={step}
          tag={tag}
          mutate={mutate}
          account={account}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setActionToUpdate={setActionToUpdate}
          setActionDate={setActionDate}
        />
      ) : view === 2 ? (
        <Board
          actions={actions}
          date={date}
          setDate={setDate}
          steps={steps}
          tag={tag}
          mutate={mutate}
          account={account}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setActionToUpdate={setActionToUpdate}
        />
      ) : view === 3 ? (
        <List
          actions={actions.reverse()}
          date={date}
          setDate={setDate}
          step={step}
          tag={tag}
          mutate={mutate}
          account={account}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setActionToUpdate={setActionToUpdate}
        />
      ) : view === 4 ? (
        <Grid
          actions={actions.reverse()}
          date={date}
          setDate={setDate}
          step={step}
          tag={tag}
          mutate={mutate}
          account={account}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setActionToUpdate={setActionToUpdate}
        />
      ) : (
        <div>Nenhuma view está selecionada</div>
      )}

      {/* <div className="p-8 mb-12 bg-neutral-5 text-brand-400 rounded-2xl">
            <pre>{JSON.stringify(month, null, 2)}</pre>
          </div> */}
    </>
  );
}

const Header = ({
  accounts,
  views,
  view,
  setView,
  setShowDialog,
  setActionDate,
}) => {
  return (
    <div className="flex items-center justify-between py-2 mb-4 space-x-4">
      <div className="flex items-center">
        <h2 className="mb-0 font-bold text-neutral-5 w-52 ">
          {views[view - 1].name}
        </h2>
        <RadioGroup
          value={view}
          className="flex ml-4 space-x-2"
          onChange={setView}
        >
          {views.map((v) =>
            v.value != 4 ? (
              <RadioGroup.Option
                value={v.value}
                className="outline-none"
                key={v.name}
              >
                {({ checked }) => (
                  <button
                    className={`button button-text ${
                      checked ? "text-brand-600" : "text-neutral-3"
                    }`}
                  >
                    {v.icon}
                  </button>
                )}
              </RadioGroup.Option>
            ) : accounts.length === 1 ? (
              <RadioGroup.Option
                key={v.name}
                value={v.value}
                className="outline-none"
              >
                {({ checked }) => (
                  <button
                    className={`button button-text ${
                      checked ? "text-brand-600" : "text-neutral-3"
                    }`}
                  >
                    {v.icon}
                  </button>
                )}
              </RadioGroup.Option>
            ) : null
          )}
        </RadioGroup>
      </div>
      <div>
        <button
          className="button button-primary"
          onClick={() => {
            setActionDate(() => {
              setShowDialog(true);
              return dayjs().format("YYYY-MM-DD[T]HH:mm:ss[-03:00]");
              return "";
            });
          }}
        >
          Inserir Nova Ação
        </button>
      </div>
    </div>
  );
};

const Filters = ({
  view,
  tags,
  steps,
  accounts,
  tag,
  setTag,
  step,
  setStep,
  account,
  setAccount,
}) => {
  tags = [
    { id: 1000, name: "Todas as Tags", slug: "all", color: "#ccc" },
    ...tags,
  ];
  steps = [{ id: 1000, name: "Todos os Status", slug: "all" }, ...steps];
  accounts = [{ id: 1000, name: "Todas as Contas", slug: "all" }, ...accounts];

  useEffect(() => {
    setTag(tags[0]);
    setStep(steps[0]);
    setAccount(accounts[0]);
  }, []);
  return (
    view != 4 && (
      <div className="relative z-10 flex items-center justify-between mb-6 space-x-4">
        <div className="flex items-center space-x-2">
          <div>
            <HiOutlineFilter className="text-xl text-neutral-4" />
          </div>
          <div className="text-xs font-medium tracking-wider uppercase whitespace-nowrap">
            Filtrar por:
          </div>
        </div>
        {/* Filtrar por Tags */}
        <div className="relative w-52">
          <Listbox value={tag} onChange={setTag} className="relative w-54">
            {({ open }) => (
              <>
                <Listbox.Button className="relative flex items-center w-full space-x-2 text-left outline-none">
                  {tag.slug != "all" && (
                    <span className="text-xs tracking-widest text-neutral-4">
                      TAG:
                    </span>
                  )}
                  <span
                    className={`px-4 py-1 rounded-full truncate ${
                      tag.slug != "all" ? tag.slug + "-bg" : ""
                    }`}
                  >
                    {tag.name}
                  </span>
                  <HiOutlineChevronDown className="text-xl text-neutral-4" />
                </Listbox.Button>
                <Transition
                  show={open}
                  enter="transition duration-400 ease-out"
                  enterFrom="transform scale-75 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-400 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-75 opacity-0"
                >
                  <Listbox.Options
                    className="absolute w-full py-4 mt-1 overflow-hidden bg-white shadow-2xl outline-none rounded-2xl"
                    static
                  >
                    {tags.map((tag) => (
                      <Listbox.Option key={tag.slug} value={tag} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`${
                              selected
                                ? "bg-brand-700 font-bold text-white"
                                : active
                                ? "bg-brand-600 text-white"
                                : ""
                            } py-2 px-4 transition-colors duration-100 flex items-center justify-between  cursor-pointer`}
                          >
                            <div>{tag.name}</div>
                            {selected && (
                              <div>
                                <HiCheckCircle className="text-xl text-brand-200" />
                              </div>
                            )}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </>
            )}
          </Listbox>
        </div>
        {/* Filtrar por Status */}

        {view === 2 ? null : (
          <div className="relative w-52">
            <Listbox value={step} onChange={setStep} className="relative w-54">
              {({ open }) => (
                <>
                  <Listbox.Button className="relative flex items-center w-full space-x-2 text-left outline-none">
                    {step.slug != "all" && (
                      <span className="text-xs tracking-widest text-neutral-4">
                        STATUS:
                      </span>
                    )}

                    <span
                      className={`px-4 py-1 rounded-full truncate ${
                        step.slug != "all" ? step.slug + "-bg" : ""
                      }`}
                    >
                      {step.name}
                    </span>
                    <HiOutlineChevronDown className="text-xl text-neutral-4" />
                  </Listbox.Button>
                  <Transition
                    show={open}
                    enter="transition duration-400 ease-out"
                    enterFrom="transform scale-75 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-400 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-75 opacity-0"
                  >
                    <Listbox.Options
                      className="absolute w-full py-4 mt-1 overflow-hidden bg-white shadow-2xl outline-none rounded-2xl"
                      static
                    >
                      {steps.map((step) => (
                        <Listbox.Option
                          key={step.slug}
                          value={step}
                          as={Fragment}
                        >
                          {({ active, selected }) => (
                            <li
                              className={`${
                                selected
                                  ? "bg-brand-700 font-bold text-white"
                                  : active
                                  ? "bg-brand-600 text-white"
                                  : ""
                              } py-2 px-4 transition-colors duration-100 flex items-center justify-between  cursor-pointer`}
                            >
                              <div>{step.name}</div>
                              {selected && (
                                <div>
                                  <HiCheckCircle className="text-xl text-brand-200" />
                                </div>
                              )}
                            </li>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </>
              )}
            </Listbox>
          </div>
        )}
        {/* Filtrar por Clientes */}
        {accounts.length === 2 ? null : (
          <div className="relative w-72 ">
            <Listbox
              value={account}
              onChange={setAccount}
              className="relative w-54"
            >
              {({ open }) => (
                <>
                  <Listbox.Button className="relative flex items-center w-full space-x-2 text-left outline-none">
                    {account.slug != "all" && (
                      <span className="text-xs tracking-widest text-neutral-4">
                        CONTA:
                      </span>
                    )}
                    <span
                      className="px-4 py-1 rounded-full whitespace-nowrap"
                      style={
                        account.slug != "all"
                          ? {
                              backgroundColor: account.colors[0].hex,
                              color: account.colors[1].hex,
                            }
                          : {}
                      }
                    >
                      {account.name}
                    </span>
                    <HiOutlineChevronDown className="text-xl text-neutral-4" />
                  </Listbox.Button>
                  <Transition
                    show={open}
                    enter="transition duration-400 ease-out"
                    enterFrom="transform scale-75 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-400 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-75 opacity-0"
                  >
                    <Listbox.Options
                      className="absolute w-full py-4 mt-1 overflow-hidden bg-white shadow-2xl outline-none rounded-2xl"
                      static
                    >
                      {accounts.map((account) => (
                        <Listbox.Option
                          key={account.slug}
                          value={account}
                          as={Fragment}
                        >
                          {({ active, selected }) => (
                            <li
                              className={`${
                                selected
                                  ? "bg-brand-700 font-bold text-white"
                                  : active
                                  ? "bg-brand-600 text-white"
                                  : ""
                              } py-2 px-4 transition-colors duration-100 flex items-center justify-between  cursor-pointer`}
                            >
                              <div>{account.name}</div>
                              {selected && (
                                <div>
                                  <HiCheckCircle className="text-xl text-brand-200" />
                                </div>
                              )}
                            </li>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </>
              )}
            </Listbox>
          </div>
        )}
      </div>
    )
  );
};

const Calendar = ({
  month,
  date,
  setDate,
  tag,
  step,
  mutate,
  account,
  showDialog,
  setShowDialog,
  setActionToUpdate,
  setActionDate,
}) => {
  return (
    <div className="w-full overflow-hidden bg-white shadow rounded-2xl">
      <HeaderBar date={date} setDate={setDate} />
      <div className="grid grid-cols-7 border-t border-b">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div key={day} className="p-4 text-sm font-bold tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div>
        {month.map((week, wi) => {
          return (
            // Linha da Semana
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                // Célula do dia
                return (
                  <div
                    key={di}
                    className={`p-3 ${di < 6 ? " border-r" : ""} ${
                      wi < week.length ? " border-b" : ""
                    } hover:bg-gray-50 relative cell`}
                  >
                    {/* Número do dia */}
                    <div className="">
                      <span
                        className={`h-6 w-6 flex items-center justify-center rounded-full text-xs ${
                          day.date.month() !== date.month()
                            ? "text-neutral-3 "
                            : ""
                        } ${
                          day.date.format("D/M/YYYY") ===
                          dayjs().format("D/M/YYYY")
                            ? " text-brand-200 bg-brand-500 "
                            : ""
                        }`}
                      >
                        {day.date.format("D")}
                      </span>
                    </div>
                    {/* Ações */}
                    {day.actions.map((action) => {
                      // Caso tag.slug seja all
                      // ou o slug de alguma tag da action
                      // seja igual a tag.slug
                      // retorna true
                      return (tag.slug === "all" ||
                        (action.tags.length > 0 &&
                          action.tags.filter((_tag) => tag.slug === _tag.slug)
                            .length > 0)) &&
                        (step.slug === "all" ||
                          action.step.slug === step.slug) &&
                        (account.slug === "all" ||
                          action.account.slug === account.slug) ? (
                        <Action
                          action={action}
                          key={action.id}
                          mutate={mutate}
                          showDialog={showDialog}
                          setShowDialog={setShowDialog}
                          setActionToUpdate={setActionToUpdate}
                        />
                      ) : null;
                    })}
                    <button
                      className="absolute flex items-center justify-center invisible w-4 h-4 text-lg text-neutral-2 bg-neutral-5 rounded-full add-button right-4 top-4"
                      onClick={() => {
                        setActionDate(() => {
                          setShowDialog(true);
                          return (
                            day.date.format("YYYY-MM-DD") +
                            "T" +
                            dayjs().format("HH:mm:ss") +
                            "-03:00"
                          );
                        });
                      }}
                    >
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

//
//
//
//
//
// Board
//
//
//
//
//

const Board = ({
  actions,
  date,
  setDate,
  tag,
  steps,
  mutate,
  account,
  showDialog,
  setShowDialog,
  setActionToUpdate,
}) => {
  return (
    <div className="overflow-hidden bg-white shadow rounded-2xl">
      <HeaderBar date={date} setDate={setDate} />
      <div className="grid grid-cols-6 font-medium">
        {steps.map((step) => (
          <div key={step.id} className={`${step.slug}-bg p-4`}>
            {step.name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6">
        {steps.map((step) => (
          <div className="p-2 hover:bg-gray-50" key={step.id}>
            {actions.map((action) =>
              // Caso tag.slug seja all
              // ou o slug de alguma tag da action
              // seja igual a tag.slug
              // retorna true

              action.step.slug === step.slug &&
              dayjs(action.date).month() === date.month() &&
              (tag.slug === "all" ||
                (action.tags.length > 0 &&
                  action.tags.filter((_tag) => tag.slug === _tag.slug).length >
                    0)) &&
              (account.slug === "all" ||
                action.account.slug === account.slug) ? (
                <Action
                  action={action}
                  key={action.id}
                  mutate={mutate}
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  setActionToUpdate={setActionToUpdate}
                />
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

//
//
//
//
//
// List
//
//
//
//
//

const List = ({
  actions,
  date,
  setDate,
  tag,
  step,
  account,
  mutate,
  showDialog,
  setShowDialog,
  setActionToUpdate,
}) => {
  const [allActions, setAllActions] = useState(false);
  return (
    <div className="w-full overflow-hidden bg-white shadow rounded-2xl">
      <HeaderBar
        date={date}
        allActions={allActions}
        setAllActions={setAllActions}
        setDate={setDate}
      />

      <table className="w-full border-t">
        <thead className="text-xs font-bold tracking-wider text-left text-neutral-5 uppercase border-b">
          <tr>
            <th className="p-4">Nome</th>
            <th>Data</th>
            <th>Status</th>
            <th>Tags</th>
            <th className="text-center">Cliente</th>
            <th className="pr-8 text-right">Responsáveis</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) =>
            (dayjs(action.date).month() === date.month() || allActions) &&
            (tag.slug === "all" ||
              (action.tags.length > 0 &&
                action.tags.filter((_tag) => tag.slug === _tag.slug).length >
                  0)) &&
            (step.slug === "all" || action.step.slug === step.slug) &&
            (account.slug === "all" || action.account.slug === account.slug) ? (
              <tr className="text-sm border-t group" key={action.id}>
                <td className="col-span-2 font-medium text-neutral-5">
                  <div
                    className="p-4 cursor-pointer "
                    onClick={() => {
                      if (!action.clientOnly) {
                        setActionToUpdate(action.id);
                        setShowDialog(true);
                      }
                    }}
                  >
                    {action.name}
                  </div>
                </td>
                <td className="text-xs">
                  {dayjs(action.date).format(
                    "D [de] MMMM" +
                      (dayjs(action.date).year() != dayjs().year()
                        ? " [de] YYYY"
                        : "")
                  )}
                </td>
                <td>
                  <StepName step={action.step} />
                </td>
                <td>
                  {action.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className={`inline-block py-1 px-2 uppercase text-xx font-bold tracking-wide rounded-lg mr-1 ${tag.slug}-bg`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    <Avatar avatar={action.account} small />
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end pr-8">
                    <span className="flex items-center -space-x-2">
                      {action.profiles_responsible.map((responsible) => (
                        <Avatar
                          key={responsible.id}
                          avatar={responsible}
                          small
                          border
                        />
                      ))}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="flex items-center invisible transition-all duration-500 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0">
                    <button
                      className="button button-ghost button-small button-red"
                      onClick={() => {
                        deleteAction(action, mutate);
                      }}
                    >
                      <HiX className="text-xl " />
                    </button>
                  </span>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

//
//
//
//
//
// Grid
//
//
//
//
//

const Grid = ({
  actions,
  date,
  setDate,
  tag,
  step,
  mutate,
  account,
  setActionToUpdate,
  setShowDialog,
}) => {
  const _actions = actions;
  actions = actions.filter(
    (action) =>
      action.tags.filter((tag) => tag.slug === "post" || tag.slug === "reels")
        .length > 0
  );

  const start = date.startOf("month").startOf("week");
  const end = date.endOf("month").endOf("week");

  const [allActions, setAllActions] = useState(false);

  return (
    <div className="grid grid-cols-2 space-x-8 items-start ">
      <div className="w-full col-span-1 overflow-hidden shadow rounded-2xl">
        <HeaderBar
          date={date}
          allActions={allActions}
          setAllActions={setAllActions}
          setDate={setDate}
        />

        <div className="grid grid-cols-3 border-t bg-gray-50 instagram-grid">
          {actions.map((action, i) =>
            ((dayjs(action.date).isSameOrAfter(start) &&
              dayjs(action.date).isSameOrBefore(end)) ||
              allActions) &&
            (tag.slug === "all" ||
              (action.tags.length > 0 &&
                action.tags.filter((_tag) => tag.slug === _tag.slug).length >
                  0)) &&
            (step.slug === "all" || action.step.slug === step.slug) &&
            (account.slug === "all" || action.account.slug === account.slug) ? (
              <div
                key={i}
                className={`aspect-w-1 aspect-h-1 cell ${
                  action.clientOnly ? " cursor-wait opacity-25" : "  "
                }`}
              >
                <div className="flex flex-col justify-between p-4 transition-colors bg-white hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <HiOutlineCalendar className="text-sm text-neutral-3" />
                      <div className="text-xs text-neutral-4">
                        {dayjs(action.date).format("D/M")}
                        {dayjs(action.date).year() != dayjs().year() && (
                          <span className="font-medium text-neutral-5">
                            {dayjs(actions.date).format("/YYYY")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 text-xs rounded-lg ${action.step.slug}-bg`}
                    ></div>
                  </div>
                  <div
                    className="font-medium leading-tight text-center text-neutral-5 cursor-pointer"
                    onClick={() => {
                      if (!action.clientOnly) {
                        setActionToUpdate(action.id);
                        setShowDialog(true);
                      }
                    }}
                  >
                    {action.name}
                  </div>
                  <div className="flex flex-wrap items-center justify-center">
                    {action.tags.map((tag) => (
                      <div
                        className={`py-1 px-2 rounded-lg text-xx uppercase font-medium tracking-wide ${tag.slug}-bg m-0.5`}
                      >
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div>
        {_actions.map((action) =>
          (dayjs(action.date).isSameOrAfter(start) &&
            dayjs(action.date).isSameOrBefore(end)) ||
          allActions ? (
            <div
              key={action.id}
              className={`py-3 px-4 w-full rounded-lg flex space-x-4 items-center hover:bg-white transition cursor-pointer hover:shadow`}
            >
              <div className="w-8 text-xs">
                {dayjs(action.date).format("D[/]M")}
              </div>
              <div
                className={`w-full ${
                  action.tags.find((tag) =>
                    ["post", "reels"].find((slug) => slug === tag.slug)
                  )
                    ? "font-bold text-neutral-5"
                    : ""
                }`}
                onClick={() => {
                  setActionToUpdate(action.id);
                  setShowDialog(true);
                }}
              >
                {action.name}
              </div>
              <div className="w-36">
                <StepName step={action.step} />
              </div>
              <div className="flex justify-end w-24 -space-x-1">
                {action.profiles_responsible.map((responsible) => (
                  <Avatar
                    key={responsible.id}
                    avatar={responsible}
                    small={true}
                    border={true}
                  />
                ))}
              </div>
              <div>
                <span className="flex items-center">
                  <button
                    className="button button-ghost button-small button-red"
                    onClick={() => {
                      deleteAction(action, mutate);
                    }}
                  >
                    <HiX className="text-xl " />
                  </button>
                </span>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

//
//
//
//
//
// HeaderBar
//
//
//
//
//

const HeaderBar = ({ date, allActions, setAllActions, setDate }) => (
  <div className="flex items-center justify-between p-4 bg-white">
    <div className="flex items-center space-x-4">
      {/* Mês */}
      {!allActions && (
        <div className="flex items-center py-1 space-x-2">
          <h5 className="w-24 mb-0 text-sm">{date.format("MMMM")}</h5>
          <button
            className="ml-8 button button-small button-ghost "
            onClick={(e) => {
              e.preventDefault();
              setDate(date.subtract(1, "month"));
            }}
          >
            <HiOutlineChevronLeft className="text-lg" />
          </button>
          <button
            className="button button-small button-ghost"
            onClick={(e) => {
              e.preventDefault();
              setDate(date.add(1, "month"));
            }}
          >
            <HiOutlineChevronRight className="text-lg" />
          </button>
        </div>
      )}
      {allActions != undefined && (
        <div className="py-2">
          <Switch.Group className="flex items-center space-x-2" as="div">
            <Switch
              checked={allActions}
              onChange={setAllActions}
              className={`${
                allActions ? "bg-green-400" : "bg-neutral-2"
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span
                className={`${
                  allActions ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-all`}
              />
            </Switch>
            <Switch.Label>Mostrar todas as ações</Switch.Label>
          </Switch.Group>
        </div>
      )}
    </div>
    {!allActions && (
      <div className="flex items-center">
        <div className="text-sm font-bold">{date.format("YYYY")}</div>
        <button className="button button-small button-ghost">
          <HiOutlineChevronDown className="text-lg" />
        </button>
      </div>
    )}
  </div>
);
