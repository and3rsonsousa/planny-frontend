export function StepsInsight({ steps }) {
  return (
    <div className="my-4">
      <h3 className="text-gray-700">Status</h3>
      <div className="status-demo w-full">
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
              <div className="uppercase text-xx font-bold tracking-wider flex justify-center relative ">
                <div className="truncate  overflow-hidden ">{step.name}</div>(
                {step.actions.length})
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export function AccountsInsight({ accounts }) {
  return (
    <div className="my-4">
      <h3 className="text-gray-700">Clientes</h3>
      <div className="status-demo w-full">
        {accounts.map((account, index) => {
          const count = account.actions.length;
          return count ? (
            <div
              className={`p-2 overflow-hidden flex-auto`}
              key={index}
              style={{
                width: (count / 4) * 100 + "%",
                backgroundColor: account.colors[0].hex || "#789",
                color: account.colors[1].hex || "#fff",
              }}
            >
              <div className="uppercase text-xx font-bold tracking-wider flex justify-center relative ">
                <div className="truncate  overflow-hidden ">{account.name}</div>
                ({account.actions.length})
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
