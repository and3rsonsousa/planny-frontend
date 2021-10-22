export function StepsInsight({ steps }) {
  return (
    <div className="my-4">
      <h3 className="text-gray-700">Status</h3>
      <div className="w-full status-demo">
        {steps.map((step, index) => {
          const count = step.actions.length;

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
          const total = actions.length;
          return total ? (
            <div
              className={`p-2 overflow-hidden flex-auto`}
              key={index}
              style={{
                width: (total / 4) * 100 + "%",
                backgroundColor: account.colors[0].hex || "#789",
                color: account.colors[1].hex || "#fff",
              }}
            >
              <div className="relative flex justify-center font-bold tracking-wider uppercase text-xx ">
                <div className="overflow-hidden truncate ">{account.name}</div>(
                {
                  actions.filter((action) => action.account.id === account.id)
                    .length
                }
                )
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
