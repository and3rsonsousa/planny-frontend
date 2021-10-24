export function StepsInsight({ steps }) {
  let total = 0;
  return (
    <div className="my-4">
      <h3 className="text-gray-700">Status</h3>
      <div className="w-full status-demo">
        {steps.map((step, index) => {
          const count = step.actions.length;
          total += count;
          return count ? (
            <div
              className={`${step.slug}-bg p-2 overflow-hidden flex-auto`}
              key={index}
              style={{
                width: (count / 4) * 100 + "%",
              }}
            >
              <div className="relative flex justify-center font-bold tracking-wider uppercase text-xx ">
                <div className="overflow-hidden truncate ">{step.name}</div>(
                {step.actions.length})
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
  return (
    <div className="my-4">
      <h3 className="text-gray-700">Clientes</h3>
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
                <div className="overflow-hidden truncate ">{account.name}</div>(
                {total})
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
