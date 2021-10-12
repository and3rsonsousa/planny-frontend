import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/pt-br";
import { RadioGroup, Listbox, Transition, Switch } from "@headlessui/react";
import {
  HiCheck,
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFilter,
  HiOutlineViewList,
  HiX,
} from "react-icons/hi";
import { MdOutlineGridOn } from "react-icons/md";
import { CgBoard } from "react-icons/cg";
import Action from "./Action";
import ClientAvatar from "./ClientAvatar";
dayjs.locale("pt-br");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Display({
  clients,
  tags,
  statuses,
  showDialog,
  setShowDialog,
}) {
  //view state

  const [view, setView] = useState(1);
  //
  const [tag, setTag] = useState(tags[0]);
  const [status, setStatus] = useState(statuses[0]);
  const [client, setClient] = useState(clients[0]);
  //Coloca todas as ações em um array e achata para ter somente uma camada
  let actions = clients.map((client) => client.actions).flat();
  //Ordena as ações por data e não por cliente
  actions = actions.sort((a, b) => {
    return dayjs(a.date).diff(dayjs(b.date));
  });
  //Define todas as datas como objetos days()
  actions = actions.map((action) => ({ ...action, date: dayjs(action.date) }));

  const [date, setDate] = useState(dayjs());
  const firstDay = date.startOf("month").startOf("week");
  const lastDay = date.endOf("month").endOf("week");
  const monthDays = lastDay.diff(firstDay, "days") + 1;

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
      <Header clients={clients} views={views} view={view} setView={setView} />
      <Filters
        view={view}
        tags={tags}
        statuses={statuses}
        clients={clients}
        tag={tag}
        setTag={setTag}
        status={status}
        setStatus={setStatus}
        client={client}
        setClient={setClient}
      />
      {view === 1 ? (
        <Calendar
          month={month}
          date={date}
          setDate={setDate}
          status={status}
          tag={tag}
          client={client}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      ) : view === 3 ? (
        <List
          actions={actions}
          date={date}
          setDate={setDate}
          status={status}
          tag={tag}
          client={client}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      ) : view === 4 ? (
        <Grid
          actions={actions.reverse()}
          date={date}
          setDate={setDate}
          status={status}
          tag={tag}
          client={client}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      ) : (
        <div>Nenhuma view está selecionada</div>
      )}

      {/* <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
            <pre>{JSON.stringify(month, null, 2)}</pre>
          </div> */}
    </>
  );
}

const Header = ({ clients, views, view, setView }) => {
  return (
    <div className="py-2 mb-4 flex items-center">
      <h2 className="text-gray-900 font-bold mb-0 w-52 ">
        {views[view - 1].name}
      </h2>
      <RadioGroup
        value={view}
        className="flex space-x-2 ml-4"
        onChange={setView}
      >
        {views.map((v) =>
          v.value != 4 ? (
            <RadioGroup.Option value={v.value} className="outline-none">
              {({ checked }) => (
                <button
                  className={`button button-text ${
                    checked ? "text-brand-600" : "text-gray-300"
                  }`}
                >
                  {v.icon}
                </button>
              )}
            </RadioGroup.Option>
          ) : clients.length === 1 ? (
            <RadioGroup.Option value={v.value} className="outline-none">
              {({ checked }) => (
                <button
                  className={`button button-text ${
                    checked ? "text-brand-600" : "text-gray-300"
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
  );
};

const Filters = ({
  view,
  tags,
  statuses,
  clients,
  tag,
  setTag,
  status,
  setStatus,
  client,
  setClient,
}) => {
  tags = [
    { id: 1000, name: "Todas as Tags", slug: "all", color: "#ccc" },
    ...tags,
  ];
  statuses = [{ id: 1000, name: "Todos os Status", slug: "all" }, ...statuses];
  clients = [{ id: 1000, name: "Todos os Clientes", slug: "all" }, ...clients];
  useEffect(() => {
    setTag(tags[0]);
    setStatus(statuses[0]);
    setClient(clients[0]);
  }, []);
  return (
    view != 4 && (
      <div className="flex relative z-10 items-center space-x-4 justify-between mb-6">
        <div className="flex space-x-2 items-center">
          <div>
            <HiOutlineFilter className="text-xl text-gray-400" />
          </div>
          <div>Filtrar por:</div>
        </div>
        {/* Filtrar por Tags */}
        <div className="relative w-52">
          <Listbox value={tag} onChange={setTag} className="relative w-54">
            {({ open }) => (
              <>
                <Listbox.Button className="relative w-full text-left flex items-center space-x-2 outline-none">
                  {tag.slug != "all" && (
                    <span className="text-xs tracking-widest text-gray-400">
                      TAG:
                    </span>
                  )}
                  <span
                    className="py-1 px-4 rounded-full"
                    style={
                      tag.slug != "all"
                        ? {
                            backgroundColor: tag.color,
                            color: "white",
                          }
                        : {}
                    }
                  >
                    {tag.name}
                  </span>
                  <HiOutlineChevronDown className="text-xl text-gray-400" />
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
                    className="outline-none mt-1 absolute w-full bg-white overflow-hidden rounded-2xl shadow-2xl py-4"
                    static
                  >
                    {tags.map((tag) => (
                      <Listbox.Option key={tag.slug} value={tag} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`${
                              selected
                                ? "bg-brand-700 font-semibold text-white"
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
        <div className="relative w-52">
          <Listbox
            value={status}
            onChange={setStatus}
            className="relative w-54"
          >
            {({ open }) => (
              <>
                <Listbox.Button className="relative w-full text-left flex items-center space-x-2 outline-none">
                  {status.slug != "all" && (
                    <span className="text-xs tracking-widest text-gray-400">
                      STATUS:
                    </span>
                  )}

                  <span
                    className="py-1 px-4 rounded-full"
                    style={
                      status.slug != "all"
                        ? {
                            backgroundColor: status.color || "#abc",
                            color: "white",
                          }
                        : {}
                    }
                  >
                    {status.name}
                  </span>
                  <HiOutlineChevronDown className="text-xl text-gray-400" />
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
                    className="outline-none mt-1 absolute w-full bg-white overflow-hidden rounded-2xl shadow-2xl py-4"
                    static
                  >
                    {statuses.map((status) => (
                      <Listbox.Option
                        key={status.slug}
                        value={status}
                        as={Fragment}
                      >
                        {({ active, selected }) => (
                          <li
                            className={`${
                              selected
                                ? "bg-brand-700 font-semibold text-white"
                                : active
                                ? "bg-brand-600 text-white"
                                : ""
                            } py-2 px-4 transition-colors duration-100 flex items-center justify-between  cursor-pointer`}
                          >
                            <div>{status.name}</div>
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
        {/* Filtrar por Clientes */}
        <div className="relative w-72 ">
          <Listbox
            value={client}
            onChange={setClient}
            className="relative w-54"
          >
            {({ open }) => (
              <>
                <Listbox.Button className="relative w-full text-left flex items-center space-x-2 outline-none">
                  {client.slug != "all" && (
                    <span className="text-xs tracking-widest text-gray-400">
                      TAG:
                    </span>
                  )}
                  <span
                    className="py-1 px-4 rounded-full overflow-ellipsis truncate"
                    style={
                      client.slug != "all"
                        ? {
                            backgroundColor: client.bgColor,
                            color: client.fgColor,
                          }
                        : {}
                    }
                  >
                    {client.name}
                  </span>
                  <HiOutlineChevronDown className="text-xl text-gray-400" />
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
                    className="outline-none mt-1 absolute w-full bg-white overflow-hidden rounded-2xl shadow-2xl py-4"
                    static
                  >
                    {clients.map((client) => (
                      <Listbox.Option
                        key={client.slug}
                        value={client}
                        as={Fragment}
                      >
                        {({ active, selected }) => (
                          <li
                            className={`${
                              selected
                                ? "bg-brand-700 font-semibold text-white"
                                : active
                                ? "bg-brand-600 text-white"
                                : ""
                            } py-2 px-4 transition-colors duration-100 flex items-center justify-between  cursor-pointer`}
                          >
                            <div>{client.name}</div>
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
      </div>
    )
  );
};

const Calendar = ({
  month,
  date,
  setDate,
  tag,
  status,
  client,
  showDialog,
  setShowDialog,
}) => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden w-full">
      <HeaderBar date={date} setDate={setDate} />
      <div className="border-b border-t grid grid-cols-7">
        {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
          <div key={day} className="p-4 font-semibold text-sm tracking-wider">
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
                    } hover:bg-gray-50 `}
                  >
                    {/* Número do dia */}
                    <div className="">
                      <span
                        className={`h-6 w-6 flex items-center justify-center rounded-full text-xs ${
                          day.date.month() !== date.month()
                            ? "text-gray-300 "
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
                        (status.slug === "all" ||
                          action.status.slug === status.slug) &&
                        (client.slug === "all" ||
                          action.client.slug === client.slug) ? (
                        <Action
                          action={action}
                          key={action.id}
                          showDialog={showDialog}
                          setShowDialog={setShowDialog}
                        />
                      ) : null;
                    })}
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

const List = ({ actions, date, setDate, tag, status, client }) => {
  const [allActions, setAllActions] = useState(false);
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden w-full">
      <HeaderBar
        date={date}
        allActions={allActions}
        setAllActions={setAllActions}
        setDate={setDate}
      />

      <table className="w-full border-t">
        <thead className="text-left text-gray-700 font-semibold border-b">
          <tr>
            <th className="p-4">Nome</th>
            <th>Data</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Cliente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) =>
            (dayjs(action.date).month() === date.month() || allActions) &&
            (tag.slug === "all" ||
              (action.tags.length > 0 &&
                action.tags.filter((_tag) => tag.slug === _tag.slug).length >
                  0)) &&
            (status.slug === "all" || action.status.slug === status.slug) &&
            (client.slug === "all" || action.client.slug === client.slug) ? (
              <tr className="border-t text-sm" key={action.id}>
                <td className="p-4  col-span-2 text-gray-600 font-medium">
                  {action.name}
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
                  <span
                    className={`py-1 px-2 inline-block rounded-lg ${action.status.slug}-bg text-xx uppercase font-semibold tracking-wide `}
                  >
                    {action.status.name}
                  </span>
                </td>
                <td>
                  {action.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className={`inline-block py-1 px-2 uppercase text-xx font-semibold tracking-wide rounded-lg mr-1 ${tag.slug}-bg`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </td>
                <td>
                  <span className="flex items-center space-x-2">
                    <ClientAvatar client={action.client} small={true} />
                    <span>{action.client.name}</span>
                  </span>
                </td>
                <td>
                  <span className="flex items-center space-x-2">
                    <button className="button button-ghost button-small">
                      <HiCheck className="text-xl " />
                    </button>
                    <button className="button button-ghost button-small">
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

const Grid = ({ actions, date, setDate, tag, status, client }) => {
  actions = actions.filter(
    (action) => action.tags.filter((tag) => tag.slug === "post").length > 0
  );

  const start = date.startOf("month").startOf("week");
  const end = date.endOf("month").endOf("week");

  const [allActions, setAllActions] = useState(false);
  return (
    <div className="grid grid-cols-4 space-x-8">
      <div className="col-span-2 shadow rounded-2xl overflow-hidden w-full">
        <HeaderBar
          date={date}
          allActions={allActions}
          setAllActions={setAllActions}
          setDate={setDate}
        />

        <div className="bg-gray-50 grid grid-cols-3 border-t instagram-grid">
          {actions.map((action, i) =>
            ((dayjs(action.date).isSameOrAfter(start) &&
              dayjs(action.date).isSameOrBefore(end)) ||
              allActions) &&
            (tag.slug === "all" ||
              (action.tags.length > 0 &&
                action.tags.filter((_tag) => tag.slug === _tag.slug).length >
                  0)) &&
            (status.slug === "all" || action.status.slug === status.slug) &&
            (client.slug === "all" || action.client.slug === client.slug) ? (
              <div key={i} className={`aspect-w-1 aspect-h-1 cell`}>
                <div className="p-4 flex flex-col justify-between bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <HiOutlineCalendar className="text-sm text-gray-300" />
                      <div className="text-gray-400 text-xs">
                        {dayjs(action.date).format("D/M")}
                        {dayjs(action.date).year() != dayjs().year() && (
                          <span className="font-medium text-gray-600">
                            {dayjs(actions.date).format("/YYYY")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 text-xs rounded-lg ${action.status.slug}-bg`}
                    ></div>
                  </div>
                  <div className="text-center font-medium text-gray-700">
                    {action.name}
                  </div>
                  <div className="flex flex-wrap justify-center items-center">
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
        <div>Outras Ações que não são post ou Reels</div>
      </div>
    </div>
  );
};

const HeaderBar = ({ date, allActions, setAllActions, setDate }) => (
  <div className="p-4 flex items-center justify-between bg-white">
    <div className="flex space-x-4 items-center">
      {/* Mês */}
      {!allActions && (
        <div className="flex items-center space-x-2 py-1">
          <h5 className="mb-0 text-sm w-24">{date.format("MMMM")}</h5>
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
                allActions ? "bg-green-400" : "bg-gray-200"
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
        <div className="text-sm font-semibold">{date.format("YYYY")}</div>
        <button className="button button-small button-ghost">
          <HiOutlineChevronDown className="text-lg" />
        </button>
      </div>
    )}
  </div>
);
