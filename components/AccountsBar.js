import AccountAvatar from "./Avatar";
import Link from "next/link";

export default function AccountsBar({ small, medium, accounts }) {
  return (
    <div className={`w-full overflow-x-auto`}>
      <div className="flex justify-center w-full py-2">
        {accounts.map((account, j) => (
          <div
            key={j}
            className={`transform 
            transition-transform
            duration-500 
            hover:-translate-y-2
            ${small ? " w-8 p-1" : medium ? " w-12 p-2 " : "p-2"}
            cursor-pointer
            `}
          >
            <Link href={`/${account.slug}`} key={account.slug}>
              <div className="flex flex-col items-center">
                <AccountAvatar avatar={account} small={small} medium={medium} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
