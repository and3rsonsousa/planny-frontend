import { useState } from "react";

export function StepsInsight({ steps }) {
  let total = 0;
  let allActions = 0;
  steps.map((step) => (allActions += step.actions.length));

  const [percentage, setPercentage] = useState(false);
  return (
    <div className="my-4">
      <h3 className="text-neutral-5 mb-2">Status</h3>
      <div className="text-sm text-gray-400 mb-4 flex justify-between">
        <div>Número de Ações por Status</div>
        <button
          className="uppercase text-xx tracking-wider font-medium text-gray-500"
          onClick={() => setPercentage(!percentage)}
        >
          Ver {percentage ? "Total" : "Porcentagem"}
        </button>
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
              <div className="relative flex justify-center font-bold tracking-wider uppercase text-xx ">
                <div className="overflow-hidden truncate ">{step.name}</div>(
                {percentage
                  ? Math.ceil((count / allActions) * 100) + "%"
                  : step.actions.length}
                )
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
  const [percentage, setPercentage] = useState(false);
  return (
    <div className="my-4">
      <h3 className="text-neutral-5 mb-2">Clientes</h3>
      <div className="text-sm text-gray-400 mb-4 flex justify-between">
        <div>Número de Ações por Clientes</div>
        <button
          className="uppercase text-xx tracking-wider font-medium text-gray-500"
          onClick={() => setPercentage(!percentage)}
        >
          Ver {percentage ? "Total" : "Porcentagem"}
        </button>
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
