import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import Action from "./Action";

const Display = ({ clients }) => {
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
      <h1>Display</h1>
      <div className="xl:grid grid-cols-4">
        <div className="col-span-3">
          <div>
            <h5>Calendário</h5>
            <div className="bg-white shadow rounded-2xl overflow-hidden w-full">
              <div className="border-b grid grid-cols-7">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                  (day) => (
                    <th key={day} className="py-4">
                      {day}
                    </th>
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
                            className={`p-2 ${di < 7 ? " border-l" : ""} ${
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
                                  date.format("D/M/YYYY")
                                    ? " text-brand-100 bg-brand-500 "
                                    : ""
                                }`}
                              >
                                {day.date.format("D")}
                              </span>
                            </div>
                            {/* Ações */}
                            {day.actions.map((action) => (
                              <Action action={action} />
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
          <div className="p-8 text-brand-400 bg-gray-800 rounded-2xl mb-12">
            <pre>{JSON.stringify(month, null, 2)}</pre>
          </div>
          <div>List</div>
        </div>
        <div className="col-span-1">Grid</div>
      </div>
    </div>
  );
};

export default Display;
