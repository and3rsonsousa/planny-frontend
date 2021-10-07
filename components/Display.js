import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { RadioGroup } from "@headlessui/react";
import Action from "./Action";

dayjs.locale("pt-br");
export default function Display({ clients }) {
  //view state
  const [view, setView] = useState(1);
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
      <div className="flex justify-between mb-2">
        <div>Filtros de Ações</div>
        <div>Filtros de Status</div>
        <div>Filtros de Clientes</div>
      </div>
      <div className="xl:grid grid-cols-4">
        <div className="col-span-3">
          <div>
            <div className="py-2 mb-4 flex items-center">
              <h4 className="text-gray-700 mb-0">Calendário</h4>
              <RadioGroup
                value={view}
                className="flex space-x-2 ml-4"
                onChange={setView}
              >
                {/* Button Calendário */}
                <RadioGroup.Option value={1}>
                  {({ checked }) => (
                    <button
                      className={`button button-text ${
                        checked ? "text-brand-600" : "text-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </RadioGroup.Option>
                {/* Button Lista */}
                <RadioGroup.Option value={2}>
                  {({ checked }) => (
                    <button
                      className={`button button-text ${
                        checked ? "text-brand-600" : "text-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </button>
                  )}
                </RadioGroup.Option>
                {/* Button Instagram Grid */}
                <RadioGroup.Option value={3}>
                  {({ checked }) => (
                    <button
                      className={`button button-text ${
                        checked ? "text-brand-600" : "text-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                  )}
                </RadioGroup.Option>
              </RadioGroup>
            </div>
            <div className="bg-white shadow rounded-2xl overflow-hidden w-full">
              <div className="p-4 flex items-center justify-between">
                {/* Mês */}
                <div className="flex items-center space-x-2">
                  <h5 className="mb-0 text-sm">{date.format("MMMM")}</h5>
                  <button
                    className="ml-8 button button-small button-ghost "
                    onClick={(e) => {
                      e.preventDefault();
                      setDate(date.subtract(1, "month"));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    className="button button-small button-ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setDate(date.add(1, "month"));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <h3 className="mb-0">{date.format("YYYY")}</h3>
                  <button className="button button-small button-ghost">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="border-b border-t grid grid-cols-7">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-4 font-semibold text-xs tracking-wider"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div>
                {month.map((week, wi) => {
                  return (
                    <div key={wi} className="grid grid-cols-7">
                      {week.map((day, di) => {
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
                            {day.actions.map((action) => (
                              <Action action={action} key={action.id} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
            <pre>{JSON.stringify(month, null, 2)}</pre>
          </div> */}
          <div>List</div>
        </div>
        <div className="col-span-1">Grid</div>
      </div>
    </div>
  );
}
