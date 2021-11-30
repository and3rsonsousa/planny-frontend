import { useState } from "react";
import { TiSortNumerically } from "react-icons/ti";
import { FaPercent } from "react-icons/fa";

export function StepsInsight({ steps }) {
  let total = 0;
  let allActions = 0;
  steps.map((step) => (allActions += step.actions.length));

  const [percentage, setPercentage] = useState(true);
  return (
    <div className="my-4">
      <h3 className="mb-2 text-neutral-5">Status</h3>
      <div className="flex justify-between mb-4 text-sm text-gray-400">
        <div>Número de Ações por Status</div>
        <ButtonInsights setPercentage={setPercentage} percentage={percentage} />
      </div>
      <div className="w-full status-demo">
        {steps.map((step, index) => {
          const count = step.actions.length;
          total += count;
          return count ? (
            <div
              className={`${step.slug}-bg p-2 overflow-hidden flex-auto`}
              key={index}
              style={{
                width: (count / allActions) * 100 + "%",
              }}
            >
              <div className="font-bold tracking-wider uppercase text-xx ">
                {percentage
                  ? Math.ceil((count / allActions) * 100) + "%"
                  : step.actions.length}
              </div>
            </div>
          ) : null;
        })}
        {total === 0 && (
          <div className="text-xs tracking-wider">
            Não existe nenhuma ação cadastrada para poder exibir o relatório de
            status.
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountsInsight({ accounts, actions }) {
  const [percentage, setPercentage] = useState(true);
  return (
    <div className="my-4">
      <h3 className="mb-2 text-neutral-5">Clientes</h3>
      <div className="flex justify-between mb-4 text-sm text-gray-400">
        <div>Número de Ações por Clientes</div>
        <ButtonInsights setPercentage={setPercentage} percentage={percentage} />
      </div>

      <div className="w-full status-demo">
        {accounts.map((account, index) => {
          const total = actions.filter(
            (action) => action.account.id === account.id
          ).length;
          // const total = account.actions.length;
          return total ? (
            <div
              className={`p-2 overflow-hidden flex-auto`}
              key={index}
              style={{
                width: (total / actions.length) * 100 + "%",
                backgroundColor: account.colors[0].hex || "#789",
                color: account.colors[1].hex || "#fff",
              }}
            >
              <div className="relative flex justify-center font-bold tracking-wider uppercase text-xx ">
                {percentage
                  ? `${Math.round((total / actions.length) * 100)}%`
                  : total}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

function ButtonInsights({ percentage, setPercentage }) {
  return (
    <button
      className="font-medium tracking-wider text-gray-500 uppercase text-xx"
      onClick={() => setPercentage(!percentage)}
    >
      {percentage ? (
        <TiSortNumerically className="text-lg" />
      ) : (
        <FaPercent className="text-xx" />
      )}
    </button>
  );
}
