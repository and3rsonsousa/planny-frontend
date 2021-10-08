import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { RadioGroup, Listbox, Transition } from "@headlessui/react";
import {
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFilter,
  HiOutlineViewList,
} from "react-icons/hi";
import { MdOutlineGridOn } from "react-icons/md";

import Action from "./Action";
import { Fragment } from "react/cjs/react.development";

dayjs.locale("pt-br");
export default function Display({ clients, tags, statuses }) {
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

  return (
    <div>
      <h3 className="text-gray-700">Ações</h3>
      <Header view={view} setView={setView} />
      <Filters
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
      <Calendar
        month={month}
        date={date}
        setDate={setDate}
        status={status}
        tag={tag}
        client={client}
      />
      <div>List</div>
      <div className="col-span-1">Grid</div>
      {/* <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
            <pre>{JSON.stringify(month, null, 2)}</pre>
          </div> */}
    </div>
  );
}

const Filters = ({
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
    <div className="flex items-center space-x-4 justify-between mb-6">
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
        <Listbox value={status} onChange={setStatus} className="relative w-54">
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
        <Listbox value={client} onChange={setClient} className="relative w-54">
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
  );
};

const Header = ({ view, setView }) => {
  return (
    <div className="py-2 mb-4 flex items-center">
      <h4 className="text-gray-700 mb-0">Calendário</h4>
      <RadioGroup
        value={view}
        className="flex space-x-2 ml-4"
        onChange={setView}
      >
        {/* Button Calendário */}
        <RadioGroup.Option value={1} className="outline-none">
          {({ checked }) => (
            <button
              className={`button button-text ${
                checked ? "text-brand-600" : "text-gray-300"
              }`}
            >
              <HiOutlineCalendar className="text-2xl" />
            </button>
          )}
        </RadioGroup.Option>
        {/* Button Lista */}
        <RadioGroup.Option value={2} className="outline-none">
          {({ checked }) => (
            <button
              className={`button button-text ${
                checked ? "text-brand-600" : "text-gray-300"
              }`}
            >
              <HiOutlineViewList className="text-2xl" />
            </button>
          )}
        </RadioGroup.Option>
        {/* Button Instagram Grid */}
        <RadioGroup.Option value={3} className="outline-none">
          {({ checked }) => (
            <button
              className={`button button-text ${
                checked ? "text-brand-600" : "text-gray-300"
              }`}
            >
              <MdOutlineGridOn className="text-2xl" />
            </button>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
};

const Calendar = ({ month, date, setDate, tag, status, client }) => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden w-full">
      <div className="p-4 flex items-center justify-between">
        {/* Mês */}
        <div className="flex items-center space-x-2">
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

        <div className="flex items-center">
          <h3 className="mb-0">{date.format("YYYY")}</h3>
          <button className="button button-small button-ghost">
            <HiOutlineChevronDown className="text-lg" />
          </button>
        </div>
      </div>
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
                    className={`p-2 ${di < 6 ? " border-r" : ""} ${
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
                        <Action action={action} key={action.id} />
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
